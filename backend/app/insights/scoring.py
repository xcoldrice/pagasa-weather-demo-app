# Weather scoring system
def calculate_risk_score(result: dict) -> dict:
    max_value = float(result["summary"]["max_value"])
    mean_value = float(result["summary"]["mean_value"])

    if result["product_type"] == "rainfall":
        score = min(100, int((max_value * 0.45) + (mean_value * 0.35)))
    else:
        score = min(100, int((max_value * 1.5) + (mean_value * 1.0)))

    if score >= 75:
        level = "critical"
    elif score >= 50:
        level = "high"
    elif score >= 25:
        level = "moderate"
    else:
        level = "low"

    return {"score": score, "level": level}