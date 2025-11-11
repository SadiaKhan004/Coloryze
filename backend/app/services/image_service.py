
# import os
# from app.utils.file_utils import generate_unique_filename
# from app.ai.color_analyzer_cv import analyze_image

# UPLOAD_DIR = "uploads"
# os.makedirs(UPLOAD_DIR, exist_ok=True)


# async def save_uploaded_image(file):
#     """
#     Save uploaded image to disk, run AI model, and return result.
#     """
#     filename = generate_unique_filename(file.filename)
#     file_path = os.path.join(UPLOAD_DIR, filename)

#     # Read uploaded file
#     contents = await file.read()
#     if not contents:
#         return {"status": "error", "message": "Uploaded file is empty."}

#     # Save to disk
#     with open(file_path, "wb") as f:
#         f.write(contents)

#     print(f"Saved file: {file_path}, size: {len(contents)} bytes")

#     # 🧠 Run AI analysis
#     analysis_result = analyze_image(file_path)

#     if not analysis_result:
#         return {
#             "status": "error",
#             "message": "No skin tone detected. Try another photo with clear lighting."
#         }

#     return {
#         "status": "success",
#         "message": "Image analyzed successfully.",
#         "filename": filename,
#         "result": analysis_result,
#     }
# app/services/image_service.py
# app/services/image_service.py
# from app.utils.supabase_client import supabase
# from app.models.user_image import UserImage
# from app.models.database import get_db
# from sqlalchemy.orm import Session
# from app.utils.file_utils import generate_unique_filename

# async def save_uploaded_image(file, user_id: int, db: Session):
#     """
#     Upload image to Supabase bucket and save URL in database.
#     """
#     # Generate unique filename
#     filename = generate_unique_filename(file.filename)
#     contents = await file.read()
#     if not contents:
#         return {"status": "error", "message": "Uploaded file is empty."}

#     bucket_name = "user-images"
    
#     try:
#         # Upload to Supabase bucket - this will raise an exception if it fails
#         res = supabase.storage.from_(bucket_name).upload(filename, contents)
        
#         # Get public URL - returns string directly, not a dict
#         image_url = supabase.storage.from_(bucket_name).get_public_url(filename)
        
#         # Save record to DB
#         image_record = UserImage(user_id=user_id, image_url=image_url)
#         db.add(image_record)
#         db.commit()
#         db.refresh(image_record)

#         return {
#             "status": "success",
#             "message": "Image uploaded successfully.",
#             "filename": filename,
#             "image_url": image_url,
#             "image_id": image_record.id
#         }
#     except Exception as e:
#         db.rollback()
#         return {"status": "error", "message": str(e)}

# app/services/image_service.py
# app/services/image_service.py
from app.utils.supabase_client import supabase
from app.models.user_image import UserImage
from sqlalchemy.orm import Session
from app.utils.file_utils import generate_unique_filename
from fastapi import HTTPException

async def save_uploaded_image(file, user_id: int, db: Session):
    """
    Upload an image to Supabase and save its URL in the database.
    `user_id` must be a numeric ID corresponding to the users table.
    """
    # Generate a unique filename
    filename = generate_unique_filename(file.filename)

    # Read file contents
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Upload to Supabase bucket
    bucket_name = "user-images"
    
    try:
        # Upload - will raise exception if it fails
        res = supabase.storage.from_(bucket_name).upload(filename, contents)
        
        # Get public URL - returns the URL string directly
        image_url = supabase.storage.from_(bucket_name).get_public_url(filename)
        
        # Save record to database
        image_record = UserImage(user_id=user_id, image_url=image_url)
        db.add(image_record)
        db.commit()
        db.refresh(image_record)
        
        return {
            "status": "success",
            "message": "Image uploaded successfully.",
            "filename": filename,
            "image_url": image_url,
            "image_id": image_record.id
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, 
            detail=f"Upload failed: {str(e)}"
        )