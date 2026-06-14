import uuid
from sqlalchemy import Column, Integer, ForeignKey, Date, Numeric, String, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB

from backend.app.config.database import Base


class DailyLog(Base):
    __tablename__ = "daily_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    athlete_id = Column(
        UUID(as_uuid=True), 
        ForeignKey('users.id', ondelete='CASCADE'), 
        nullable=False
    )
    
    log_date = Column(Date, nullable=False)
    water_logged = Column(Integer, default=0)
    steps_logged = Column(Integer, default=0)
    cardio_logged = Column(Integer, default=0)
    weight = Column(Numeric, nullable=True)
    score = Column(Integer, default=0)
    status = Column(String, default="pending")
    supplement_checkoffs = Column(JSONB, default=list)
    workout_completed = Column(Boolean, default=False)
    cardio_completed = Column(Boolean, default=False)
