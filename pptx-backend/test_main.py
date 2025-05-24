"""
Tests for PPTX Templater API
"""

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "PPTX Templater API is running"
    assert data["version"] == "1.0.0"

def test_process_endpoint_missing_file():
    """Test process endpoint without file"""
    response = client.post("/process", data={
        "company_name": "Test Corp",
        "date": "2025-05-24"
    })
    assert response.status_code == 422  # Validation error

def test_process_endpoint_invalid_file_type():
    """Test process endpoint with invalid file type"""
    response = client.post(
        "/process",
        files={"file": ("test.txt", b"not a pptx file", "text/plain")},
        data={
            "company_name": "Test Corp",
            "date": "2025-05-24"
        }
    )
    assert response.status_code == 400
    assert "File must be a .pptx file" in response.json()["detail"]

def test_download_endpoint_not_implemented():
    """Test download endpoint returns not implemented"""
    response = client.get("/download/test.pptx")
    assert response.status_code == 501
    assert "not implemented" in response.json()["detail"]

# Integration tests would require actual PPTX files
# These would be added in a full test suite 