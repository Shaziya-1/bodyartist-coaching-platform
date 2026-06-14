from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from uuid import UUID

from backend.app.config.database import get_db
from backend.app.schemas.athlete_target_schema import AthleteTargetResponse
from backend.app.services.athlete_target_service import AthleteTargetService

router = APIRouter(
    prefix="/api/v1/athlete",
    tags=["Athlete Targets"]
)

@router.get("/targets/{athlete_id}", response_model=AthleteTargetResponse, status_code=status.HTTP_200_OK)
def get_athlete_targets(athlete_id: UUID, db: Session = Depends(get_db)):
    service = AthleteTargetService(db)
    return service.get_athlete_targets(athlete_id)
