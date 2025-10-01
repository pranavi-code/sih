"""
AI-Based Underwater Image Enhancement System - FastAPI Backend
Main application entry point
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
import uvicorn
import os
import asyncio
from datetime import datetime
from typing import List, Optional
import logging

from app.core.config import settings
from app.api.routes import enhancement, detection, metrics, dashboard, unified, models
from app.core.database import init_db
from app.services.enhancement_service import ImageEnhancementService
from app.services.threat_detection_service import ThreatDetectionService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Underwater Image Enhancement API",
    description="AI-powered underwater image enhancement and threat detection system",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories
os.makedirs("uploads", exist_ok=True)
os.makedirs("enhanced", exist_ok=True)
os.makedirs("static", exist_ok=True)
os.makedirs("detected", exist_ok=True)  # <-- Add this line

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/files/enhanced", StaticFiles(directory="enhanced"), name="enhanced")
app.mount("/files/detected", StaticFiles(directory="detected"), name="detected")
app.mount("/files/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include API routes
app.include_router(unified.router, prefix="/api/v1", tags=["Unified Processing"])
app.include_router(models.router, prefix="/api/v1/models", tags=["Model Management"])
app.include_router(enhancement.router, prefix="/api/v1", tags=["Enhancement"])
app.include_router(detection.router, prefix="/api/v1", tags=["Detection"])
app.include_router(metrics.router, prefix="/api/v1", tags=["Metrics"])
app.include_router(dashboard.router, prefix="/api/v1", tags=["Dashboard"])

# Global services
enhancement_service = None
detection_service = None

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    global enhancement_service, detection_service
    
    logger.info("Starting Underwater Image Enhancement System...")
    
    # Initialize database
    await init_db()
    
    # Initialize AI services
    try:
        enhancement_service = ImageEnhancementService()
        detection_service = ThreatDetectionService()
        
        # Load models
        await enhancement_service.load_models()
        await detection_service.load_models()
        
        logger.info("AI models loaded successfully")
    except Exception as e:
        logger.error(f"Failed to initialize AI services: {e}")
        # Continue without AI services for development
    
    logger.info("System startup complete")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down Underwater Image Enhancement System...")

@app.get("/")
async def root():
    """Root endpoint with system status"""
    return {
        "message": "Underwater Image Enhancement System API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "docs": "/docs",
            "unified_processing": "/api/v1/process_unified",
            "model_management": "/api/v1/models",
            "enhancement": "/api/v1/enhance",
            "detection": "/api/v1/detect",
            "metrics": "/api/v1/metrics",
            "dashboard": "/api/v1/dashboard"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    global enhancement_service, detection_service
    
    services_status = {
        "enhancement_service": enhancement_service is not None,
        "detection_service": detection_service is not None,
        "database": True  # TODO: Add actual DB health check
    }
    
    return {
        "status": "healthy" if all(services_status.values()) else "degraded",
        "services": services_status,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/v1/process")
async def process_image(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    enhance_only: bool = False
):
    """
    Main endpoint to process underwater images
    - Enhances image quality using GAN models
    - Detects threats using YOLO v11
    - Returns enhanced image and detection results
    """
    global enhancement_service, detection_service
    
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Save uploaded file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        upload_path = f"uploads/{filename}"
        
        with open(upload_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        results = {
            "original_filename": file.filename,
            "processed_filename": filename,
            "timestamp": timestamp,
            "processing_status": "completed"
        }
        
        # Image Enhancement
        if enhancement_service:
            enhanced_path = await enhancement_service.enhance_image(upload_path)
            results["enhanced_image"] = enhanced_path
            
            # Calculate quality metrics
            metrics = await enhancement_service.calculate_metrics(upload_path, enhanced_path)
            results["quality_metrics"] = metrics
        else:
            results["enhanced_image"] = upload_path
            results["quality_metrics"] = {"note": "Enhancement service not available"}
        
        # Threat Detection (if not enhance-only mode)
        if not enhance_only and detection_service:
            detection_results = await detection_service.detect_threats(
                results.get("enhanced_image", upload_path)
            )
            results["detections"] = detection_results
        
        # Store results in database (background task)
        background_tasks.add_task(store_processing_results, results)
        
        return JSONResponse(content=results)
        
    except Exception as e:
        logger.error(f"Error processing image: {e}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

async def store_processing_results(results: dict):
    """Background task to store processing results in database"""
    try:
        # TODO: Implement database storage
        logger.info(f"Storing results for {results['processed_filename']}")
    except Exception as e:
        logger.error(f"Failed to store results: {e}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )