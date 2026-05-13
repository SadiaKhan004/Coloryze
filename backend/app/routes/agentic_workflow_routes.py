import json
import logging
import tempfile
import os
import base64
import random
import asyncio
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import StreamingResponse
from typing import Optional
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
import aiohttp

from app.services import image_service
from app.services.report_services import save_report, save_color_palette
from app.utils.auth_utils import decode_access_token
from app.models.user import User
from app.models.database import get_db
from app.ai.color_query_builder import build_color_queries
from app.ai.tools.parallel_search_tool import ParallelSearchTool
from app.ai.report_generator_agent import FinalAnswerTool
from app.ai.garment_agent_async import run_garment_match
from app.ai.color_analyzer_cv import analyze_image
from app.ai.virtual_try_on import generate_virtual_tryon

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Automated Workflow"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

_parallel_tool = ParallelSearchTool(max_results_per_query=2, scrape_timeout=40, max_results=2)
_final_tool = FinalAnswerTool()


@router.post("/automated-analysis-stream/")
async def automated_analysis_stream(
    file: UploadFile = File(...),
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
    generate_report: Optional[bool] = Form(True),
    outfit_recommendations: Optional[bool] = Form(False),
):
    async def event_generator():
        try:
            # --- Authenticate user ---
            payload = decode_access_token(token)
            user_email = payload.get("sub")
            if not user_email:
                raise HTTPException(status_code=401, detail="Invalid token payload")
            user = db.query(User).filter(User.email == user_email).first()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            user_id = user.id

            # --- Validate file ---
            if not file.content_type.startswith("image/"):
                raise HTTPException(status_code=400, detail="Uploaded file must be an image")

            # --- Save uploaded image ---
            image_result = await image_service.save_uploaded_image(file, user_id, db)
            if not image_result or image_result.get("status") != "success":
                raise HTTPException(status_code=500, detail="Image upload failed")

            # --- Read uploaded image for virtual try-on ---
            await file.seek(0)
            user_image_bytes = await file.read()

            # --- Analyze image ---
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp:
                temp.write(user_image_bytes)
                temp_path = temp.name
            try:
                ai_result = analyze_image(temp_path)
            finally:
                os.remove(temp_path)

            # --- Stream AI result ---
            yield json.dumps({"stage": "ai_result", "ai_result": ai_result}) + "\n"

            final_output = {}

            # --- Generate report ---
            if generate_report:
                queries = build_color_queries(ai_result)
                search_result_str = await _parallel_tool.forward(queries)
                combined_corpus = json.loads(search_result_str).get("combined_content", "")
                final_output_str = _final_tool.forward(scraped_text=combined_corpus, ai_result=ai_result)
                final_output = json.loads(final_output_str)

                yield json.dumps({
                    "stage": "report",
                    "username": user.username,
                    "recommended_palette": final_output.get("recommended_palette", {}),
                    "final_report": final_output.get("final_report", "")
                }) + "\n"

                # Save report & palette
                try:
                    save_report(db, user_id, {"final_report": final_output.get("final_report", "")})
                    save_color_palette(db, user_id, final_output.get("recommended_palette", {}))
                except Exception as db_exc:
                    logger.error(f"Failed to save report/palette: {db_exc}")

            # --- Outfit recommendations ---
            if outfit_recommendations:
                palette = final_output.get("recommended_palette", {})
                outfit_results = []
                main_colors = palette.get("main_colors", [])
                user_gender = user.gender.lower() if user.gender else "female"

                # --- Randomly select up to 4 colors ---
                if len(main_colors) > 4:
                    selected_colors = random.sample(main_colors, 4)
                else:
                    selected_colors = main_colors

                logger.info(f"🎨 Selected {len(selected_colors)} colors for garment matching.")

                # --- Run all garment searches concurrently ---
                tasks = [
                    run_garment_match(
                        c["hex"],
                        "https://pk.sapphireonline.pk/",
                        gender=user_gender,
                        max_matches_per_color=1
                    )
                    for c in selected_colors
                ]

                results = await asyncio.gather(*tasks, return_exceptions=True)

                for r in results:
                    if isinstance(r, list) and r:
                        outfit_results.append(r[0])

                # --- Deduplicate garments by URL ---
                seen = set()
                deduped = []
                for item in outfit_results:
                    url = item.get("url") or ""
                    if url and url not in seen:
                        seen.add(url)
                        deduped.append(item)

                # # --- Generate virtual try-on for ONE outfit only ---
                # if deduped:
                #     selected_outfit = deduped[0]
                #     try:
                #         async with aiohttp.ClientSession() as session:
                #             garment_url = selected_outfit.get("image_url") or selected_outfit.get("img")
                #             async with session.get(garment_url) as resp:
                #                 if resp.status != 200:
                #                     raise HTTPException(status_code=404, detail="Garment image not found")
                #                 garment_image_bytes = await resp.read()

                #         # Generate try-on image bytes
                #         tryon_bytes = await generate_virtual_tryon(user_image_bytes, garment_image_bytes)

                #         # Convert to Base64
                #         b64_str = base64.b64encode(tryon_bytes).decode("utf-8")
                #         selected_outfit["tryon_image_base64"] = f"data:image/jpeg;base64,{b64_str}"

                #     except Exception as e:
                #         logger.exception(f"Virtual try-on failed: {e}")
                #         selected_outfit["tryon_image_base64"] = None
                # --- Generate virtual try-on for EACH outfit ---
                if deduped:
                    async with aiohttp.ClientSession() as session:
                        tryon_tasks = []

                        for outfit in deduped:
                            garment_url = outfit.get("image_url") or outfit.get("img")
                            if not garment_url:
                                outfit["tryon_image_base64"] = None
                                continue

                            async def process_outfit(outfit=outfit, garment_url=garment_url):
                                try:
                                    async with session.get(garment_url) as resp:
                                        if resp.status != 200:
                                            raise Exception("Garment image fetch failed")
                                        garment_image_bytes = await resp.read()

                                    # Generate try-on image
                                    tryon_bytes = await generate_virtual_tryon(user_image_bytes, garment_image_bytes)

                                    # Convert to base64 (match actual image type, PNG recommended)
                                    b64_str = base64.b64encode(tryon_bytes).decode("utf-8")
                                    outfit["tryon_image_base64"] = f"data:image/png;base64,{b64_str}"

                                except Exception as e:
                                    logger.warning(f"Try-on failed for {garment_url}: {e}")
                                    outfit["tryon_image_base64"] = None

                            tryon_tasks.append(process_outfit())

                        # Run all try-on generations concurrently
                        await asyncio.gather(*tryon_tasks)


                yield json.dumps({
                    "stage": "outfit_recommendations",
                    "outfit_recommendations": deduped
                }) + "\n"

        except Exception as e:
            logger.exception(f"Automated analysis failed: {e}")
            yield json.dumps({"stage": "error", "message": str(e)}) + "\n"

    return StreamingResponse(event_generator(), media_type="application/json")
