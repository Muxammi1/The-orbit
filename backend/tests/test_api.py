from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_twin_query():
    response = client.post("/twin/query", json={"prompt": "tell me about greenlink"})
    assert response.status_code == 200
    assert "text/event-stream" in response.headers["content-type"]
