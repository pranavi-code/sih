"""
Simple FastAPI server for testing the AI Underwater Image Enhancement System
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from datetime import datetime
from typing import List, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="AI Underwater Image Enhancement System",
    description="Backend API for underwater image enhancement and threat detection",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create upload directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Underwater Image Enhancement System API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "api": "running",
            "database": "not connected (testing mode)",
            "ai_models": "not loaded (testing mode)"
        }
    }

@app.post("/api/enhance/upload")
async def upload_for_enhancement(file: UploadFile = File(...)):
    """Upload image for enhancement (demo version)"""
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Save uploaded file
        file_location = os.path.join(UPLOAD_DIR, f"enhanced_{file.filename}")
        with open(file_location, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Simulate processing
        result = {
            "image_id": f"img_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "original_filename": file.filename,
            "enhanced_filename": f"enhanced_{file.filename}",
            "status": "completed",
            "processing_time": 2.5,
            "enhancement_applied": True,
            "quality_metrics": {
                "psnr": 28.5,
                "ssim": 0.85,
                "uiqm": 3.2
            },
            "timestamp": datetime.now().isoformat()
        }
        
        logger.info(f"Enhanced image: {file.filename}")
        return JSONResponse(content=result)
    
    except Exception as e:
        logger.error(f"Enhancement error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Enhancement failed: {str(e)}")

@app.post("/api/detect/threats")
async def detect_threats(file: UploadFile = File(...)):
    """Detect threats in uploaded image (demo version)"""
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Save uploaded file
        file_location = os.path.join(UPLOAD_DIR, f"detect_{file.filename}")
        with open(file_location, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Simulate threat detection
        result = {
            "image_id": f"det_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "original_filename": file.filename,
            "status": "completed",
            "processing_time": 1.8,
            "detections": [
                {
                    "class": "submarine",
                    "confidence": 0.85,
                    "bbox": [245, 180, 120, 80],
                    "threat_level": "high"
                },
                {
                    "class": "debris",
                    "confidence": 0.72,
                    "bbox": [450, 320, 60, 40],
                    "threat_level": "medium"
                }
            ],
            "total_detections": 2,
            "timestamp": datetime.now().isoformat()
        }
        
        logger.info(f"Detected threats in: {file.filename}")
        return JSONResponse(content=result)
    
    except Exception as e:
        logger.error(f"Detection error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

@app.get("/api/analytics/stats")
async def get_analytics():
    """Get system analytics (demo data)"""
    return {
        "total_images_processed": 156,
        "total_threats_detected": 23,
        "average_processing_time": 2.3,
        "success_rate": 98.5,
        "today_stats": {
            "images_processed": 12,
            "threats_detected": 3,
            "average_time": 2.1
        },
        "processing_history": [
            {"date": "2025-09-28", "count": 12, "threats": 3},
            {"date": "2025-09-27", "count": 18, "threats": 5},
            {"date": "2025-09-26", "count": 15, "threads": 2},
            {"date": "2025-09-25", "count": 22, "threats": 7}
        ],
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/results/{image_id}")
async def get_results(image_id: str):
    """Get processing results for specific image"""
    return {
        "image_id": image_id,
        "status": "completed",
        "results": {
            "enhanced": True,
            "threats_detected": 1,
            "processing_time": 2.1,
            "quality_score": 8.5
        },
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    uvicorn.run(
        "test_main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )