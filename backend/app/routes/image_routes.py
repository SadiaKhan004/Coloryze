# from fastapi import APIRouter, UploadFile, File
# from fastapi.responses import JSONResponse
# from app.services import image_service

# router = APIRouter(tags=["Image Upload & AI"])

# @router.post("/upload-image/")
# async def upload_image(file: UploadFile = File(...)):
#     """
#     Receives an image file from the frontend and stores it.
#     Later will call the AI model.
#     """
#     result = await image_service.save_uploaded_image(file)
#     return JSONResponse(content=result)

# @router.get("/get-results/")
# async def get_results():
#     """
#     Returns a mock AI result to frontend.
#     In the future, this will pull actual analysis.
#     """
#     result = await image_service.get_mock_results()
#     return JSONResponse(content=result)
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from app.services import image_service

router = APIRouter(tags=["Image Upload & AI"])

@router.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    """
    Uploads image, analyzes it, and returns AI skin tone result.
    """
    result = await image_service.save_uploaded_image(file)
    return JSONResponse(content=result)

