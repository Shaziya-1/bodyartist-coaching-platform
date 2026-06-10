from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import datetime
from backend.app.config.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    role = Column(String(50), nullable=False)  # 'coach' ya 'athlete'
    password_hash = Column(String(255), nullable=False)
    
    # Self-referencing foreign key: Athlete ke row mein coach ki ID store hogi
    coach_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships (Optional but good for SQLAlchemy queries)
    # coach = relationship("User", remote_side=[id], backref="athletes")