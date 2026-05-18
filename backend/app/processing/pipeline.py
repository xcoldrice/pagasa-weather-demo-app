# Processing pipeline
import uuid
import shutil
from pathlib import Path

from app.processing.temperature import process_temperature
from app.processing.rainfall import process_rainfall
from app.services.storage import save_upload, save_result_json, UPLOAD_DIR

from app.insights.scoring import calculate_risk_score
from app.insights.recommendations import generate_recommendations
from app.ai.summarizer import summarize_result_with_ai

async def process_weather_image(file, product_type: str):
    run_id = f"run_{uuid.uuid4().hex[:12]}"
    input_path = await save_upload(file, run_id)
    return process_weather_image_from_path(input_path, product_type, run_id)

def process_weather_image_from_path(source_path: str, product_type: str, run_id: str | None = None):
    run_id = run_id or f"run_{uuid.uuid4().hex[:12]}"
    source = Path(source_path)

    ext = source.suffix or ".png"
    target_path = UPLOAD_DIR / f"{run_id}{ext}"
    target_path.parent.mkdir(parents=True, exist_ok=True)

    if str(source.resolve()) != str(target_path.resolve()):
        shutil.copy(source, target_path)

    input_path = str(target_path)

    if product_type == "temperature":
        result = process_temperature(input_path, run_id)
    elif product_type == "rainfall":
        result = process_rainfall(input_path, run_id)
    else:
        raise ValueError(f"Unsupported product_type: {product_type}")

    result["risk_score"] = calculate_risk_score(result)
    result["insights"] = generate_recommendations(result)
    result["ai_summary"] = summarize_result_with_ai(result)

    save_result_json(run_id, result)
    return result