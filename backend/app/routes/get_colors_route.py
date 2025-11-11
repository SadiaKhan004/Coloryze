# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from app.database import get_db
# from app.models import ColorPalette, User
# from app.utils.auth_utils import get_current_user  # Assuming you have a function for auth

# router = APIRouter()

# @router.get("/user-palette")
# def get_user_palette(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
#     palette_obj = db.query(ColorPalette).filter(ColorPalette.user_id == current_user.id).order_by(ColorPalette.created_at.desc()).first()
#     if not palette_obj:
#         raise HTTPException(status_code=404, detail="Palette not found")
    
#     return {"palette": palette_obj.palette}
