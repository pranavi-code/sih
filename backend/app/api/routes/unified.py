"""
API routes for unified image processing (enhancement + detection)
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks, Query
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from typing import Optional, List
import os
import shutil
import logging
from datetime import datetime

from app.services.enhancement_service import ImageEnhancementService
from app.services.threat_detection_service import ThreatDetectionService
from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()

# Global service instances
enhancement_service = ImageEnhancementService()
detection_service = ThreatDetectionService()

# Define the upload directory
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

class UnifiedResponse(BaseModel):
    success: bool
    enhanced_image_path: Optional[str] = None
    detected_image_path: Optional[str] = None
    metrics: Optional[dict] = None
    detections: Optional[List[dict]] = None
    total_detections: Optional[int] = None
    error: Optional[str] = None

@router.post("/process", response_model=UnifiedResponse)
async def unified_processing(
    background_tasks: BackgroundTasks,
    image: UploadFile = File(...),
    # Enhancement parameters
    enhancement_level: float = Form(0.8, ge=0.1, le=1.0),
    # Detection parameters
    confidence: float = Query(0.5, ge=0.1, le=1.0),
    nms_threshold: float = Query(0.4, ge=0.1, le=1.0),
    max_detections: int = Query(20, ge=1, le=100),
    perform_detection: bool = Form(True)
):
    """
    Process an image through both enhancement and threat detection pipelines.
    """
    try:
        # Create timestamp for unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{image.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        
        # Save the uploaded file
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        # Step 1: Enhance the image
        enhancement_result = await enhancement_service.enhance_image(
            filepath, 
            enhancement_level=enhancement_level
        )
        
        if not enhancement_result["success"]:
            return JSONResponse(
                status_code=500,
                content={
                    "success": False,
                    "error": enhancement_result.get("error", "Enhancement failed")
                }
            )
        
        enhanced_image_path = enhancement_result["enhanced_image_path"]
        metrics = enhancement_result["metrics"]
        
        # Step 2: Run threat detection on enhanced image if requested
        detection_result = None
        if perform_detection:
            detection_result = await detection_service.detect_threats(
                enhanced_image_path,
                confidence=confidence,
                nms_threshold=nms_threshold,
                max_detections=max_detections
            )
            
            if not detection_result["success"]:
                # Even if detection fails, return the enhanced image
                return {
                    "success": True,
                    "enhanced_image_path": enhanced_image_path,
                    "metrics": metrics,
                    "error": f"Enhancement successful but detection failed: {detection_result.get('error')}"
                }
        
        # Return combined results
        return {
            "success": True,
            "enhanced_image_path": enhanced_image_path,
            "detected_image_path": detection_result["detected_image_path"] if detection_result else None,
            "metrics": metrics,
            "detections": detection_result["detections"] if detection_result else [],
            "total_detections": detection_result["total_detections"] if detection_result else 0
        }
        
    except Exception as e:
        import traceback
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e),
                "traceback": traceback.format_exc()
            }
        )

@router.get("/enhanced-image/{path:path}")
async def get_enhanced_image(path: str):
    """Serve enhanced images"""
    enhanced_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "enhanced")
    image_path = os.path.join(enhanced_dir, path)
    
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image not found")
        
    return FileResponse(image_path)

@router.get("/detected-image/{path:path}")
async def get_detected_image(path: str):
    """Serve detection images"""
    detected_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "detected")
    image_path = os.path.join(detected_dir, path)
    
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image not found")
        
    return FileResponse(image_path)
