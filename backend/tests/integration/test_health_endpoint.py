"""
backend/tests/integration/test_health_endpoint.py

Integration tests for health check endpoint.
"""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check():
    """Test health check endpoint returns 200."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200

    data = response.json()
    assert "status" in data
    assert data["status"] in ["ok", "degraded"]
    assert "database" in data


def test_root_endpoint():
    """Test root endpoint returns welcome message."""
    response = client.get("/")
    assert response.status_code == 200

    data = response.json()
    assert "message" in data
    assert "LingPen" in data["message"]
