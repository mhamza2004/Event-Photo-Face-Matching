from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository
from app.schemas.user import UserRegister
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)


class AuthService:

    @staticmethod
    def register(db: Session, user: UserRegister):

        existing_user = UserRepository.get_by_email(db, user.email)

        if existing_user:
            raise ValueError("Email already registered")

        hashed_password = hash_password(user.password)

        new_user = UserRepository.create_user(
            db=db,
            full_name=user.full_name,
            email=user.email,
            hashed_password=hashed_password,
        )

        return new_user

    @staticmethod
    def login(db: Session, email: str, password: str):

        user = UserRepository.get_by_email(db, email)

        if not user:
            raise ValueError("Invalid email or password")

        if not verify_password(password, user.password):
            raise ValueError("Invalid email or password")

        token = create_access_token(
            {
                "sub": user.email,
                "user_id": user.id,
                "role": user.role,
            }
        )

        return token