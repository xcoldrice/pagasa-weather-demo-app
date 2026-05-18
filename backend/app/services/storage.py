# Storage service
from pathlib import Path
import json

DATA_DIR = Path("data")
UPLOAD_DIR = DATA_DIR / "uploads"
PROCESSED_DIR = DATA_DIR / "processed"
RESULTS_DIR = DATA_DIR / "results"

for directory in [UPLOAD_DIR, PROCESSED_DIR, RESULTS_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

async def save_upload(file, run_id: str) -> str:
    suffix = Path(file.filename).suffix or ".png"
    target = UPLOAD_DIR / f"{run_id}{suffix}"
    content = await file.read()
    target.write_bytes(content)
    return str(target)

def save_result_json(run_id: str, result: dict) -> None:
    path = RESULTS_DIR / f"{run_id}.json"
    path.write_text(json.dumps(result, indent=2))