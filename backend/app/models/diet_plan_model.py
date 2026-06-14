import uuid

from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB

from backend.app.config.database import Base


class DietPlan(Base):
    __tablename__ = "diet_plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    athlete_id = Column(
        UUID(as_uuid=True), 
        ForeignKey('users.id', ondelete='CASCADE'), 
        nullable=False, 
        unique=True
    )

    meals_target = Column(Integer, default=0)
    water_target = Column(Integer, default=0)
    steps_target = Column(Integer, default=0)
    cardio_target = Column(Integer, default=0)
    tolerance_percent = Column(Integer, default=0)

    target_macros = Column(JSONB, default=dict)
    supplement_checklist = Column(JSONB, default=list)