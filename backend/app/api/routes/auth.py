from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from app.db.session import get_session
from app.models.user import User
from app.core.security import hash_password, verify_password, create_access_token
from sqlmodel import Session
from app.schemas.auth import UserRegister, UserLogin
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def register(user: UserRegister, session: Session = Depends(get_session)):

    existing = session.exec(
        select(User).where(User.email == user.email)
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=user.email,
        password_hash=hash_password(user.password),
        role = user.role if hasattr(user, "role") else UserRole.ASSISTANT
    )

    session.add(new_user)
    session.commit()

    return {"message": "User created"}

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    db_user = session.exec(
        select(User).where(User.email == form_data.username)
    ).first()

    if not db_user or not verify_password(form_data.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({"sub": db_user.email})

    return {
        "access_token": token,
        "token_type": "bearer"
    } 
