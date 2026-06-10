from sqlalchemy.orm import Session
from uuid import UUID
from backend.app.models.users_model import User

class UserRepository:
    @staticmethod
    def get_by_id(db: Session, user_id: UUID) -> User | None:
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_by_email(db: Session, email: str) -> User | None:
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def create_user(
        db: Session,
        name: str,
        email: str,
        role: str,
        password_hash: str,
        coach_id: UUID = None
    ) -> User:
        db_user = User(
            name=name,
            email=email,
            role=role,
            password_hash=password_hash,
            coach_id=coach_id
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
