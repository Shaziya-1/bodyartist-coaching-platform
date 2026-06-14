from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from uuid import UUID

from backend.app.config.database import get_db
from backend.app.schemas.dashboard_schema import DashboardSummaryResponse
from backend.app.services.dashboard_service import DashboardService

router = APIRouter(
    prefix="/api/v1/athlete",
    tags=["Dashboard"]
)

@router.get("/dashboard-summary/{athlete_id}", response_model=DashboardSummaryResponse, status_code=status.HTTP_200_OK)
def get_dashboard_summary(athlete_id: UUID, db: Session = Depends(get_db)):
    service = DashboardService(db)
    return service.get_dashboard_summary(athlete_id)
