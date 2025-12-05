from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime
    is_active: bool

    class Config:
        from_attributes = True