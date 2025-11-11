from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
# from app.services.auth_service import signup_user, login_user
from app.models.database import get_db
from app.services.auth_services import signup_user,login_user

router = APIRouter()

# ✅ Schema for signup
class SignupSchema(BaseModel):
    username: str
    email: str
    password: str
    age: int
    gender: str

# ✅ Signup route
@router.post("/signup")
def signup(user: SignupSchema, db: Session = Depends(get_db)):
    return signup_user(
        username=user.username,
        email=user.email,
        password=user.password,
        age=user.age,
        gender=user.gender,
        db=db
    )

# ✅ Schema for login
class LoginSchema(BaseModel):
    email: str
    password: str

# ✅ Login route
@router.post("/login")
def login(user: LoginSchema, db: Session = Depends(get_db)):
    return login_user(
        email=user.email,
        password=user.password,
        db=db
    )
