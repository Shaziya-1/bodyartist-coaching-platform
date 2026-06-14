import uuid
from sqlalchemy import Column, ForeignKey, Float, String, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from backend.app.config.database import Base

class MealLog(Base):
    __tablename__ = "meal_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    athlete_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    photo_url = Column(String, nullable=True)
    raw_food_log = Column(Text, nullable=True)
    confidence_score = Column(Float, nullable=True)
    logged_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    confirmed_macros = Column(JSONB, default=dict)
