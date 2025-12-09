from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

from app.db.session import get_session
from app.crud.user import UserCRUD
from app.schemas.user import UserRead
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/users", tags=["users"])


class UserUpdate(BaseModel):
    name: Optional[str] = None  
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

@router.get("/me", response_model=UserRead)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Retorna o perfil do usuário autenticado"""
    return current_user

@router.patch("/me", response_model=UserRead)
def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Atualiza o perfil do usuário autenticado"""
    update_data = user_update.dict(exclude_unset=True)
    

    for key, value in update_data.items():
        setattr(current_user, key, value)
    
    current_user.updated_at = datetime.utcnow()
    
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    
    return current_user

@router.get("/", response_model=List[UserRead])
def get_all_users(
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session)
):
    """Lista todos os usuários (com paginação)"""
    users = UserCRUD.get_all_users(session, skip=skip, limit=limit)
    return users

@router.get("/{user_id}", response_model=UserRead)
def get_user_by_id(user_id: int, session: Session = Depends(get_session)):
    """Retorna um usuário pelo ID"""
    user = UserCRUD.get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    return user

@router.get("/check-email/{email}")
def check_email_exists(email: str, session: Session = Depends(get_session)):
    """Verifica se um email já está cadastrado"""
    user = UserCRUD.get_user_by_email(session, email)
    return {"exists": user is not None}

@router.get("/check-username/{username}")
def check_username_exists(username: str, session: Session = Depends(get_session)):
    """Verifica se um username já está em uso"""
    user = UserCRUD.get_user_by_username(session, username)
    return {"exists": user is not None}

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_current_user(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Desativa a conta do usuário atual (soft delete)"""
    current_user.is_active = False
    current_user.updated_at = datetime.utcnow()
    session.add(current_user)
    session.commit()
    return None