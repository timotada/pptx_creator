"""
PPTX Templater Backend
FastAPI service for processing PowerPoint templates with placeholder replacement
"""

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import tempfile
import os
import re
import shutil
from datetime import datetime
from typing import Optional
import logging

from pptx_processor import PPTXProcessor
from models import ProcessingRequest, ProcessingResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="PPTX Templater API",
    description="API for processing PowerPoint templates with placeholder replacement",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://pptxtemplater.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

processor = PPTXProcessor()

# Create a temporary directory for storing processed files
TEMP_OUTPUT_DIR = tempfile.mkdtemp()
logger.info(f"Created temporary output directory: {TEMP_OUTPUT_DIR}")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "PPTX Templater API is running", "version": "1.0.0"}

@app.post("/process", response_model=ProcessingResponse)
async def process_pptx(
    file: UploadFile = File(...),
    company_name: str = Form(...),
    date: str = Form(...),
    logo: Optional[UploadFile] = File(None)
):
    """
    Process a PPTX template with placeholder replacement
    
    Args:
        file: PPTX template file
        company_name: Company name to replace {{COMPANY_NAME}} placeholders
        date: Date string to format and replace {{DATE}} placeholders
        logo: Optional logo image to replace {{LOGO}} placeholders
    
    Returns:
        ProcessingResponse with download URL and filename
    """
    
    # Validate file type
    if not file.filename.endswith('.pptx'):
        raise HTTPException(status_code=400, detail="File must be a .pptx file")
    
    # Validate file size (50MB limit)
    if file.size and file.size > 50 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 50MB")
    
    try:
        # Create temporary directory for processing
        with tempfile.TemporaryDirectory() as temp_dir:
            # Save uploaded file
            input_path = os.path.join(temp_dir, "input.pptx")
            with open(input_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
            
            # Save logo if provided
            logo_path = None
            if logo:
                logo_path = os.path.join(temp_dir, f"logo.{logo.filename.split('.')[-1]}")
                with open(logo_path, "wb") as buffer:
                    logo_content = await logo.read()
                    buffer.write(logo_content)
            
            # Process the PPTX file
            output_filename = build_output_name(company_name, date)
            temp_output_path = os.path.join(temp_dir, output_filename)
            
            await processor.process_template(
                input_path=input_path,
                output_path=temp_output_path,
                company_name=company_name,
                date=date,
                logo_path=logo_path
            )
            
            # Copy processed file to persistent temp directory for download
            persistent_output_path = os.path.join(TEMP_OUTPUT_DIR, output_filename)
            shutil.copy2(temp_output_path, persistent_output_path)
            
            # In production, upload to S3 and return presigned URL
            # For now, return the processed file directly
            return ProcessingResponse(
                success=True,
                filename=output_filename,
                download_url=f"/download/{output_filename}",
                message="Template processed successfully"
            )
            
    except Exception as e:
        logger.error(f"Error processing PPTX: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@app.get("/download/{filename}")
async def download_file(filename: str):
    """Download processed PPTX file"""
    file_path = os.path.join(TEMP_OUTPUT_DIR, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    # Return the file with proper headers for download
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )

def build_output_name(company_name: str, date_str: str) -> str:
    """Build the output filename in the new format: YYYYMMDD ADA and Company Meeting.pptx"""
    try:
        date_obj = datetime.fromisoformat(date_str)
        iso_date = date_obj.strftime("%Y%m%d")  # 20250524
        
        # Strip illegal filesystem characters
        safe_company = re.sub(r'[\\/:*?"<>|]', "", company_name)
        
        return f"{iso_date} ADA and {safe_company} Meeting.pptx"
    except ValueError:
        # Fallback for invalid date format
        safe_company = re.sub(r'[\\/:*?"<>|]', "", company_name)
        return f"20250524 ADA and {safe_company} Meeting.pptx"

def format_ordinal_date(date_str: str) -> str:
    """Format date string to ordinal format for slide content (e.g., '21st May, 2025')"""
    try:
        date_obj = datetime.fromisoformat(date_str)
        day = date_obj.day
        
        # Get ordinal suffix
        if 10 <= day % 100 <= 20:
            suffix = 'th'
        else:
            suffix = {1: 'st', 2: 'nd', 3: 'rd'}.get(day % 10, 'th')
        
        month = date_obj.strftime("%B")  # May
        year = date_obj.year
        
        return f"{day}{suffix} {month}, {year}"
    except ValueError:
        return "24th May, 2025"  # Fallback

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 
