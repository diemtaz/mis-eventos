from pydantic import BaseModel
from app.models.user import UserRole


class UserRegister(BaseModel):
    email: str
    password: str
    role: UserRole = UserRole.ASSISTANT

class UserLogin(BaseModel):
    email: str
    password: str