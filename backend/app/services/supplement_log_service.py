from sqlalchemy.orm import Session
from fastapi import HTTPException

from backend.app.repositories.daily_log_repository import DailyLogRepository
from backend.app.repositories.diet_plan_repository import DietPlanRepository
from backend.app.schemas.supplement_log_schema import SupplementLogRequest, SupplementLogResponse

class SupplementLogService:
    def __init__(self, db: Session):
        self.db = db
        self.daily_log_repo = DailyLogRepository()
        self.diet_plan_repo = DietPlanRepository()

    def log_supplements(self, data: SupplementLogRequest) -> SupplementLogResponse:
        # 1. Fetch the diet plan to get required supplements
        diet_plan = self.diet_plan_repo.get_by_athlete_id(self.db, data.athlete_id)
        if not diet_plan:
            raise HTTPException(status_code=404, detail="Diet plan not found. Cannot calculate completion.")

        # Identify required supplements
        required_supplements = [
            s["name"] for s in diet_plan.supplement_checklist if s.get("required")
        ]
        total_required = len(required_supplements)

        # 2. Calculate completion percentage
        completed_required = sum(1 for supp in data.checked_supplements if supp in required_supplements)
        
        completion_percentage = 0
        if total_required > 0:
            completion_percentage = int((completed_required / total_required) * 100)
        elif len(data.checked_supplements) > 0:
            completion_percentage = 100

        # 3. Prepare JSONB updates
        supplement_checkoffs = [
            {"name": supp, "completed": True} for supp in data.checked_supplements
        ]

        # 4. Upsert Daily Log
        self.daily_log_repo.upsert_supplement_log(
            self.db, 
            athlete_id=data.athlete_id, 
            log_date=data.log_date, 
            supplement_checkoffs=supplement_checkoffs
        )

        # 5. Return updated state
        return SupplementLogResponse(
            athlete_id=data.athlete_id,
            log_date=data.log_date,
            completion_percentage=completion_percentage,
            supplement_checkoffs=supplement_checkoffs
        )
