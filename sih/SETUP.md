## 🚀 Quick Start with Docker

### Prerequisites
- Docker Desktop installed and running
- Git for cloning the repository

### 1. Get the Code
```bash
git clone <your-repository-url>
cd prototype
```

### 2. Start the System
```bash
# Start all services (backend, frontend, database, cache)
docker-compose up -d
```

### 3. Access the System
- **Web Dashboard**: http://localhost (Main application interface)
- **API Documentation**: http://localhost:8000/docs (Swagger UI)
- **Database Admin**: http://localhost:8081 (MongoDB Express - admin/admin)

### 4. Test the System
1. Open http://localhost in your browser
2. Navigate to the "Image Enhancement" page
3. Upload an underwater image (sample images available in `/test-images/`)
4. Watch the enhancement process in real-time
5. Check the "Threat Detection" page for security analysis

### 5. Stop the System
```bash
docker-compose down
```

## 📊 Quick Demo

### Sample Images
Test images are available in the `test-images/` directory:
- `underwater_fish.jpg` - Clear underwater scene
- `murky_underwater.jpg` - Low visibility underwater image  
- `submarine_detection.jpg` - Image with submarine for threat detection

### Expected Results
- **Enhancement**: Improved clarity, color correction, reduced haze
- **Detection**: Bounding boxes around detected objects with confidence scores
- **Processing Time**: 2-3 seconds per image (CPU), <1 second (GPU)

## 🔧 Advanced Configuration

### Environment Variables
Create a `.env` file for custom configuration:

```env
# Database
MONGODB_URL=mongodb://admin:underwater_admin_2024@mongodb:27017/underwater_security?authSource=admin
REDIS_URL=redis://redis:6379

# API Settings
LOG_LEVEL=INFO
MAX_FILE_SIZE=52428800  # 50MB
WORKERS=4

# Model Settings
MODEL_PATH=/app/models
ENHANCEMENT_MODEL=underwater_gan_v2.h5
DETECTION_MODEL=yolo_underwater_v11.pt
```

### Custom Models
To use your own trained models:
1. Place model files in the `models/` directory
2. Update the environment variables
3. Restart the backend service: `docker-compose restart backend`

## 🎯 System Components

### Backend Services (FastAPI)
- **Enhancement API**: GAN-based image restoration
- **Detection API**: YOLO-based threat identification  
- **Analytics API**: Processing statistics and metrics
- **File Management**: Upload/download handling
- **Database Integration**: MongoDB operations

### Frontend Application (React)
- **Dashboard**: Real-time system monitoring
- **Image Enhancement**: Upload and processing interface
- **Threat Detection**: Visualization with bounding boxes
- **Analytics**: Charts and performance metrics
- **Settings**: System configuration panel

### AI Models
- **Enhancement Model**: U-Net based GAN architecture
- **Detection Model**: YOLOv11 with custom underwater classes
- **Edge Optimization**: TensorRT and quantization support
- **Quality Metrics**: PSNR, SSIM, UIQM calculations

### Database & Storage
- **MongoDB**: Processed images, detection results, analytics
- **Redis**: Session caching and queue management
- **File Storage**: Local filesystem with configurable paths
- **Backup**: Automated data backup capabilities

## 🔍 API Usage Examples

### Image Enhancement
```bash
curl -X POST "http://localhost:8000/api/enhance/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@underwater_image.jpg"
```

### Threat Detection
```bash
curl -X POST "http://localhost:8000/api/detect/threats" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@submarine_image.jpg"
```

### Get Results
```bash
curl -X GET "http://localhost:8000/api/results/{image_id}"
```

### System Health
```bash
curl -X GET "http://localhost:8000/health"
```

## 🧪 Development Setup

### Backend Development
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development  
```bash
cd frontend
npm install
npm start  # Runs on http://localhost:3000
```

### Running Tests
```bash
# Backend tests
cd backend && pytest tests/ -v

# Frontend tests  
cd frontend && npm test

# Integration tests
docker-compose -f docker-compose.test.yml up
pytest tests/integration/ -v
```

## 🚀 Deployment Options

### Local Docker Deployment
```bash
docker-compose up -d
```

### Production Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Cloud Deployment
- **AWS ECS**: Task definitions provided
- **Google Cloud Run**: Deployment configs included
- **Azure Container Apps**: ARM templates available
- **Kubernetes**: Manifests in `/k8s/` directory

## 🆘 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Check what's using the port
netstat -ano | findstr :8000  # Windows
lsof -i :8000                # Linux/Mac

# Stop the process or change port in docker-compose.yml
```

**Models Not Loading**
```bash
# Check model files exist
ls -la models/
# Verify backend logs
docker-compose logs backend
```

**Frontend Won't Connect to Backend**
```bash
# Verify backend is running
curl http://localhost:8000/health
# Check network in docker-compose.yml
docker network ls
```

**Database Connection Issues**
```bash
# Check MongoDB logs
docker-compose logs mongodb
# Test connection
docker-compose exec backend python -c "from motor.motor_asyncio import AsyncIOMotorClient; print('OK')"
```

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review logs: `docker-compose logs [service-name]`
3. Check GitHub issues for similar problems
4. Create a new issue with logs and system information

---

**🌟 Ready to enhance underwater imagery and detect maritime threats!**

*Start with `docker-compose up -d` and visit http://localhost*