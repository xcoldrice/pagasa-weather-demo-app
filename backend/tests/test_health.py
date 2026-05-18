# Health check tests
def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_ready(client):
    response = client.get("/ready")
    assert response.status_code == 200
    assert "status" in response.json()

def test_version(client):
    response = client.get("/version")
    assert response.status_code == 200
    body = response.json()
    assert "app_version" in body
    assert "git_sha" in body