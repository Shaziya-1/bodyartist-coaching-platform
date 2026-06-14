from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import date

from backend.app.config.database import get_db
from backend.app.schemas.history_timeline_schema import HistoryTimelineResponse
from backend.app.services.history_timeline_service import HistoryTimelineService

router = APIRouter(
    prefix="/api/v1/athlete",
    tags=["Analytics Timeline"]
)

@router.get("/history-timeline/{athlete_id}", response_model=HistoryTimelineResponse, status_code=status.HTTP_200_OK)
def get_history_timeline(
    athlete_id: UUID, 
    start_date: date = Query(...), 
    end_date: date = Query(...), 
    db: Session = Depends(get_db)
):
    service = HistoryTimelineService(db)
    return service.get_timeline(athlete_id, start_date, end_date)
