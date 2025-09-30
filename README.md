# AI-Based Underwater Image Enhancement & Threat Detection System

## 🌊 What is this project?

This project is an **AI-powered software platform** designed to enhance underwater images and automatically detect maritime threats. It is built for defense and security applications, especially for India's maritime surveillance needs. The system uses deep learning models (GANs for image enhancement, YOLO for threat detection) to process underwater images from cameras, AUVs, or ROVs, improving visibility and identifying threats like submarines, mines, drones, and divers.

---

## 🚀 What does it do?

- **Enhances underwater images** to restore clarity, color, and contrast using AI.
- **Detects and classifies threats** (submarines, mines, divers, drones) in real time.
- **Provides a web dashboard** for uploading images, viewing results, and monitoring metrics.
- **Supports edge deployment** for live processing on AUV/ROV devices.
- **Shows quality metrics** (PSNR, SSIM, UIQM) and detection confidence for trust and explainability.

---

## ⚙️ How does it work?

1. **Upload an underwater image or video** via the web dashboard.
2. The backend **enhances the image** using a GAN-based model.
3. The enhanced image is **analyzed for threats** using a YOLO-based detector.
4. **Results are displayed**: enhanced image, detected threats, and quality metrics.
5. **Download results** or view historical analysis.
6. **Edge devices** can run optimized models for real-time, low-latency operation.

---

## 🛠️ How to clone and run

###  Clone the repository

```bash
git clone https://github.com/pranavi-code/sih
cd sih
```

###  Install dependencies

#### Python backend

```bash
pip install -r requirements.txt
```

 Install the required npm packages in your main project folder:
```bash
npm install concurrently wait-on --save-dev
```

### Start both servers

Run this command in your main folder (`sih`):

```bash
npm start
```

This will:
- Start the FastAPI backend on port 8000
- Wait for the backend to be ready
- Start the React frontend on port 3000

### Access the system

- **Frontend dashboard:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **API docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🧩 Features

- Unified image enhancement + threat detection pipeline
- Real-time dashboard with upload, visualization, and metrics
- Model management for edge deployment
- Quality metrics for image and detection trust
- Docker-ready for easy deployment

---

## 🏆 Technology Stack

- **AI/ML:** TensorFlow, PyTorch, OpenCV, YOLO v11
- **Backend:** FastAPI, Uvicorn
- **Frontend:** React.js, Material-UI
- **Database:** MongoDB
- **Edge:** TensorRT, CUDA

---

## 📈 Quality Metrics

- **PSNR** (Peak Signal-to-Noise Ratio)
- **SSIM** (Structural Similarity Index)
- **UIQM** (Underwater Image Quality Measure)

---

## 🛡️ Threats Detected

- Submarines
- Naval mines
- Underwater drones
- Divers/swimmers
- Suspicious objects

---

## ⚡ Edge Device Support

- Optimized models for AUV/ROV deployment
- Low-latency processing (<100ms)
- Robust performance across varying conditions

---

**For more details, see the API docs or explore the dashboard after setup!**