"""
API routes for threat detection functionality
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks, Query, Request
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from typing import Optional, List
import os
import shutil
from datetime import datetime
import time
import uuid
from app.services.threat_detection_service import ThreatDetectionService
from app.core.config import settings

router = APIRouter()
detection_service = ThreatDetectionService()

# Define the upload directory
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

class DetectionResponse(BaseModel):
    success: bool
    detected_image_path: Optional[str] = None
    detections: Optional[List[dict]] = None
    total_detections: Optional[int] = None
    error: Optional[str] = None

@router.post("/detect", response_model=DetectionResponse)
async def detect_threats(
    background_tasks: BackgroundTasks,
    image: UploadFile = File(...),
    confidence: Optional[float] = Form(None),
    nms_threshold: Optional[float] = Form(None),
    max_detections: Optional[int] = Form(None),
    use_enhanced: Optional[bool] = Form(None),
    # Also accept as query parameters for compatibility
    confidence_query: Optional[float] = Query(None, alias="confidence"),
    nms_threshold_query: Optional[float] = Query(None, alias="nms_threshold"),
    max_detections_query: Optional[int] = Query(None, alias="max_detections")
):
    """
    Detect threats in an uploaded image.
    If use_enhanced is True, it will look for an enhanced version of the image to use.
    """
    try:
        # Use parameters from either form or query (form takes precedence)
        final_confidence = confidence if confidence is not None else (confidence_query if confidence_query is not None else 0.5)
        final_nms_threshold = nms_threshold if nms_threshold is not None else (nms_threshold_query if nms_threshold_query is not None else 0.4)
        final_max_detections = max_detections if max_detections is not None else (max_detections_query if max_detections_query is not None else 20)
        final_use_enhanced = use_enhanced if use_enhanced is not None else True
        
        # Create timestamp for unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{image.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        
        # Save the uploaded file
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        # Check if we should use an enhanced version (if available)
        if use_enhanced:
            enhanced_dir = os.path.join(os.path.dirname(UPLOAD_DIR), "enhanced")
            enhanced_filename = f"{os.path.splitext(filename)[0]}_enhanced.png"
            enhanced_filepath = os.path.join(enhanced_dir, enhanced_filename)
            
            # If enhanced version exists, use it, otherwise use original
            if os.path.exists(enhanced_filepath):
                detection_image = enhanced_filepath
            else:
                detection_image = filepath
        else:
            detection_image = filepath
        
        # Run threat detection
        result = await detection_service.detect_threats(
            detection_image,
            confidence=confidence,
            nms_threshold=nms_threshold,
            max_detections=max_detections
        )
        
        if not result["success"]:
            return JSONResponse(
                status_code=500,
                content={
                    "success": False,
                    "error": result.get("error", "Detection failed")
                }
            )
        
        # Return detection results
        return {
            "success": True,
            "detected_image_path": result["detected_image_path"],
            "annotated_image": result["detected_image_path"],  # For frontend compatibility
            "detections": result["detections"],
            "total_detections": result["total_detections"]
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

@router.get("/test")
async def test_detection():
    """Test detection service"""
    return {
        "service_loaded": detection_service.is_loaded,
        "model_available": detection_service.model is not None,
        "detection_dir": detection_service.detection_dir
    }

@router.post("/debug-detect")
async def debug_detect(request: Request):
    """Debug endpoint to see what we're receiving"""
    body = await request.body()
    headers = dict(request.headers)
    query_params = dict(request.query_params)
    
    return {
        "method": request.method,
        "url": str(request.url),
        "headers": headers,
        "query_params": query_params,
        "body_length": len(body),
        "content_type": headers.get("content-type", "unknown")
    }

@router.get("/image/{path:path}")
async def get_image(path: str):
    """Serve detection images"""
    detected_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "detected")
    image_path = os.path.join(detected_dir, path)
    
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image not found")
        
    return FileResponse(image_path)