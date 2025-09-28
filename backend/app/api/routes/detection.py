"""
API routes for threat detection functionality
"""

from fastapi import APIRouter, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
import os
import logging
from datetime import datetime
from typing import Optional

from app.services.threat_detection_service import ThreatDetectionService

logger = logging.getLogger(__name__)
router = APIRouter()

# Global detection service instance
detection_service = ThreatDetectionService()

@router.post("/detect")
async def detect_threats(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    confidence_threshold: float = 0.5
):
    """
    Detect maritime threats in underwater images
    
    - **file**: Image file to analyze
    - **confidence_threshold**: Minimum confidence for detections (0.0-1.0)
    
    Returns detection results with bounding boxes and threat classifications
    """
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    if not (0.0 <= confidence_threshold <= 1.0):
        raise HTTPException(status_code=400, detail="Confidence threshold must be between 0.0 and 1.0")
    
    try:
        # Ensure detection service is loaded
        if not detection_service.is_loaded:
            await detection_service.load_models()
        
        # Save uploaded file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        upload_path = f"uploads/{filename}"
        
        os.makedirs("uploads", exist_ok=True)
        with open(upload_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Detect threats
        detection_results = await detection_service.detect_threats(upload_path, confidence_threshold)
        
        results = {
            "original_filename": file.filename,
            "timestamp": timestamp,
            "confidence_threshold": confidence_threshold,
            "status": "success",
            **detection_results
        }
        
        # Store results in background
        background_tasks.add_task(log_detection_results, results)
        
        return JSONResponse(content=results)
        
    except Exception as e:
        logger.error(f"Error detecting threats: {e}")
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

@router.get("/detected/{filename}")
async def get_detected_image(filename: str):
    """
    Retrieve annotated image with detection boxes
    
    - **filename**: Name of the annotated image file
    """
    file_path = os.path.join("enhanced", filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Annotated image not found")
    
    return FileResponse(
        file_path,
        media_type="image/jpeg", 
        filename=filename
    )

@router.post("/analyze_threats")
async def analyze_threat_patterns(
    background_tasks: BackgroundTasks,
    files: list[UploadFile] = File(...)
):
    """
    Analyze threat patterns across multiple images
    
    - **files**: List of image files to analyze
    
    Returns threat pattern analysis and statistics
    """
    if len(files) > 20:  # Limit batch size
        raise HTTPException(status_code=400, detail="Maximum 20 images per analysis")
    
    try:
        # Ensure detection service is loaded
        if not detection_service.is_loaded:
            await detection_service.load_models()
        
        all_detections = []
        image_results = []
        
        for file in files:
            if not file.content_type.startswith('image/'):
                continue
            
            # Save and analyze each image
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{timestamp}_{file.filename}"
            upload_path = f"uploads/{filename}"
            
            with open(upload_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
            
            detection_results = await detection_service.detect_threats(upload_path)
            
            image_results.append({
                "filename": file.filename,
                "detections": detection_results["detections"],
                "threat_summary": detection_results["threat_summary"]
            })
            
            all_detections.extend(detection_results["detections"])
        
        # Analyze patterns
        pattern_analysis = analyze_threat_patterns_sync(all_detections)
        
        results = {
            "total_images": len(image_results),
            "total_threats": len(all_detections),
            "image_results": image_results,
            "pattern_analysis": pattern_analysis,
            "timestamp": datetime.now().isoformat()
        }
        
        # Store analysis results
        background_tasks.add_task(log_pattern_analysis, results)
        
        return JSONResponse(content=results)
        
    except Exception as e:
        logger.error(f"Error analyzing threat patterns: {e}")
        raise HTTPException(status_code=500, detail=f"Pattern analysis failed: {str(e)}")

@router.get("/threat_statistics")
async def get_threat_statistics():
    """
    Get overall threat detection statistics
    
    Returns statistical summary of threat detections
    """
    try:
        stats = await detection_service.get_threat_statistics()
        return JSONResponse(content=stats)
        
    except Exception as e:
        logger.error(f"Error getting threat statistics: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve statistics")

@router.get("/detection_history")
async def get_detection_history():
    """
    Get history of threat detections
    
    Returns list of recent detections
    """
    try:
        # In production, this would query the database
        # For prototype, return sample data
        
        history = [
            {
                "id": "det_001",
                "filename": "patrol_area_1.jpg",
                "timestamp": "2025-09-28T10:45:00Z",
                "total_detections": 2,
                "threat_summary": {
                    "critical_threats": 1,
                    "high_threats": 1,
                    "threat_types": {"submarine": 1, "diver": 1}
                }
            },
            {
                "id": "det_002",
                "filename": "surveillance_zone.png", 
                "timestamp": "2025-09-28T10:30:00Z",
                "total_detections": 0,
                "threat_summary": {
                    "critical_threats": 0,
                    "high_threats": 0,
                    "threat_types": {}
                }
            }
        ]
        
        return JSONResponse(content={"history": history})
        
    except Exception as e:
        logger.error(f"Error getting detection history: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve history")

@router.get("/threat_types")
async def get_threat_types():
    """
    Get list of detectable threat types with descriptions
    
    Returns threat type definitions and severity levels
    """
    threat_types = {
        "submarine": {
            "description": "Underwater military vessel",
            "severity": "critical",
            "detection_features": ["elongated hull", "periscope", "conning tower"]
        },
        "mine": {
            "description": "Naval explosive device",
            "severity": "critical", 
            "detection_features": ["spherical shape", "spikes", "chain attachment"]
        },
        "diver": {
            "description": "Human underwater swimmer",
            "severity": "high",
            "detection_features": ["human silhouette", "diving gear", "fins"]
        },
        "drone": {
            "description": "Unmanned underwater vehicle",
            "severity": "high",
            "detection_features": ["propellers", "camera equipment", "compact size"]
        },
        "suspicious_object": {
            "description": "Unidentified potentially threatening object",
            "severity": "medium",
            "detection_features": ["unusual shape", "artificial materials", "foreign objects"]
        }
    }
    
    return JSONResponse(content={"threat_types": threat_types})

def analyze_threat_patterns_sync(detections: list) -> dict:
    """Analyze patterns in threat detections"""
    if not detections:
        return {"pattern_summary": "No threats detected"}
    
    # Group by threat type
    threat_counts = {}
    severity_counts = {"critical": 0, "high": 0, "medium": 0}
    
    for detection in detections:
        threat_type = detection["threat_type"]
        severity = detection["severity"]
        
        threat_counts[threat_type] = threat_counts.get(threat_type, 0) + 1
        severity_counts[severity] = severity_counts.get(severity, 0) + 1
    
    # Find most common threat
    most_common_threat = max(threat_counts.items(), key=lambda x: x[1])
    
    # Calculate average confidence
    avg_confidence = sum(d["confidence"] for d in detections) / len(detections)
    
    return {
        "most_common_threat": {
            "type": most_common_threat[0],
            "count": most_common_threat[1]
        },
        "threat_distribution": threat_counts,
        "severity_distribution": severity_counts,
        "average_confidence": round(avg_confidence, 2),
        "total_threats": len(detections),
        "risk_level": "high" if severity_counts["critical"] > 0 else "medium" if severity_counts["high"] > 0 else "low"
    }

async def log_detection_results(results: dict):
    """Background task to log detection results"""
    try:
        logger.info(f"Detection completed: {results['original_filename']} - {results['total_detections']} threats found")
        # In production, store in database
    except Exception as e:
        logger.error(f"Error logging detection results: {e}")

async def log_pattern_analysis(results: dict):
    """Background task to log pattern analysis results"""
    try:
        logger.info(f"Pattern analysis completed: {results['total_images']} images, {results['total_threats']} threats")
        # In production, store in database
    except Exception as e:
        logger.error(f"Error logging pattern analysis: {e}")