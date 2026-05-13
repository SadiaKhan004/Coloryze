
from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.auth_utils import hash_password, verify_password, create_access_token
from fastapi import HTTPException

def signup_user(username: str, email: str, password: str, age: int, gender: str, db: Session):
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = hash_password(password)
    new_user = User(
        username=username,
        email=email,
        password_hash=hashed,  # match your DB column
        age=age,
        gender=gender
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user



def login_user(email: str, password: str, db: Session):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "email": user.email,
            "username": user.username
        }
    }
