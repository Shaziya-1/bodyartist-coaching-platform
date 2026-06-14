from sqlalchemy.orm import Session
from backend.app.repositories.daily_log_repository import DailyLogRepository
from backend.app.schemas.step_log_schema import StepLogRequest, StepLogResponse

class StepLogService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = DailyLogRepository()

    def log_steps(self, data: StepLogRequest) -> StepLogResponse:
        daily_log = self.repository.upsert_step_log(
            self.db, 
            athlete_id=data.athlete_id, 
            log_date=data.log_date, 
            steps_logged=data.steps_logged
        )

        return StepLogResponse(
            athlete_id=daily_log.athlete_id,
            log_date=daily_log.log_date,
            steps_logged=daily_log.steps_logged
        )
