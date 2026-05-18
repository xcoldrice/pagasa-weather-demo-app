# Run service
import os
from sqlalchemy.orm import Session
from app.db.models import ProcessingRun

def create_processing_run(db: Session, result: dict):
    run = ProcessingRun(
        id=result["run_id"],
        product_type=result["product_type"],
        status=result["status"],
        input_url=result["files"]["input_url"],
        overlay_url=result["files"]["overlay_url"],
        result_url=result["files"]["result_url"],
        min_value=result["summary"]["min_value"],
        max_value=result["summary"]["max_value"],
        mean_value=result["summary"]["mean_value"],
        risk_score_value=result.get("risk_score", {}).get("score"),
        risk_level=result.get("risk_score", {}).get("level"),
        insights=result.get("insights"),
        ai_summary=result.get("ai_summary"),
        processing_version=os.getenv("APP_VERSION", "0.1.0"),
        git_sha=os.getenv("GIT_SHA", "local"),
        error_message=None,
    )
    db.add(run)
    db.commit()
    db.refresh(run)
    return run

def get_processing_run(db: Session, run_id: str):
    return db.query(ProcessingRun).filter(ProcessingRun.id == run_id).first()

def list_processing_runs(db: Session, limit: int = 20):
    return (
        db.query(ProcessingRun)
        .order_by(ProcessingRun.created_at.desc())
        .limit(limit)
        .all()
    )