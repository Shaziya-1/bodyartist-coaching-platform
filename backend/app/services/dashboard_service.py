from sqlalchemy.orm import Session
from uuid import UUID
from datetime import date

from backend.app.repositories.daily_log_repository import DailyLogRepository
from backend.app.repositories.diet_plan_repository import DietPlanRepository
from backend.app.schemas.dashboard_schema import DashboardSummaryResponse

class DashboardService:
    def __init__(self, db: Session):
        self.db = db
        self.daily_log_repo = DailyLogRepository()
        self.diet_plan_repo = DietPlanRepository()

    def get_dashboard_summary(self, athlete_id: UUID) -> DashboardSummaryResponse:
        today = date.today()
        
        # Get today's log
        daily_log = self.daily_log_repo.get_log_by_date(self.db, athlete_id, today)
        
        # Get diet plan for supplement total
        diet_plan = self.diet_plan_repo.get_by_athlete_id(self.db, athlete_id)
        
        # Calculate streak
        current_streak = self.daily_log_repo.get_current_streak(self.db, athlete_id)
        
        water_logged = 0
        supplements_completed = 0
        supplements_total = 0
        
        if diet_plan and diet_plan.supplement_checklist:
            required_supps = [s for s in diet_plan.supplement_checklist if s.get("required")]
            supplements_total = len(required_supps)
            
        if daily_log and daily_log.supplement_checkoffs:
            # checkoffs array is assumed to only contain completed items
            supplements_completed = sum(1 for s in daily_log.supplement_checkoffs if s.get("completed"))
            water_logged = daily_log.water_logged
            
        return DashboardSummaryResponse(
            athlete_id=athlete_id,
            water_logged=water_logged,
            supplements_completed=supplements_completed,
            supplements_total=supplements_total,
            current_streak=current_streak
        )
