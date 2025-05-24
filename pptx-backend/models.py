"""
Pydantic models for PPTX Templater API
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ProcessingRequest(BaseModel):
    """Request model for PPTX processing"""
    company_name: str = Field(..., min_length=1, max_length=100, description="Company name")
    date: str = Field(..., description="Date in ISO format")
    
    class Config:
        json_schema_extra = {
            "example": {
                "company_name": "Acme Corp",
                "date": "2025-05-24"
            }
        }

class ProcessingResponse(BaseModel):
    """Response model for PPTX processing"""
    success: bool = Field(..., description="Whether processing was successful")
    filename: str = Field(..., description="Generated filename")
    download_url: str = Field(..., description="URL to download the processed file")
    message: str = Field(..., description="Status message")
    processing_time: Optional[float] = Field(None, description="Processing time in seconds")
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "filename": "20250524 ADA and Acme Corp Meeting.pptx",
                "download_url": "https://s3.amazonaws.com/bucket/presigned-url",
                "message": "Template processed successfully",
                "processing_time": 2.34
            }
        }

class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = False
    error: str = Field(..., description="Error message")
    error_code: str = Field(..., description="Error code")
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": False,
                "error": "File too large. Maximum size is 50MB",
                "error_code": "FILE_TOO_LARGE"
            }
        } 