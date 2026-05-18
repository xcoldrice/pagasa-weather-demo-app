# Processing utilities
from pathlib import Path
import cv2
import numpy as np

def ensure_bgr(image_path: str):
    img = cv2.imread(image_path, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError(f"Could not read image: {image_path}")
    return img

def save_overlay(run_id: str, overlay: np.ndarray) -> str:
    out_path = Path("data/processed") / f"{run_id}_overlay.png"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(str(out_path), overlay)
    return f"/data/processed/{run_id}_overlay.png"

def normalize_to_range(values: np.ndarray, min_val: float, max_val: float) -> np.ndarray:
    values = values.astype(np.float32)
    vmin = float(values.min())
    vmax = float(values.max())
    if vmax - vmin < 1e-6:
        return np.full_like(values, (min_val + max_val) / 2.0, dtype=np.float32)
    scaled = (values - vmin) / (vmax - vmin)
    return min_val + scaled * (max_val - min_val)