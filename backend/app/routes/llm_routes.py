
# from fastapi import APIRouter, Request
# from fastapi.responses import JSONResponse
# from app.ai.llm_prompt_engine import ColorAnalysisPromptEngine
# import os
# from dotenv import load_dotenv

# load_dotenv()

# router = APIRouter()

# @router.post("/generate-report/")
# async def generate_report(request: Request):
#     try:
#         payload = await request.json()
#     except Exception as e:
#         return JSONResponse({"error": f"Invalid JSON payload: {str(e)}"}, status_code=400)

#     ai_result = payload.get("ai_result")
#     if not ai_result:
#         return JSONResponse({"error": "No AI result provided"}, status_code=400)

#     try:
#         # DEBUG: Print the entire ai_result to see what we're working with
#         print("=== DEBUG: Full ai_result ===")
#         print(f"Type: {type(ai_result)}")
#         print(f"Content: {ai_result}")
        
#         # Initialize engine
#         api_key = os.getenv("GROQ_API_KEY")
#         if not api_key:
#             return JSONResponse({"error": "GROQ_API_KEY not set in environment"}, status_code=500)

#         engine = ColorAnalysisPromptEngine(api_key=api_key)

#         # --- Safely extract skin analysis info ---
#         skin_analysis = {
#             "mst_level": ai_result.get("skin_tone", ""),
#             "descriptor": ai_result.get("descriptor", ""),
#             "tone_group": ai_result.get("tone_group", ""),
#             "undertone": ai_result.get("undertone", "").lower(),
#         }

#         # DEBUG: Check season value before processing
#         raw_season = ai_result.get("season", "True Summer")
#         print(f"=== DEBUG: Season value ===")
#         print(f"Raw season type: {type(raw_season)}")
#         print(f"Raw season value: {raw_season}")
        
#         # Ensure season is a string, not a list
#         if isinstance(raw_season, list):
#             print(f"Season is a list! Content: {raw_season}")
#             season = raw_season[0] if raw_season else "True Summer"
#         else:
#             season = str(raw_season)  # Convert to string to be safe
            
#         skin_analysis["season"] = season
#         print(f"Final season type: {type(skin_analysis['season'])}")
#         print(f"Final season value: {skin_analysis['season']}")

#         # Eye and hair analysis
#         eye_analysis = {"color": ai_result.get("eye_color", "Not specified")}
#         hair_analysis = {"color": ai_result.get("hair_color", "Not specified")}
#         contrast_level = ai_result.get("contrast_level", "medium")

#         # DEBUG: Print all data being sent to LLM
#         print("=== DEBUG: Data being sent to LLM ===")
#         llm_data = {
#             "skin_analysis": skin_analysis,
#             "eye_analysis": eye_analysis,
#             "hair_analysis": hair_analysis,
#             "contrast_level": contrast_level
#         }
#         print(f"LLM data: {llm_data}")

#         # Generate LLM report
#         llm_report = engine.generate_color_analysis(llm_data)

#         # DEBUG: Check seasonal palettes structure
#         seasonal_palettes = getattr(engine, "color_theory_context", {}).get("seasonal_palettes", {})
#         print(f"=== DEBUG: Seasonal palettes ===")
#         print(f"Available seasons: {list(seasonal_palettes.keys())}")
#         print(f"Looking up season: '{skin_analysis['season']}'")

#         # Safely access seasonal palette
#         season_key = str(skin_analysis["season"]).strip()
#         recommended_colors = []
        
#         if season_key in seasonal_palettes:
#             recommended_colors = seasonal_palettes[season_key].get("best_colors", [])
#             print(f"Found colors for season '{season_key}': {len(recommended_colors)} colors")
#         else:
#             # Try to find a matching season
#             print(f"Season '{season_key}' not found in palettes. Searching for matches...")
#             for key in seasonal_palettes.keys():
#                 if season_key.lower() in key.lower() or key.lower() in season_key.lower():
#                     recommended_colors = seasonal_palettes[key].get("best_colors", [])
#                     print(f"Found match: '{key}' with {len(recommended_colors)} colors")
#                     break
            
#             # Final fallback
#             if not recommended_colors:
#                 print("No match found, using 'True Summer' as fallback")
#                 recommended_colors = seasonal_palettes.get("True Summer", {}).get("best_colors", [])

#         # Build response
#         response_payload = {
#             "skinTone": skin_analysis["descriptor"],
#             "undertone": skin_analysis["undertone"],
#             "summary": llm_report,
#             "colors": recommended_colors
#         }

#         print("=== DEBUG: Final response ===")
#         print(f"Response payload: {response_payload}")

#         return JSONResponse(response_payload)

#     except Exception as e:
#         print("Error generating report:", e)
#         import traceback
#         traceback.print_exc()
#         return JSONResponse({"error": f"Error generating report: {str(e)}"}, status_code=500)


from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from app.ai.llm_prompt_engine import ColorAnalysisPromptEngine
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

def ensure_str(val, default="N/A"):
    """
    Converts list or None values into a clean, comma-separated string.
    """
    if isinstance(val, list):
        return ", ".join(map(str, val)) if val else default
    return str(val) if val is not None else default


@router.post("/generate-report/")
async def generate_report(request: Request):
    try:
        payload = await request.json()
    except Exception as e:
        return JSONResponse({"error": f"Invalid JSON payload: {str(e)}"}, status_code=400)

    ai_result = payload.get("ai_result")
    if not ai_result:
        return JSONResponse({"error": "No AI result provided"}, status_code=400)

    try:
        print("=== DEBUG: Full ai_result ===")
        print(f"Type: {type(ai_result)}")
        print(f"Content: {ai_result}")

        # Initialize engine
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return JSONResponse({"error": "GROQ_API_KEY not set in environment"}, status_code=500)

        engine = ColorAnalysisPromptEngine(api_key=api_key)

        # --- Normalize and safely extract all fields ---
        skin_analysis = {
            "mst_level": ensure_str(ai_result.get("skin_tone", "")),
            "descriptor": ensure_str(ai_result.get("descriptor", "")),
            "tone_group": ensure_str(ai_result.get("tone_group", "")),
            "undertone": ensure_str(ai_result.get("undertone", "neutral")).lower(),
        }

        raw_season = ensure_str(ai_result.get("season", "True Summer"))
        skin_analysis["season"] = raw_season

        # Eye and hair analysis (critical fix)
        eye_analysis = {"color": ensure_str(ai_result.get("eye_color", "Not specified"))}
        hair_analysis = {"color": ensure_str(ai_result.get("hair_color", "Not specified"))}
        contrast_level = ensure_str(ai_result.get("contrast_level", "medium"))

        # DEBUG: Check final normalized data
        print("=== DEBUG: Normalized LLM input ===")
        llm_data = {
            "skin_analysis": skin_analysis,
            "eye_analysis": eye_analysis,
            "hair_analysis": hair_analysis,
            "contrast_level": contrast_level
        }
        print(llm_data)

        # Generate report
        llm_report = engine.generate_color_analysis(llm_data)

        # Extract palette safely
        seasonal_palettes = getattr(engine, "color_theory_context", {}).get("seasonal_palettes", {})
        season_key = skin_analysis["season"].strip()
        recommended_colors = []

        if season_key in seasonal_palettes:
            recommended_colors = seasonal_palettes[season_key].get("best_colors", [])
        else:
            for key in seasonal_palettes.keys():
                if season_key.lower() in key.lower() or key.lower() in season_key.lower():
                    recommended_colors = seasonal_palettes[key].get("best_colors", [])
                    break
            if not recommended_colors:
                recommended_colors = seasonal_palettes.get("True Summer", {}).get("best_colors", [])

        # Build final response
        response_payload = {
            "skinTone": skin_analysis["descriptor"],
            "undertone": skin_analysis["undertone"],
            "summary": llm_report,
            "colors": recommended_colors
        }

        print("=== DEBUG: Final response ===")
        print(response_payload)

        return JSONResponse(response_payload)

    except Exception as e:
        print("Error generating report:", e)
        import traceback
        traceback.print_exc()
        return JSONResponse({"error": f"Error generating report: {str(e)}"}, status_code=500)
