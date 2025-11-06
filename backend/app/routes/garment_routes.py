from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.ai.garment_agent_async import run_garment_match

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
        raise HTTPException(status_code=400, detail="Unsupported brand")

    site_url = BRAND_URLS[brand]

    try:
        results = await run_garment_match(color, site_url)
        return {"status": "success", "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
