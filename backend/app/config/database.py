import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load environment variables from .env file
if os.path.exists("backend/.env"):
    load_dotenv("backend/.env")
else:
    load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Create the connection engine
engine = create_engine(DATABASE_URL)

# Create a SessionLocal class for database transactions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for database models
Base = declarative_base()


# Dependency helper to get DB session inside controllers/routes
def get_db():
    db = SessionLocal()
    try:
        return db
    except Exception as e:
        print("DB FAILED ", e)
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    if get_db():
        print("YO DB RUNNING")
    else:
        print("Issue While Running DB")
