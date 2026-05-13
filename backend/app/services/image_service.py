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