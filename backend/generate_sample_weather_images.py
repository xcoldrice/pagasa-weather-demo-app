# Generate sample weather images script with random/dynamic data
from pathlib import Path
import numpy as np
import cv2
from datetime import datetime
import argparse

ROOT = Path(".")
OUT_DIR = ROOT / "data" / "samples"
TEMP_DIR = OUT_DIR / "temperature"
RAIN_DIR = OUT_DIR / "rainfall"

TEMP_DIR.mkdir(parents=True, exist_ok=True)
RAIN_DIR.mkdir(parents=True, exist_ok=True)

def make_temp(path: Path, w=1024, h=768, seed=None):
    """Generate a random temperature map with dynamic hotspots."""
    rng = np.random.default_rng(seed)
    
    x = np.linspace(0, 1, w, dtype=np.float32)
    y = np.linspace(0, 1, h, dtype=np.float32)
    xv, yv = np.meshgrid(x, y)
    
    # Random base gradient
    base_x_weight = rng.uniform(0.3, 0.7)
    base_y_weight = 1.0 - base_x_weight
    base = (base_x_weight * xv + base_y_weight * (1 - yv)) * rng.uniform(0.4, 0.6)

    # Generate random number of hotspots (3-6)
    num_hotspots = rng.integers(3, 7)
    
    for _ in range(num_hotspots):
        cx = rng.uniform(0.1, 0.9)
        cy = rng.uniform(0.1, 0.9)
        amp = rng.uniform(0.5, 1.0)
        sigma = rng.uniform(0.05, 0.12)
        
        d2 = (xv - cx) ** 2 + (yv - cy) ** 2
        base += amp * np.exp(-d2 / (2 * sigma**2))

    base = np.clip(base, 0, 1)
    gray = (base * 255).astype(np.uint8)
    color = cv2.applyColorMap(gray, cv2.COLORMAP_JET)

    # Generate random temperature range
    min_temp = rng.integers(18, 25)
    max_temp = rng.integers(35, 45)
    
    legend = np.tile(np.linspace(255, 0, h, dtype=np.uint8).reshape(h, 1), (1, 40))
    legend_color = cv2.applyColorMap(legend, cv2.COLORMAP_JET)
    color[:, -40:] = legend_color

    cv2.putText(color, "TEMPERATURE (Synthetic)", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255,255,255), 2, cv2.LINE_AA)
    cv2.putText(color, f"Min {min_temp}C", (w-180, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,255,255), 2, cv2.LINE_AA)
    cv2.putText(color, f"Max {max_temp}C", (w-180, h-20), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,255,255), 2, cv2.LINE_AA)

    cv2.imwrite(str(path), color)
    print(f"Generated temperature map: {path} (Range: {min_temp}-{max_temp}°C, {num_hotspots} hotspots)")

def make_rain(path: Path, w=1024, h=768, seed=None):
    """Generate a random rainfall map with dynamic rain centers."""
    rng = np.random.default_rng(seed)
    
    x = np.linspace(0, 1, w, dtype=np.float32)
    y = np.linspace(0, 1, h, dtype=np.float32)
    xv, yv = np.meshgrid(x, y)

    base = np.zeros((h, w), dtype=np.float32)

    # Random number of rainfall centers (15-35)
    num_centers = rng.integers(15, 36)
    
    for _ in range(num_centers):
        cx, cy = rng.random(), rng.random()
        amp = rng.uniform(0.2, 1.0)
        sigma = rng.uniform(0.02, 0.15)
        d2 = (xv - cx) ** 2 + (yv - cy) ** 2
        base += amp * np.exp(-d2 / (2 * sigma**2))

    base = np.clip(base, 0, 1)
    gray = (base * 255).astype(np.uint8)
    color = cv2.applyColorMap(gray, cv2.COLORMAP_TURBO)

    # Random rainfall range
    max_rainfall = rng.integers(100, 200)
    
    legend = np.tile(np.linspace(0, 255, h, dtype=np.uint8).reshape(h, 1), (1, 40))
    legend_color = cv2.applyColorMap(legend, cv2.COLORMAP_TURBO)
    color[:, -40:] = legend_color

    cv2.putText(color, "RAINFALL (Synthetic)", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255,255,255), 2, cv2.LINE_AA)
    cv2.putText(color, "0mm", (w-120, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,255,255), 2, cv2.LINE_AA)
    cv2.putText(color, f"{max_rainfall}mm", (w-160, h-20), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,255,255), 2, cv2.LINE_AA)

    cv2.imwrite(str(path), color)
    print(f"Generated rainfall map: {path} (Range: 0-{max_rainfall}mm, {num_centers} rain centers)")


def main():
    parser = argparse.ArgumentParser(description='Generate random weather sample images')
    parser.add_argument('--count', type=int, default=1, 
                        help='Number of image sets to generate (default: 1)')
    parser.add_argument('--seed', type=int, default=None,
                        help='Random seed for reproducible generation (default: None for random)')
    parser.add_argument('--timestamp', action='store_true',
                        help='Add timestamp to filenames')
    
    args = parser.parse_args()
    
    print(f"Generating {args.count} set(s) of weather images...")
    print(f"Seed: {args.seed if args.seed is not None else 'Random (different each time)'}\n")
    
    for i in range(args.count):
        # Use different seeds for each image if base seed provided
        temp_seed = (args.seed + i * 2) if args.seed is not None else None
        rain_seed = (args.seed + i * 2 + 1) if args.seed is not None else None
        
        if args.timestamp or args.count > 1:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:-3]
            temp_filename = f"sample_temperature_{timestamp}_{i+1}.png"
            rain_filename = f"sample_rainfall_{timestamp}_{i+1}.png"
        else:
            temp_filename = "sample_temperature.png"
            rain_filename = "sample_rainfall.png"
        
        temp_path = TEMP_DIR / temp_filename
        rain_path = RAIN_DIR / rain_filename
        
        make_temp(temp_path, seed=temp_seed)
        make_rain(rain_path, seed=rain_seed)
    
    print(f"\n✓ Successfully generated {args.count} set(s) of weather images")
    print(f"  Temperature images: {TEMP_DIR}")
    print(f"  Rainfall images: {RAIN_DIR}")

if __name__ == "__main__":
    main()