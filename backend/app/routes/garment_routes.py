
# app/routers/garment_route.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import asyncio
from app.ai.garment_agent_async import run_garment_match  # ✅ Import the async helper

router = APIRouter()

# Brand URL mapping
BRAND_URLS = {
    "Sapphire": "https://pk.sapphireonline.pk/",
    "Khaddi": "https://www.khaadi.com/pk/",
    "Saya": "https://pk.saya.pk/",
    "Outfitters": "https://outfitters.com.pk/",
}

class GarmentRequest(BaseModel):
    brand: str
    color: str

@router.post("/search-garment/")
async def search_garment(data: GarmentRequest):
    brand = data.brand
    color = data.color

    if brand not in BRAND_URLS:
        raise HTTPException(status_code=400, detail=f"Unsupported brand: {brand}")

    site_url = BRAND_URLS[brand]

    try:
        # ✅ Run the garment match agent
        results = await run_garment_match(color, site_url)

        # ✅ Return JSON response
        return {
            "status": "success",
            "brand": brand,
            "color": color,
            "results": results
        }

    except asyncio.CancelledError:
        # Task cancelled (e.g., server shutdown)
        return {
            "status": "cancelled",
            "brand": brand,
            "color": color,
            "results": []
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Garment matching failed: {str(e)}")
