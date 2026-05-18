# Temperature data processing
from pathlib import Path
import cv2
import numpy as np
from app.processing.utils import ensure_bgr, save_overlay, normalize_to_range

TEMP_MIN = 20.0
TEMP_MAX = 40.0

def process_temperature(input_path: str, run_id: str):
    img = ensure_bgr(input_path)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    values = normalize_to_range(gray, TEMP_MIN, TEMP_MAX)

    colored = cv2.applyColorMap(
        cv2.normalize(gray, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8),
        cv2.COLORMAP_JET,
    )
    overlay = cv2.addWeighted(img, 0.55, colored, 0.45, 0)

    overlay_url = save_overlay(run_id, overlay)
    ext = Path(input_path).suffix or ".png"
    input_url = f"/data/uploads/{run_id}{ext}"

    return {
        "run_id": run_id,
        "status": "success",
        "product_type": "temperature",
        "summary": {
            "min_value": round(float(np.min(values)), 2),
            "max_value": round(float(np.max(values)), 2),
            "mean_value": round(float(np.mean(values)), 2),
        },
        "files": {
            "input_url": input_url,
            "overlay_url": overlay_url,
            "result_url": f"/api/results/{run_id}"
        }
    }