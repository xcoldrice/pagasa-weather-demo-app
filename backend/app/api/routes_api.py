# API routes
from pathlib import Path
import json

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.processing.pipeline import process_weather_image, process_weather_image_from_path
from app.db.session import SessionLocal
from app.services.run_service import create_processing_run, get_processing_run, list_processing_runs
from app.services.cache import cache_result, get_cached_result
from app.analytics.trends import summarize_trends
from app.services.sample_service import list_samples, get_sample_by_id

router = APIRouter()

@router.get("/samples")
def get_samples():
    return list_samples()

@router.post("/process")
async def process_api(file: UploadFile = File(...), product_type: str = Form(...)):
    if product_type not in {"temperature", "rainfall"}:
        raise HTTPException(status_code=400, detail="Unsupported product type")

    result = await process_weather_image(file, product_type)

    db = SessionLocal()
    try:
        create_processing_run(db, result)
    finally:
        db.close()

    cache_result(result["run_id"], result)
    return result

@router.post("/process-sample/{sample_id}")
def process_sample(sample_id: str):
    sample = get_sample_by_id(sample_id)
    if not sample:
        raise HTTPException(status_code=404, detail="Sample not found")

    result = process_weather_image_from_path(sample["path"], sample["product_type"])

    db = SessionLocal()
    try:
        create_processing_run(db, result)
    finally:
        db.close()

    cache_result(result["run_id"], result)
    return result

@router.get("/results/{run_id}")
def get_result(run_id: str):
    cached = get_cached_result(run_id)
    if cached:
        return cached

    db = SessionLocal()
    try:
        run = get_processing_run(db, run_id)
        if run:
            result = {
                "run_id": run.id,
                "status": run.status,
                "product_type": run.product_type,
                "summary": {
                    "min_value": run.min_value,
                    "max_value": run.max_value,
                    "mean_value": run.mean_value,
                },
                "risk_score": {
                    "score": run.risk_score_value,
                    "level": run.risk_level,
                },
                "insights": run.insights or [],
                "ai_summary": run.ai_summary or {},
                "files": {
                    "input_url": run.input_url,
                    "overlay_url": run.overlay_url,
                    "result_url": run.result_url,
                }
            }
            cache_result(run_id, result)
            return result
    finally:
        db.close()

    result_path = Path("data/results") / f"{run_id}.json"
    if result_path.exists():
        return json.loads(result_path.read_text())

    raise HTTPException(status_code=404, detail="Result not found")

@router.get("/runs")
def get_runs(limit: int = 20):
    db = SessionLocal()
    try:
        runs = list_processing_runs(db, limit=limit)
        return [
            {
                "run_id": r.id,
                "product_type": r.product_type,
                "status": r.status,
                "risk_level": r.risk_level,
                "max_value": r.max_value,
                "mean_value": r.mean_value,
                "created_at": r.created_at.isoformat() + "Z",
            }
            for r in runs
        ]
    finally:
        db.close()

@router.get("/analytics/trends")
def get_trends():
    db = SessionLocal()
    try:
        return summarize_trends(db)
    finally:
        db.close()