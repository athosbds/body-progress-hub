from sqlmodel import Session, select
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password
from typing import Optional, List
import re
from datetime import datetime

class UserCRUD:
    @staticmethod
    def get_user_by_id(session: Session, user_id: int) -> Optional[User]:
        return session.get(User, user_id)
    
    @staticmethod
    def get_user_by_email(session: Session, email: str) -> Optional[User]:
        statement = select(User).where(User.email == email)
        return session.exec(statement).first()
    
    @staticmethod
    def get_user_by_username(session: Session, username: str) -> Optional[User]:
        statement = select(User).where(User.username == username)
        return session.exec(statement).first()
    
    @staticmethod
    def generate_username(email: str, name: str) -> str:
        base = email.split('@')[0]
        base = re.sub(r'[^a-zA-Z0-9_]', '', base)
        
        if len(base) < 3:
            base = name.lower().replace(' ', '_')
            base = re.sub(r'[^a-zA-Z0-9_]', '', base)
        
        return base
    
    @staticmethod
    def create_user(session: Session, user_data: UserCreate) -> User:
        if UserCRUD.get_user_by_email(session, user_data.email):
            raise ValueError("Email já cadastrado")
        
        username = user_data.username
        if not username:
            base_username = UserCRUD.generate_username(user_data.email, user_data.name)
            counter = 1
            username = base_username
            while UserCRUD.get_user_by_username(session, username):
                username = f"{base_username}{counter}"
                counter += 1
        elif UserCRUD.get_user_by_username(session, username):
            raise ValueError("Username já existe")
        
        hashed_password = get_password_hash(user_data.password)
        
        db_user = User(
            email=user_data.email,
            username=username,
            name=user_data.name,
            hashed_password=hashed_password,
            bio=user_data.bio,
            avatar_url=user_data.avatar_url
        )
        
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
        return db_user
    
    @staticmethod
    def authenticate_user(session: Session, email: str, password: str) -> Optional[User]:
        user = UserCRUD.get_user_by_email(session, email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        if not user.is_active:
            return None
        return user
    
    @staticmethod
    def update_user(session: Session, user_id: int, update_data: dict) -> Optional[User]:
        user = UserCRUD.get_user_by_id(session, user_id)
        if not user:
            return None
        
        for key, value in update_data.items():
            if hasattr(user, key) and value is not None:
                setattr(user, key, value)
        
        user.updated_at = datetime.utcnow()
        session.add(user)
        session.commit()
        session.refresh(user)
        return user
    
    @staticmethod
    def get_all_users(session: Session, skip: int = 0, limit: int = 100) -> List[User]:
        statement = select(User).where(User.is_active == True).offset(skip).limit(limit)
        return session.exec(statement).all()