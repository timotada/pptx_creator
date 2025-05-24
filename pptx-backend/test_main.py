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

def test_download_file_not_found():
    """Requesting a missing file should return 404"""
    response = client.get("/download/test.pptx")
    assert response.status_code == 404
    assert "File not found" in response.json()["detail"]


def test_download_existing_file(tmp_path):
    """Downloading an existing file returns the file with correct content type"""
    from main import TEMP_OUTPUT_DIR
    filename = "sample.pptx"
    temp_file_path = tmp_path / filename
    temp_file_path.write_bytes(b"dummy content")

    # Copy the temp file into the application's output directory
    import shutil, os
    shutil.copy2(temp_file_path, os.path.join(TEMP_OUTPUT_DIR, filename))

    response = client.get(f"/download/{filename}")
    assert response.status_code == 200
    assert response.headers["content-type"] == (
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )

# Integration tests would require actual PPTX files
# These would be added in a full test suite 