from dotenv import load_dotenv

from backend.app.config.database import engine, Base
from backend.app.models.users_model import User

load_dotenv()

def test_database_connection():
    print("[INFO] Connecting to local Postgres and creating tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("[SUCCESS] Table 'users' successfully created in your database!")

    except Exception as e:
        print("[ERROR] Error connecting to database or inserting data:")
        print(str(e))

if __name__ == "__main__":
    test_database_connection()