from dotenv import load_dotenv
load_dotenv("backend/.env")

from backend.app.config.database import SessionLocal
from backend.app.models.users_model import User
from backend.app.utils.security import get_password_hash

def seed():
    db = SessionLocal()
    try:
        # Check if coach exists
        coach = db.query(User).filter(User.email == "coach@bodyartist.com").first()
        if not coach:
            print("Creating coach@bodyartist.com...")
            coach = User(
                name="Coach Admin",
                email="coach@bodyartist.com",
                role="coach",
                password_hash=get_password_hash("password123")
            )
            db.add(coach)
            db.commit()
            db.refresh(coach)
            print("Coach created successfully!")
        else:
            print("Coach already exists.")

        # Check if athlete exists
        athlete = db.query(User).filter(User.email == "athlete@bodyartist.com").first()
        if not athlete:
            print("Creating athlete@bodyartist.com...")
            athlete = User(
                name="Athlete Test",
                email="athlete@bodyartist.com",
                role="athlete",
                password_hash=get_password_hash("password123"),
                coach_id=coach.id
            )
            db.add(athlete)
            db.commit()
            db.refresh(athlete)
            print("Athlete created successfully!")
        else:
            print("Athlete already exists.")

    finally:
        db.close()

if __name__ == "__main__":
    seed()
