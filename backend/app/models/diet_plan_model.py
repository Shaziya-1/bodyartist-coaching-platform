from sqlalchemy import Column, Integer, Float, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
import uuid

from app.config.database import Base


class DietPlan(Base):
    __tablename__ = "diet_plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    athlete_id = Column(UUID(as_uuid=True), nullable=False, unique=True)

    target_meals_per_day = Column(Integer, default=4)

    target_protein = Column(Float, nullable=False)
    target_carbs = Column(Float, nullable=False)
    target_fat = Column(Float, nullable=False)
    target_calories = Column(Float, nullable=False)

    micronutrient_targets = Column(JSONB, default=dict)

    water_target_glasses = Column(Integer, default=8)

    supplement_checklist = Column(JSONB, default=list)

    workout_target_completed = Column(Integer, default=0)

    cardio_target_minutes = Column(Integer, default=0)

    step_target = Column(Integer, default=0)

    macro_tolerance_percent = Column(Float, default=10.0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )