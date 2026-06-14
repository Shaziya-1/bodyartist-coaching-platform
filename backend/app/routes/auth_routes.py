from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from backend.app.config.database import get_db
from backend.app.controllers.auth_controller import AuthController

router = APIRouter()

class CoachSignupRequest(BaseModel):
    name: str
    email: str
    password: str
    inviteCode: str

class SigninRequest(BaseModel):
    email: str
    password: str

class TokenRefreshRequest(BaseModel):
    refreshToken: str

class AthleteProvisionRequest(BaseModel):
    name: str
    email: str
    password: str
    coachId: str

class ResetPasswordRequest(BaseModel):
    athleteId: str
    newPassword: str

@router.post("/athlete/provision", status_code=status.HTTP_201_CREATED)
def provision_athlete(payload: AthleteProvisionRequest, db: Session = Depends(get_db)):
    return AuthController.athlete_provision(
        db=db,
        name=payload.name,
        email=payload.email,
        password=payload.password,
        coach_id=payload.coachId
    )

@router.post("/athlete/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    return AuthController.reset_password(
        db=db,
        athlete_id=payload.athleteId,
        new_password=payload.newPassword
    )

@router.get("/coach/athletes")
def get_coach_athletes(coach_id: str, db: Session = Depends(get_db)):
    return AuthController.get_coach_athletes(
        db=db,
        coach_id=coach_id
    )

@router.post("/coach/signup", status_code=status.HTTP_201_CREATED)
def coach_signup(payload: CoachSignupRequest, db: Session = Depends(get_db)):
    return AuthController.coach_signup(
        db=db,
        name=payload.name,
        email=payload.email,
        password=payload.password,
        invite_code=payload.inviteCode
    )

@router.post("/coach/signin")
def coach_signin(payload: SigninRequest, db: Session = Depends(get_db)):
    return AuthController.signin(
        db=db,
        email=payload.email,
        password=payload.password,
        expected_role="coach"
    )

@router.post("/athlete/signin")
def athlete_signin(payload: SigninRequest, db: Session = Depends(get_db)):
    return AuthController.signin(
        db=db,
        email=payload.email,
        password=payload.password,
        expected_role="athlete"
    )

@router.post("/refresh")
def refresh_token(payload: TokenRefreshRequest, db: Session = Depends(get_db)):
    return AuthController.refresh_token(
        db=db,
        refresh_token=payload.refreshToken
    )
