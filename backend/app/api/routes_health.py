# Health check routes
import os
from fastapi import APIRouter
from sqlalchemy import text
from app.db.session import SessionLocal
from app.services.cache import redis_client

router = APIRouter()

@router.get("/health")
def health():
    return {"status": "ok"}

@router.get("/ready")
def ready():
    db_ok = False
    redis_ok = False

    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        db_ok = True
    except Exception:
        db_ok = False

    try:
        redis_client.ping()
        redis_ok = True
    except Exception:
        redis_ok = False

    return {
        "status": "ready" if db_ok and redis_ok else "degraded",
        "database": db_ok,
        "redis": redis_ok,
    }

@router.get("/version")
def version():
    return {
        "app_version": os.getenv("APP_VERSION", "1.0.0"),
        "git_sha": os.getenv("GIT_SHA", "local"),
    }