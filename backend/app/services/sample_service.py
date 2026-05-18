# Sample service
from pathlib import Path

SAMPLES_DIR = Path("data/samples")

def list_samples():
    samples = []

    if not SAMPLES_DIR.exists():
        return samples

    for product_dir in SAMPLES_DIR.iterdir():
        if not product_dir.is_dir():
            continue

        product_type = product_dir.name

        for file in product_dir.iterdir():
            if file.is_file() and file.suffix.lower() in {".png", ".jpg", ".jpeg"}:
                samples.append({
                    "id": f"{product_type}-{file.stem}",
                    "name": file.stem.replace("_", " ").title(),
                    "product_type": product_type,
                    "file_name": file.name,
                    "url": f"/data/samples/{product_type}/{file.name}",
                    "path": str(file),
                })

    return samples

def get_sample_by_id(sample_id: str):
    for sample in list_samples():
        if sample["id"] == sample_id:
            return sample
    return None