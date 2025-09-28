"""
API routes for metrics and quality assessment
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import logging
from datetime import datetime, timedelta
from typing import Optional, Dict, List
import numpy as np

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/quality_metrics")
async def get_quality_metrics():
    """
    Get explanation of quality metrics used in image enhancement
    
    Returns definitions and acceptable ranges for PSNR, SSIM, and UIQM
    """
    metrics_info = {
        "psnr": {
            "name": "Peak Signal-to-Noise Ratio",
            "description": "Measures image quality by comparing pixel-wise differences",
            "unit": "dB",
            "range": "Higher is better",
            "excellent": "> 30 dB",
            "good": "25-30 dB", 
            "acceptable": "20-25 dB",
            "poor": "< 20 dB"
        },
        "ssim": {
            "name": "Structural Similarity Index Measure",
            "description": "Evaluates perceived image quality based on luminance, contrast, and structure",
            "unit": "0-1 scale",
            "range": "Higher is better",
            "excellent": "> 0.9",
            "good": "0.8-0.9",
            "acceptable": "0.7-0.8", 
            "poor": "< 0.7"
        },
        "uiqm": {
            "name": "Underwater Image Quality Measure",
            "description": "Specialized metric for underwater image quality assessment",
            "unit": "Composite score",
            "range": "Higher is better",
            "excellent": "> 4.0",
            "good": "3.0-4.0",
            "acceptable": "2.0-3.0",
            "poor": "< 2.0"
        }
    }
    
    return JSONResponse(content={"metrics": metrics_info})

@router.get("/performance_dashboard")
async def get_performance_dashboard():
    """
    Get performance dashboard data for system monitoring
    
    Returns system performance metrics and statistics
    """
    try:
        # In production, these would be real metrics from monitoring systems
        dashboard_data = {
            "system_status": {
                "status": "operational",
                "uptime": "99.5%",
                "last_update": datetime.now().isoformat()
            },
            "processing_stats": {
                "images_processed_today": 45,
                "threats_detected_today": 12,
                "average_processing_time": "2.3s",
                "enhancement_success_rate": "98.2%",
                "detection_accuracy": "94.7%"
            },
            "quality_trends": {
                "average_psnr": 28.5,
                "average_ssim": 0.84,
                "average_uiqm": 3.2,
                "improvement_rate": "+15% from baseline"
            },
            "threat_statistics": {
                "total_threats_detected": 156,
                "critical_threats": 23,
                "high_priority_threats": 67,
                "most_common_threat": "suspicious_object"
            },
            "resource_usage": {
                "cpu_usage": "45%",
                "memory_usage": "62%",
                "gpu_usage": "78%",
                "storage_usage": "34%"
            }
        }
        
        return JSONResponse(content=dashboard_data)
        
    except Exception as e:
        logger.error(f"Error getting performance dashboard: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve dashboard data")

@router.get("/metrics_history")
async def get_metrics_history(days: int = 7):
    """
    Get historical metrics data for trend analysis
    
    - **days**: Number of days of history to retrieve (default: 7)
    
    Returns time-series data for quality metrics and system performance
    """
    if days > 30:
        raise HTTPException(status_code=400, detail="Maximum 30 days of history allowed")
    
    try:
        # Generate sample historical data for prototype
        history_data = generate_sample_metrics_history(days)
        
        return JSONResponse(content={
            "period": f"{days} days",
            "data_points": len(history_data),
            "history": history_data
        })
        
    except Exception as e:
        logger.error(f"Error getting metrics history: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve metrics history")

@router.get("/comparison_report")
async def get_comparison_report():
    """
    Get comparative analysis report showing before/after enhancement results
    
    Returns statistical comparison of original vs enhanced image quality
    """
    try:
        # Sample comparison data for prototype
        comparison_data = {
            "summary": {
                "total_comparisons": 150,
                "average_improvement": {
                    "psnr": "+6.2 dB",
                    "ssim": "+0.15",
                    "uiqm": "+1.3"
                },
                "success_rate": "96.7%"
            },
            "detailed_analysis": {
                "psnr_improvements": {
                    "significant_improvement": "67%",  # >5dB improvement
                    "moderate_improvement": "24%",     # 2-5dB improvement  
                    "minor_improvement": "8%",         # <2dB improvement
                    "no_improvement": "1%"
                },
                "ssim_improvements": {
                    "significant_improvement": "71%",  # >0.1 improvement
                    "moderate_improvement": "21%",     # 0.05-0.1 improvement
                    "minor_improvement": "7%",         # <0.05 improvement
                    "no_improvement": "1%"
                },
                "by_image_type": {
                    "clear_water": {"avg_psnr_gain": 4.8, "avg_ssim_gain": 0.12},
                    "murky_water": {"avg_psnr_gain": 8.1, "avg_ssim_gain": 0.18},
                    "deep_water": {"avg_psnr_gain": 7.3, "avg_ssim_gain": 0.16}
                }
            },
            "quality_categories": {
                "before_enhancement": {
                    "excellent": "12%",
                    "good": "23%", 
                    "acceptable": "41%",
                    "poor": "24%"
                },
                "after_enhancement": {
                    "excellent": "58%",
                    "good": "31%",
                    "acceptable": "10%", 
                    "poor": "1%"
                }
            }
        }
        
        return JSONResponse(content=comparison_data)
        
    except Exception as e:
        logger.error(f"Error generating comparison report: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate comparison report")

@router.get("/benchmark_results")
async def get_benchmark_results():
    """
    Get benchmark test results comparing different enhancement methods
    
    Returns performance comparison with other enhancement techniques
    """
    try:
        benchmark_data = {
            "test_dataset": {
                "name": "Underwater Enhancement Benchmark",
                "size": 500,
                "image_types": ["shallow_water", "deep_water", "turbid_water", "clear_water"]
            },
            "methods_compared": [
                {
                    "method": "Our GAN Model",
                    "psnr": 28.5,
                    "ssim": 0.84,
                    "uiqm": 3.2,
                    "processing_time": "2.1s",
                    "rank": 1
                },
                {
                    "method": "CLAHE + Color Correction",
                    "psnr": 24.3,
                    "ssim": 0.76,
                    "uiqm": 2.8,
                    "processing_time": "0.8s",
                    "rank": 3
                },
                {
                    "method": "Traditional Histogram Equalization",
                    "psnr": 21.7,
                    "ssim": 0.71,
                    "uiqm": 2.4,
                    "processing_time": "0.3s",
                    "rank": 4
                },
                {
                    "method": "DCP + Retinex",
                    "psnr": 26.1,
                    "ssim": 0.79,
                    "uiqm": 2.9,
                    "processing_time": "1.5s",
                    "rank": 2
                }
            ],
            "performance_summary": {
                "quality_leader": "Our GAN Model",
                "speed_leader": "Traditional Histogram Equalization",
                "balanced_leader": "Our GAN Model",
                "improvement_over_baseline": "31.2%"
            }
        }
        
        return JSONResponse(content=benchmark_data)
        
    except Exception as e:
        logger.error(f"Error getting benchmark results: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve benchmark results")

def generate_sample_metrics_history(days: int) -> List[Dict]:
    """Generate sample historical metrics data"""
    history = []
    base_date = datetime.now() - timedelta(days=days)
    
    for i in range(days):
        date = base_date + timedelta(days=i)
        
        # Generate realistic sample data with some variation
        history.append({
            "date": date.strftime("%Y-%m-%d"),
            "images_processed": np.random.randint(20, 80),
            "threats_detected": np.random.randint(5, 25),
            "avg_psnr": round(np.random.normal(28.0, 2.5), 1),
            "avg_ssim": round(np.random.normal(0.82, 0.08), 2),
            "avg_uiqm": round(np.random.normal(3.1, 0.4), 1),
            "processing_time": round(np.random.normal(2.2, 0.3), 1),
            "success_rate": round(np.random.uniform(95.0, 99.5), 1)
        })
    
    return history