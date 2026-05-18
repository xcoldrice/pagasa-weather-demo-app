# Database session management
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

POSTGRES_DB = os.getenv("POSTGRES_DB", "pagasa")
POSTGRES_USER = os.getenv("POSTGRES_USER", "pagasa")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "pagasa")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")

DATABASE_URL = (
    f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}"
    f"@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
)

engine = create_engine(DATABASE_URL, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)