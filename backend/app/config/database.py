import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load environment variables from .env file
if os.path.exists("backend/.env"):
    load_dotenv("backend/.env", override=True)
else:
    load_dotenv(override=True)

DATABASE_URL = os.getenv("DATABASE_URL")

# Create the connection engine
'''
    pool_size: The number of connections to keep open in the pool.
    max_overflow: The number of temporary connections to make when the pool is exhausted.
    pool_pre_ping: Check if a connection is still alive before using it.
    pool_use_lifo: Use LIFO (Last-In, First-Out) to reuse the most recently used connections first, which can improve performance.
'''
engine = create_engine(DATABASE_URL, pool_size=50, max_overflow=0, pool_pre_ping=True, pool_use_lifo=True)

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
