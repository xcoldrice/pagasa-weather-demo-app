# Sample tests
def test_list_samples(client):
    response = client.get("/api/samples")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_process_missing_sample(client):
    response = client.post("/api/process-sample/does-not-exist")
    assert response.status_code == 404