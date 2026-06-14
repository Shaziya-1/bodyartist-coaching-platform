from sqlalchemy.orm import Session
from uuid import UUID
from fastapi import HTTPException

from backend.app.repositories.diet_plan_repository import DietPlanRepository
from backend.app.models.diet_plan_model import DietPlan
from backend.app.schemas.diet_plan_schema import DietPlanCreate, DietPlanUpdate

class DietPlanService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = DietPlanRepository()

    def create_diet_plan(self, data: DietPlanCreate) -> DietPlan:
        # Check if already exists
        existing_plan = self.repository.get_by_athlete_id(self.db, data.athlete_id)
        if existing_plan:
            raise HTTPException(status_code=400, detail="Diet plan already exists for this athlete.")
        
        # Convert Pydantic model to dictionary
        db_data = data.model_dump()
        
        diet_plan = DietPlan(**db_data)
        return self.repository.save(self.db, diet_plan)

    def update_diet_plan(self, athlete_id: UUID, data: DietPlanUpdate) -> DietPlan:
        existing_plan = self.repository.get_by_athlete_id(self.db, athlete_id)
        if not existing_plan:
            raise HTTPException(status_code=404, detail="Diet plan not found for this athlete.")
            
        update_data = data.model_dump(exclude_unset=True)
        return self.repository.update(self.db, athlete_id, update_data)
