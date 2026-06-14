from sqlalchemy.orm import Session
from uuid import UUID
from datetime import date
from fastapi import HTTPException

from backend.app.repositories.daily_log_repository import DailyLogRepository
from backend.app.schemas.history_timeline_schema import HistoryTimelineResponse, TimelinePoint

class HistoryTimelineService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = DailyLogRepository()

    def get_timeline(self, athlete_id: UUID, start_date: date, end_date: date) -> HistoryTimelineResponse:
        if end_date < start_date:
            raise HTTPException(status_code=400, detail="end_date must be greater than or equal to start_date")

        logs = self.repository.get_logs_in_range(self.db, athlete_id, start_date, end_date)
        
        timeline_points = [TimelinePoint.model_validate(log) for log in logs]
        
        return HistoryTimelineResponse(
            athlete_id=athlete_id,
            start_date=start_date,
            end_date=end_date,
            timeline=timeline_points
        )
