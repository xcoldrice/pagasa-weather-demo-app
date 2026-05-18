# API tests
from pathlib import Path
import pytest

FIXTURES = Path(__file__).parent / "fixtures"

@pytest.mark.requires_db
def test_process_temperature_image(client):
    with open(FIXTURES / "sample_temperature.png", "rb") as f:
        response = client.post(
            "/api/process",
            files={"file": ("sample_temperature.png", f, "image/png")},
            data={"product_type": "temperature"},
        )
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "success"
    assert body["product_type"] == "temperature"
    assert "risk_score" in body
    assert "insights" in body
    assert "ai_summary" in body

@pytest.mark.requires_db
def test_invalid_product_type(client):
    with open(FIXTURES / "sample_temperature.png", "rb") as f:
        response = client.post(
            "/api/process",
            files={"file": ("sample_temperature.png", f, "image/png")},
            data={"product_type": "invalid"},
        )
    assert response.status_code == 400