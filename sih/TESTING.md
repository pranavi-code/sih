# 🚀 Complete Testing Guide

## How to Run and Test Your AI Underwater Image Enhancement System

### 🎯 **Quick Testing Options**

#### **Option 1: Full Docker Deployment (Recommended for Demo)**
```powershell
# 1. Start Docker Desktop from Windows Start Menu
# 2. Wait for Docker to fully start (whale icon in system tray)
# 3. Run these commands:

cd "c:\Users\Pranavi\Documents\sih\prototype"
docker-compose up -d

# Check if services are running
docker-compose ps

# View logs if needed
docker-compose logs -f
```

**Access Points:**
- 🖥️ **Main Dashboard**: http://localhost
- 📚 **API Documentation**: http://localhost:8000/docs
- 🔧 **Database Admin**: http://localhost:8081 (login: admin/admin)

#### **Option 2: Development Mode (No Docker Required)**

**Terminal 1 - Backend:**
```powershell
cd "c:\Users\Pranavi\Documents\sih\prototype\backend"
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```powershell
cd "c:\Users\Pranavi\Documents\sih\prototype\frontend"
npm install
npm start
```

**Access Points:**
- 🖥️ **Frontend**: http://localhost:3000
- 📚 **Backend API**: http://localhost:8000/docs

---

## 🧪 **Testing Scenarios**

### **1. Image Enhancement Testing**

1. **Access the Web Interface**
   - Go to http://localhost (Docker) or http://localhost:3000 (Dev mode)
   
2. **Navigate to Image Enhancement**
   - Click "Image Enhancement" in the sidebar

3. **Upload Test Image**
   - Drag & drop any underwater image (or any image for testing)
   - Supported formats: JPG, PNG, BMP, TIFF
   - Max size: 50MB

4. **Watch Processing**
   - See real-time status updates
   - View before/after comparison
   - Download enhanced result

### **2. Threat Detection Testing**

1. **Navigate to Threat Detection**
   - Click "Threat Detection" in the sidebar

2. **Upload Image for Analysis**
   - Upload an image (ideally with objects)
   - System will detect potential threats

3. **View Results**
   - See bounding boxes around detected objects
   - Check confidence scores
   - Review threat classifications

### **3. Analytics Dashboard**

1. **Go to Dashboard**
   - Main page shows system overview
   - Real-time processing statistics
   - Performance metrics

2. **Check Analytics Page**
   - Processing history charts
   - System performance graphs
   - Threat detection statistics

### **4. API Testing**

#### **Using curl (if available):**
```powershell
# Test health endpoint
curl http://localhost:8000/health

# Upload image for enhancement
curl -X POST "http://localhost:8000/api/enhance/upload" -F "file=@image.jpg"

# Get system stats
curl http://localhost:8000/api/analytics/stats
```

#### **Using Browser:**
- Visit http://localhost:8000/docs
- Interactive Swagger UI for testing all endpoints
- Try the "Try it out" buttons for each API

---

## 🔍 **Test Cases to Demonstrate**

### **For SIH Demo:**

1. **System Startup Demo**
   ```powershell
   # Show the one-command deployment
   docker-compose up -d
   ```

2. **Image Enhancement Demo**
   - Upload a low-quality underwater image
   - Show real-time processing
   - Compare before/after results
   - Demonstrate quality metrics

3. **Threat Detection Demo**
   - Upload image with objects (boats, submarines, debris)
   - Show bounding box detection
   - Explain confidence scores
   - Demonstrate different threat types

4. **Analytics Demo**
   - Show processing statistics
   - Demonstrate system monitoring
   - Display performance metrics

5. **API Demo**
   - Show interactive API documentation
   - Demonstrate programmatic access
   - Show JSON response format

6. **Edge Deployment Demo**
   - Explain model optimization features
   - Show quantization capabilities
   - Demonstrate TensorRT integration

---

## 🛠️ **Development Testing**

### **Backend Unit Tests**
```powershell
cd backend
venv\Scripts\activate
pytest tests/ -v
```

### **Frontend Tests**
```powershell
cd frontend
npm test
```

### **Integration Tests**
```powershell
# Start services first, then:
pytest tests/integration/ -v
```

---

## 🐛 **Troubleshooting**

### **Common Issues:**

**1. Port Already in Use**
```powershell
# Check what's using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

**2. Docker Issues**
```powershell
# Restart Docker services
docker-compose down
docker-compose up -d

# Clean rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

**3. Frontend Won't Start**
```powershell
# Clear cache and reinstall
cd frontend
rmdir /s node_modules
del package-lock.json
npm install
npm start
```

**4. Backend Dependencies**
```powershell
# Recreate virtual environment
cd backend
rmdir /s venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

---

## 📊 **Performance Testing**

### **Load Testing**
```powershell
# Install testing tools
pip install requests pytest-benchmark

# Run performance tests
pytest tests/performance/ -v
```

### **Memory Usage Monitoring**
```powershell
# Check Docker container resources
docker stats

# Check system memory
Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 10
```

---

## 🎯 **Demo Script for SIH**

### **5-Minute Demo Flow:**

1. **Introduction (30 seconds)**
   - "AI-powered underwater image enhancement for maritime security"
   - Show system architecture diagram

2. **Quick Deployment (1 minute)**
   ```powershell
   docker-compose up -d
   ```
   - Show all services starting
   - Explain containerized architecture

3. **Image Enhancement Demo (2 minutes)**
   - Upload underwater image
   - Show real-time processing
   - Compare before/after results
   - Highlight quality improvements

4. **Threat Detection Demo (1 minute)**
   - Upload image with objects
   - Show bounding box detection
   - Explain maritime threat types

5. **Analytics & API (30 seconds)**
   - Show dashboard analytics
   - Demonstrate API documentation
   - Explain integration capabilities

### **Key Points to Highlight:**
- ✅ Full-stack implementation
- ✅ Real-time processing
- ✅ Production-ready Docker deployment
- ✅ Comprehensive API
- ✅ Edge device optimization
- ✅ Maritime security focus

---

## 🚀 **Ready to Demo!**

Your system is now ready for comprehensive testing and demonstration. The key advantage is that you can show a fully working prototype even without actual trained models, as the system includes placeholder implementations that demonstrate the complete workflow.

**Start with Docker for the most impressive demo, or use development mode for detailed testing and debugging.**