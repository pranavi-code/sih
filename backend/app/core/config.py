"""
Core configuration settings for the underwater image enhancement system
"""

import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings"""
    
    # API Settings
    API_VERSION: str = "v1"
    PROJECT_NAME: str = "Underwater Image Enhancement System"
    DEBUG: bool = True
    
    # Database Settings
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "underwater_enhancement"
    
    # AI Model Settings
    MODELS_PATH: str = "models"
    GAN_MODEL_PATH: str = "models/enhancement/gan_model.h5"
    YOLO_MODEL_PATH: str = "models/detection/yolo_model.pt"
    
    # Image Processing Settings
    MAX_IMAGE_SIZE: int = 4096  # Maximum image dimension
    SUPPORTED_FORMATS: List[str] = ["jpg", "jpeg", "png", "bmp", "tiff"]
    
    # Enhancement Settings
    ENHANCEMENT_OUTPUT_DIR: str = "enhanced"
    UPLOAD_DIR: str = "uploads"
    
    # Edge Device Settings
    EDGE_MODEL_PATH: str = "models/edge"
    USE_GPU: bool = True
    BATCH_SIZE: int = 1
    
    # Quality Metrics Thresholds
    MIN_PSNR: float = 20.0
    MIN_SSIM: float = 0.7
    MIN_UIQM: float = 2.0
    
    # Detection Settings
    CONFIDENCE_THRESHOLD: float = 0.5
    NMS_THRESHOLD: float = 0.4
    
    # Threat Classes
    THREAT_CLASSES: List[str] = [
        "submarine",
        "mine",
        "diver",
        "drone",
        "suspicious_object"
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Global settings instance
settings = Settings()