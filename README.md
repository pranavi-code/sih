# AI-Based Underwater Image Enhancement System

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.11+-green.svg)](https://python.org)
[![React](https://img.shields.io/badge/react-18.0+-blue.svg)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/fastapi-0.104+-teal.svg)](https://fastapi.tiangolo.com)

## 🌊 Project Overview

This is a comprehensive AI-powered system for underwater image enhancement and maritime threat detection, developed for the Smart India Hackathon (SIH). The system combines advanced computer vision techniques with modern web technologies to provide real-time underwater image analysis for enhanced maritime security.

### 🎯 Key Features

- **GAN-Based Image Enhancement**: Advanced underwater image restoration using Generative Adversarial Networks
- **Real-Time Threat Detection**: YOLO-based detection of submarines, mines, and other maritime threats
- **Web Dashboard**: Intuitive React-based interface for system monitoring and control
- **Edge Device Support**: Optimized models for deployment on AUVs and ROVs
- **Scalable Architecture**: Microservices-based design with Docker containerization
- **Analytics & Monitoring**: Comprehensive system performance tracking

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   (MongoDB)     │
│   Port: 80      │    │   Port: 8000    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │     Redis       │
                    │   (Caching)     │
                    │   Port: 6379    │
                    └─────────────────┘
```

## Project Structure
```
prototype/
├── backend/                 # FastAPI backend
├── frontend/               # React.js dashboard
├── models/                 # AI models and training scripts
├── edge/                   # Edge device deployment
├── data/                   # Sample datasets
├── docs/                   # Documentation
└── deployment/             # Docker and deployment configs
```

## Quick Start
1. Install dependencies: `pip install -r requirements.txt`
2. Start backend: `cd backend && python main.py`
3. Start frontend: `cd frontend && npm start`
4. Access dashboard: `http://localhost:3000`

## Technology Stack
- **AI/ML**: TensorFlow, PyTorch, OpenCV, YOLO v11
- **Backend**: FastAPI, Uvicorn, Motor (MongoDB driver)
- **Frontend**: React.js, Material-UI, Axios
- **Database**: MongoDB
- **Edge**: TensorRT, CUDA, Quantization
- **Deployment**: Docker, Docker Compose

## Quality Metrics
- **PSNR** (Peak Signal-to-Noise Ratio)
- **SSIM** (Structural Similarity Index)
- **UIQM** (Underwater Image Quality Measure)

## Maritime Threats Detected
- Submarines
- Naval mines
- Underwater drones
- Divers/swimmers
- Suspicious objects

## Edge Device Support
- Optimized models for AUV/ROV deployment
- Low-latency processing (<100ms)
- Robust performance across varying conditions
- Hardware acceleration support