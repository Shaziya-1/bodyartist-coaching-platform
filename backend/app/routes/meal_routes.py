from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
import traceback
from backend.app.config.database import get_db
from backend.app.controllers.meal_controller import MealController

router = APIRouter()

class MealConfirmRequest(BaseModel):
    athlete_id: str
    food_name: str
    photo_url: str | None = None
    raw_vision_response: dict | None = None
    confidence_score: float | None = None
    estimated_calories: float | None = None
    estimated_protein: float | None = None
    estimated_carbs: float | None = None
    estimated_fat: float | None = None
    estimated_micronutrients: dict | None = None
    serving_size: float | None = None
    is_edited: bool = False

@router.post("/upload")
async def upload_meal_photo(
    athlete_id: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        content = await image.read()
        result = MealController.upload_and_detect(db=db, file_content=content, athlete_id=athlete_id)
        return result
    except Exception as e:
        print(f"[MEAL ROUTES] Error in /upload: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process and recognize meal image: {str(e)}"
        )

@router.post("/confirm", status_code=status.HTTP_201_CREATED)
def confirm_meal(
    payload: MealConfirmRequest,
    db: Session = Depends(get_db)
):
    try:
        meal_log = MealController.confirm_and_save(
            db=db,
            athlete_id=payload.athlete_id,
            food_name=payload.food_name,
            photo_url=payload.photo_url,
            raw_vision_response=payload.raw_vision_response,
            confidence_score=payload.confidence_score,
            estimated_calories=payload.estimated_calories,
            estimated_protein=payload.estimated_protein,
            estimated_carbs=payload.estimated_carbs,
            estimated_fat=payload.estimated_fat,
            estimated_micronutrients=payload.estimated_micronutrients,
            serving_size=payload.serving_size,
            is_edited=payload.is_edited
        )
        return {
            "status": "success",
            "message": "Meal log successfully saved to database",
            "meal_id": str(meal_log.id)
        }
    except Exception as e:
        print(f"[MEAL ROUTES] Error in /confirm: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to save confirmed meal log: {str(e)}"
        )
