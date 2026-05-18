# Pipeline tests
from pathlib import Path
from app.processing.temperature import process_temperature
from app.processing.rainfall import process_rainfall
from app.insights.scoring import calculate_risk_score
from app.insights.recommendations import generate_recommendations

FIXTURES = Path(__file__).parent / "fixtures"

def test_temperature_pipeline():
    result = process_temperature(str(FIXTURES / "sample_temperature.png"), "run_test_temp")
    assert result["status"] == "success"
    assert result["product_type"] == "temperature"
    assert result["summary"]["max_value"] >= result["summary"]["min_value"]

    risk = calculate_risk_score(result)
    insights = generate_recommendations({**result, "risk_score": risk})
    assert "score" in risk
    assert isinstance(insights, list)

def test_rainfall_pipeline():
    result = process_rainfall(str(FIXTURES / "sample_rainfall.png"), "run_test_rain")
    assert result["status"] == "success"
    assert result["product_type"] == "rainfall"
    assert result["summary"]["max_value"] >= result["summary"]["min_value"]

    risk = calculate_risk_score(result)
    insights = generate_recommendations({**result, "risk_score": risk})
    assert "score" in risk
    assert isinstance(insights, list)