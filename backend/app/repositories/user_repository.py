from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:

    @staticmethod
    def get_by_email(db: Session, email: str):
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def create_user(
        db: Session,
        full_name: str,
        email: str,
        hashed_password: str,
        role: str = "user",
    ):
        user = User(
            full_name=full_name,
            email=email,
            password=hashed_password,
            role=role,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user