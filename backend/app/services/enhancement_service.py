"""
Image Enhancement Service using GAN models for underwater image enhancement
"""

import cv2
import numpy as np
import tensorflow as tf
from PIL import Image
import os
import logging
from typing import Dict, Optional, Tuple
import asyncio
from concurrent.futures import ThreadPoolExecutor
from skimage.metrics import structural_similarity as ssim
from skimage.metrics import peak_signal_noise_ratio as psnr
import math

logger = logging.getLogger(__name__)

class ImageEnhancementService:
    """Service for enhancing underwater images using deep learning models"""
    
    def __init__(self):
        self.model = None
        self.is_loaded = False
        self.executor = ThreadPoolExecutor(max_workers=2)
    
    async def load_models(self):
        """Load GAN enhancement models"""
        try:
            # For prototype, we'll create a simple enhancement model
            # In production, this would load the actual GAN model
            logger.info("Loading image enhancement models...")
            
            # Simulate model loading
            await asyncio.sleep(1)
            self.is_loaded = True
            
            logger.info("Enhancement models loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load enhancement models: {e}")
            raise
    
    async def enhance_image(self, image_path: str) -> str:
        """
        Enhance underwater image using GAN model
        
        Args:
            image_path: Path to input image
            
        Returns:
            Path to enhanced image
        """
        if not self.is_loaded:
            raise RuntimeError("Enhancement models not loaded")
        
        try:
            # Run enhancement in thread pool to avoid blocking
            enhanced_path = await asyncio.get_event_loop().run_in_executor(
                self.executor, self._enhance_image_sync, image_path
            )
            
            return enhanced_path
            
        except Exception as e:
            logger.error(f"Error enhancing image: {e}")
            raise
    
    def _enhance_image_sync(self, image_path: str) -> str:
        """Synchronous image enhancement"""
        try:
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError(f"Could not load image: {image_path}")
            
            # For prototype - apply underwater enhancement algorithms
            enhanced = self._prototype_enhancement(image)
            
            # Save enhanced image
            filename = os.path.basename(image_path)
            name, ext = os.path.splitext(filename)
            enhanced_filename = f"{name}_enhanced{ext}"
            enhanced_path = os.path.join("enhanced", enhanced_filename)
            
            cv2.imwrite(enhanced_path, enhanced)
            
            logger.info(f"Image enhanced and saved to {enhanced_path}")
            return enhanced_path
            
        except Exception as e:
            logger.error(f"Error in synchronous enhancement: {e}")
            raise
    
    def _prototype_enhancement(self, image: np.ndarray) -> np.ndarray:
        """
        Prototype underwater image enhancement
        Implements basic enhancement techniques for demonstration
        """
        # Convert to float
        image_float = image.astype(np.float32) / 255.0
        
        # 1. Color correction for underwater images
        # Red channel restoration (red light is absorbed first underwater)
        red_enhanced = self._enhance_red_channel(image_float)
        
        # 2. Contrast enhancement using CLAHE
        contrast_enhanced = self._apply_clahe(red_enhanced)
        
        # 3. Dehazing using dark channel prior
        dehazed = self._simple_dehaze(contrast_enhanced)
        
        # 4. Sharpening
        sharpened = self._sharpen_image(dehazed)
        
        # Convert back to uint8
        result = np.clip(sharpened * 255, 0, 255).astype(np.uint8)
        
        return result
    
    def _enhance_red_channel(self, image: np.ndarray) -> np.ndarray:
        """Enhance red channel to compensate for underwater absorption"""
        enhanced = image.copy()
        
        # Boost red channel based on depth estimation (simplified)
        depth_factor = 1.5  # Would be dynamic in real implementation
        enhanced[:, :, 2] = np.clip(enhanced[:, :, 2] * depth_factor, 0, 1)
        
        return enhanced
    
    def _apply_clahe(self, image: np.ndarray) -> np.ndarray:
        """Apply CLAHE for contrast enhancement"""
        # Convert to LAB color space
        lab = cv2.cvtColor((image * 255).astype(np.uint8), cv2.COLOR_BGR2LAB)
        
        # Apply CLAHE to L channel
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        lab[:, :, 0] = clahe.apply(lab[:, :, 0])
        
        # Convert back to BGR
        enhanced = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
        
        return enhanced.astype(np.float32) / 255.0
    
    def _simple_dehaze(self, image: np.ndarray) -> np.ndarray:
        """Simple dehazing algorithm"""
        # Estimate atmospheric light
        atmospheric_light = np.max(image, axis=(0, 1))
        
        # Estimate transmission map (simplified)
        transmission = 1 - 0.3 * np.min(image / atmospheric_light, axis=2, keepdims=True)
        transmission = np.maximum(transmission, 0.1)
        
        # Recover scene radiance
        dehazed = (image - atmospheric_light) / transmission + atmospheric_light
        
        return np.clip(dehazed, 0, 1)
    
    def _sharpen_image(self, image: np.ndarray) -> np.ndarray:
        """Apply sharpening filter"""
        kernel = np.array([[-1, -1, -1],
                          [-1,  9, -1],
                          [-1, -1, -1]])
        
        # Convert to uint8 for filtering
        image_uint8 = (image * 255).astype(np.uint8)
        sharpened = cv2.filter2D(image_uint8, -1, kernel)
        
        return sharpened.astype(np.float32) / 255.0
    
    async def calculate_metrics(self, original_path: str, enhanced_path: str) -> Dict[str, float]:
        """
        Calculate quality metrics comparing original and enhanced images
        
        Args:
            original_path: Path to original image
            enhanced_path: Path to enhanced image
            
        Returns:
            Dictionary with PSNR, SSIM, and UIQM metrics
        """
        try:
            metrics = await asyncio.get_event_loop().run_in_executor(
                self.executor, self._calculate_metrics_sync, original_path, enhanced_path
            )
            
            return metrics
            
        except Exception as e:
            logger.error(f"Error calculating metrics: {e}")
            return {"error": str(e)}
    
    def _calculate_metrics_sync(self, original_path: str, enhanced_path: str) -> Dict[str, float]:
        """Synchronous metrics calculation"""
        try:
            # Load images
            original = cv2.imread(original_path)
            enhanced = cv2.imread(enhanced_path)
            
            if original is None or enhanced is None:
                raise ValueError("Could not load images for metrics calculation")
            
            # Ensure same size
            if original.shape != enhanced.shape:
                enhanced = cv2.resize(enhanced, (original.shape[1], original.shape[0]))
            
            # Calculate PSNR
            psnr_value = psnr(original, enhanced)
            
            # Calculate SSIM
            ssim_value = ssim(original, enhanced, multichannel=True, channel_axis=2)
            
            # Calculate UIQM (Underwater Image Quality Measure) - simplified version
            uiqm_value = self._calculate_uiqm(enhanced)
            
            metrics = {
                "psnr": float(psnr_value),
                "ssim": float(ssim_value),
                "uiqm": float(uiqm_value)
            }
            
            logger.info(f"Metrics calculated: {metrics}")
            return metrics
            
        except Exception as e:
            logger.error(f"Error in metrics calculation: {e}")
            raise
    
    def _calculate_uiqm(self, image: np.ndarray) -> float:
        """
        Calculate Underwater Image Quality Measure (UIQM)
        Simplified implementation for prototype
        """
        try:
            # Convert to float
            image_float = image.astype(np.float32) / 255.0
            
            # Calculate colorfulness measure
            colorfulness = self._calculate_colorfulness(image_float)
            
            # Calculate sharpness measure
            sharpness = self._calculate_sharpness(image_float)
            
            # Calculate contrast measure
            contrast = self._calculate_contrast(image_float)
            
            # Combine measures (simplified UIQM formula)
            uiqm = 0.4 * colorfulness + 0.3 * sharpness + 0.3 * contrast
            
            return uiqm
            
        except Exception as e:
            logger.error(f"Error calculating UIQM: {e}")
            return 0.0
    
    def _calculate_colorfulness(self, image: np.ndarray) -> float:
        """Calculate colorfulness metric"""
        # Convert to LAB
        lab = cv2.cvtColor((image * 255).astype(np.uint8), cv2.COLOR_BGR2LAB)
        a, b = lab[:, :, 1], lab[:, :, 2]
        
        # Calculate colorfulness
        rg = a.astype(np.float32)
        yb = b.astype(np.float32)
        
        std_rg = np.std(rg)
        std_yb = np.std(yb)
        mean_rg = np.mean(rg)
        mean_yb = np.mean(yb)
        
        colorfulness = np.sqrt(std_rg**2 + std_yb**2) + 0.3 * np.sqrt(mean_rg**2 + mean_yb**2)
        
        return colorfulness / 100.0  # Normalize
    
    def _calculate_sharpness(self, image: np.ndarray) -> float:
        """Calculate sharpness using Laplacian variance"""
        gray = cv2.cvtColor((image * 255).astype(np.uint8), cv2.COLOR_BGR2GRAY)
        laplacian = cv2.Laplacian(gray, cv2.CV_64F)
        sharpness = laplacian.var()
        
        return sharpness / 10000.0  # Normalize
    
    def _calculate_contrast(self, image: np.ndarray) -> float:
        """Calculate contrast measure"""
        gray = cv2.cvtColor((image * 255).astype(np.uint8), cv2.COLOR_BGR2GRAY)
        contrast = gray.std()
        
        return contrast / 255.0  # Normalize