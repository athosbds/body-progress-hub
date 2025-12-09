# app/api/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from app.db.session import get_session
from app.crud.user import UserCRUD
from app.schemas.user import UserCreate, UserLogin, LoginResponse, UserRead
from app.core.security import create_access_token, create_refresh_token

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=UserRead)
def register(user_data: UserCreate, session: Session = Depends(get_session)):
    try:
        user = UserCRUD.create_user(session, user_data)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/login", response_model=LoginResponse)
def login(login_data: UserLogin, session: Session = Depends(get_session)):
    user = UserCRUD.authenticate_user(session, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Conta desativada"
        )
    access_token = create_access_token({"user_id": user.id, "username": user.username})
    refresh_token = create_refresh_token({"user_id": user.id})
    
    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=UserRead.from_orm(user)  
    )

@router.post("/refresh")
def refresh_token(refresh_token: str):
    return {"message": "Refresh token endpoint em desenvolvimento"}