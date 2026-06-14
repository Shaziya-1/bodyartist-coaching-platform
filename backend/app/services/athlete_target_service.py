from sqlalchemy.orm import Session
from uuid import UUID
from fastapi import HTTPException

from backend.app.repositories.diet_plan_repository import DietPlanRepository
from backend.app.schemas.athlete_target_schema import AthleteTargetResponse

class AthleteTargetService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = DietPlanRepository()

    def get_athlete_targets(self, athlete_id: UUID) -> AthleteTargetResponse:
        diet_plan = self.repository.get_by_athlete_id(self.db, athlete_id)
        if not diet_plan:
            raise HTTPException(status_code=404, detail="Diet plan targets not found for this athlete.")
            
        return AthleteTargetResponse.model_validate(diet_plan)
