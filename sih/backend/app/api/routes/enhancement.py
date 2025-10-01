"""
API routes for image enhancement functionality
"""

from fastapi import APIRouter, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
import os
import logging
from datetime import datetime
from typing import Optional

from app.services.enhancement_service import ImageEnhancementService

logger = logging.getLogger(__name__)
router = APIRouter()

# Global enhancement service instance
enhancement_service = ImageEnhancementService()

@router.post("/enhance")
async def enhance_image(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    calculate_metrics: bool = True
):
    """
    Enhance underwater image quality using GAN models
    
    - **file**: Image file to enhance
    - **calculate_metrics**: Whether to calculate quality metrics
    
    Returns enhanced image path and quality metrics
    """
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Ensure enhancement service is loaded
        if not enhancement_service.is_loaded:
            await enhancement_service.load_models()
        
        # Save uploaded file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        upload_path = f"uploads/{filename}"
        
        os.makedirs("uploads", exist_ok=True)
        with open(upload_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Enhance image
        enhanced_path = await enhancement_service.enhance_image(upload_path)
        
        results = {
            "original_filename": file.filename,
            "enhanced_image": enhanced_path,
            "timestamp": timestamp,
            "status": "success"
        }
        
        # Calculate metrics if requested
        if calculate_metrics:
            metrics = await enhancement_service.calculate_metrics(upload_path, enhanced_path)
            results["quality_metrics"] = metrics
        
        # Store results in background
        background_tasks.add_task(log_enhancement_results, results)
        
        return JSONResponse(content=results)
        
    except Exception as e:
        logger.error(f"Error enhancing image: {e}")
        raise HTTPException(status_code=500, detail=f"Enhancement failed: {str(e)}")

@router.get("/enhanced/{filename}")
async def get_enhanced_image(filename: str):
    """
    Retrieve enhanced image file
    
    - **filename**: Name of the enhanced image file
    """
    file_path = os.path.join("enhanced", filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Enhanced image not found")
    
    return FileResponse(
        file_path,
        media_type="image/jpeg",
        filename=filename
    )

@router.post("/batch_enhance")
async def batch_enhance_images(
    background_tasks: BackgroundTasks,
    files: list[UploadFile] = File(...)
):
    """
    Enhance multiple images in batch
    
    - **files**: List of image files to enhance
    
    Returns list of enhancement results
    """
    if len(files) > 10:  # Limit batch size
        raise HTTPException(status_code=400, detail="Maximum 10 images per batch")
    
    results = []
    
    try:
        # Ensure enhancement service is loaded
        if not enhancement_service.is_loaded:
            await enhancement_service.load_models()
        
        for file in files:
            if not file.content_type.startswith('image/'):
                results.append({
                    "filename": file.filename,
                    "status": "error",
                    "error": "File must be an image"
                })
                continue
            
            try:
                # Save and enhance each image
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"{timestamp}_{file.filename}"
                upload_path = f"uploads/{filename}"
                
                with open(upload_path, "wb") as buffer:
                    content = await file.read()
                    buffer.write(content)
                
                enhanced_path = await enhancement_service.enhance_image(upload_path)
                
                results.append({
                    "original_filename": file.filename,
                    "enhanced_image": enhanced_path,
                    "timestamp": timestamp,
                    "status": "success"
                })
                
            except Exception as e:
                logger.error(f"Error enhancing {file.filename}: {e}")
                results.append({
                    "filename": file.filename,
                    "status": "error",
                    "error": str(e)
                })
        
        # Log batch results
        background_tasks.add_task(log_batch_results, results)
        
        return JSONResponse(content={"batch_results": results})
        
    except Exception as e:
        logger.error(f"Error in batch enhancement: {e}")
        raise HTTPException(status_code=500, detail=f"Batch enhancement failed: {str(e)}")

@router.get("/enhancement_history")
async def get_enhancement_history():
    """
    Get history of image enhancements
    
    Returns list of recent enhancements
    """
    try:
        # In production, this would query the database
        # For prototype, return sample data
        
        history = [
            {
                "id": "enh_001",
                "original_filename": "underwater_sample1.jpg",
                "enhanced_image": "enhanced/underwater_sample1_enhanced.jpg",
                "timestamp": "2025-09-28T10:30:00Z",
                "quality_metrics": {
                    "psnr": 28.5,
                    "ssim": 0.82,
                    "uiqm": 3.2
                }
            },
            {
                "id": "enh_002", 
                "original_filename": "coral_reef.png",
                "enhanced_image": "enhanced/coral_reef_enhanced.png",
                "timestamp": "2025-09-28T10:15:00Z",
                "quality_metrics": {
                    "psnr": 31.2,
                    "ssim": 0.89,
                    "uiqm": 3.8
                }
            }
        ]
        
        return JSONResponse(content={"history": history})
        
    except Exception as e:
        logger.error(f"Error getting enhancement history: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve history")

async def log_enhancement_results(results: dict):
    """Background task to log enhancement results"""
    try:
        logger.info(f"Enhancement completed: {results['original_filename']}")
        # In production, store in database
    except Exception as e:
        logger.error(f"Error logging enhancement results: {e}")

async def log_batch_results(results: list):
    """Background task to log batch enhancement results"""
    try:
        successful = len([r for r in results if r["status"] == "success"])
        logger.info(f"Batch enhancement completed: {successful}/{len(results)} successful")
        # In production, store in database
    except Exception as e:
        logger.error(f"Error logging batch results: {e}")