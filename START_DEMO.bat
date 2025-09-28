@echo off
echo 🚀 Starting AI Underwater Image Enhancement System
echo ===============================================
echo.

REM Navigate to project root
cd /d "c:\Users\Pranavi\Documents\sih\prototype"

echo [INFO] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && python -c \"
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from datetime import datetime

app = FastAPI(title='AI Underwater Enhancement API', version='1.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000', 'http://localhost'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

@app.get('/')
async def root():
    return {'message': 'AI Underwater Image Enhancement System API', 'status': 'running', 'timestamp': datetime.now().isoformat()}

@app.get('/health')
async def health():
    return {'status': 'healthy', 'timestamp': datetime.now().isoformat()}

@app.post('/api/enhance/upload')
async def enhance_image(file: UploadFile = File(...)):
    return {
        'image_id': f'img_{datetime.now().strftime(\"%Y%m%d_%H%M%S\")}',
        'original_filename': file.filename,
        'status': 'completed',
        'processing_time': 2.5,
        'enhancement_applied': True,
        'quality_metrics': {'psnr': 28.5, 'ssim': 0.85, 'uiqm': 3.2},
        'timestamp': datetime.now().isoformat()
    }

@app.post('/api/detect/threats')
async def detect_threats(file: UploadFile = File(...)):
    return {
        'image_id': f'det_{datetime.now().strftime(\"%Y%m%d_%H%M%S\")}',
        'original_filename': file.filename,
        'status': 'completed',
        'processing_time': 1.8,
        'detections': [
            {'class': 'submarine', 'confidence': 0.85, 'bbox': [245, 180, 120, 80], 'threat_level': 'high'},
            {'class': 'debris', 'confidence': 0.72, 'bbox': [450, 320, 60, 40], 'threat_level': 'medium'}
        ],
        'total_detections': 2,
        'timestamp': datetime.now().isoformat()
    }

@app.get('/api/analytics/stats')
async def get_stats():
    return {
        'total_images_processed': 156,
        'total_threats_detected': 23,
        'average_processing_time': 2.3,
        'success_rate': 98.5,
        'today_stats': {'images_processed': 12, 'threats_detected': 3, 'average_time': 2.1},
        'processing_history': [
            {'date': '2025-09-28', 'count': 12, 'threats': 3},
            {'date': '2025-09-27', 'count': 18, 'threats': 5},
            {'date': '2025-09-26', 'count': 15, 'threats': 2},
            {'date': '2025-09-25', 'count': 22, 'threats': 7}
        ],
        'timestamp': datetime.now().isoformat()
    }

if __name__ == '__main__':
    print('🌊 AI Underwater Enhancement API Starting...')
    print('📍 Backend running at: http://localhost:8000')
    print('📚 API Docs available at: http://localhost:8000/docs')
    uvicorn.run(app, host='0.0.0.0', port=8000, log_level='info')
\""

timeout /t 3 /nobreak >nul

echo [INFO] Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm start"

timeout /t 5 /nobreak >nul

echo.
echo ✅ System Started Successfully!
echo.
echo 📍 Access Points:
echo   🖥️  Frontend Dashboard: http://localhost:3000
echo   📚 Backend API Docs:    http://localhost:8000/docs
echo   🔧 API Health Check:    http://localhost:8000/health
echo.
echo 🧪 Testing Instructions:
echo   1. Open http://localhost:3000 in your browser
echo   2. Navigate to "Image Enhancement" page
echo   3. Upload any image file (drag & drop)
echo   4. Watch the processing simulation
echo   5. Check "Threat Detection" page for security features
echo   6. View "Analytics" for system metrics
echo.
echo 🚀 Ready for SIH Demo!
echo.
pause