# from fastapi import APIRouter, UploadFile, File
# import os, asyncio

# router = APIRouter(prefix="/upload", tags=["Upload"])

# STORAGE_PATH = "../storage/images"

# @router.post("/")
# async def upload_image(file: UploadFile = File(...)):
#     os.makedirs(STORAGE_PATH, exist_ok=True)
#     file_path = os.path.join(STORAGE_PATH, file.filename)

#     with open(file_path, "wb") as f:
#         f.write(await file.read())

#     # Background task simulation
#     asyncio.create_task(process_image(file_path))
#     return {"message": f"File '{file.filename}' uploaded successfully!"}

# async def process_image(path: str):
#     await asyncio.sleep(2)
#     print(f"✅ Processed {path}")
