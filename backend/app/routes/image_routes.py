
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from app.services import image_service
import logging

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Image Upload & AI"])

@router.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    """
    Uploads image, analyzes it, and returns AI skin tone result.
    """
    logger.info(f"📥 Received file: {file.filename}, content_type: {file.content_type}")
    
    # Validate file type
    if not file.content_type.startswith("image/"):
        return JSONResponse(
            content={"status": "error", "message": "File must be an image"},
            status_code=400
        )
    
    result = await image_service.save_uploaded_image(file)
    logger.info(f"✅ Processing result: {result.get('status')}")
    
    return JSONResponse(content=result)
# from fastapi import APIRouter, UploadFile, File, Depends
# from sqlalchemy.orm import Session
# from app.models.database import get_db
# from app.services import image_service
# from fastapi.security import OAuth2PasswordBearer
# # from app.utils.auth_utils import decode_access_token
# from app.utils.auth_utils import decode_access_token


# router = APIRouter()
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# @router.post("/upload-image/")
# async def upload_image(
#     file: UploadFile = File(...),
#     token: str = Depends(oauth2_scheme),
#     db: Session = Depends(get_db)
# ):
#     # decode JWT to get user_id
#     payload = decode_access_token(token)
#     user_id = payload.get("sub")  # or map to actual user ID
#     result = await image_service.save_uploaded_image(file, user_id, db)
#     return result
# app/routes/image_routes.py
# app/routes/image_routes.py
# from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
# from sqlalchemy.orm import Session
# from fastapi.security import OAuth2PasswordBearer
# from app.models.database import get_db
# from app.services import image_service
# from app.utils.auth_utils import decode_access_token
# from app.models.user import User

# router = APIRouter()
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# @router.post("/upload-image/")
# async def upload_image(
#     file: UploadFile = File(...),
#     token: str = Depends(oauth2_scheme),
#     db: Session = Depends(get_db)
# ):
#     """
#     Uploads an image for the authenticated user.
#     JWT token must contain the email in 'sub' claim.
#     """

#     # 1️⃣ Decode token to get user's email
#     try:
#         payload = decode_access_token(token)
#         user_email = payload.get("sub")
#         if not user_email:
#             raise HTTPException(status_code=401, detail="Invalid token payload")
#     except Exception:
#         raise HTTPException(status_code=401, detail="Invalid or expired token")

#     # 2️⃣ Get numeric user_id from email
#     user = db.query(User).filter(User.email == user_email).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     user_id = user.id  # ✅ numeric

#     # 3️⃣ Upload image using the service
#     result = await image_service.save_uploaded_image(file, user_id, db)

#     return result
