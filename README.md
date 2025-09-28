# AI-Based Underwater Image Enhancement System

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.11+-green.svg)](https://python.org)
[![React](https://img.shields.io/badge/react-18.0+-blue.svg)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/fastapi-0.104+-teal.svg)](https://fastapi.tiangolo.com)

## 🌊 Project Overview

This is a comprehensive AI-powered system for underwater image enhancement and maritime threat detection, developed for the Smart India Hackathon (SIH). The system combines advanced computer vision techniques with modern web technologies to provide real-time underwater image analysis for enhanced maritime security.

### 🎯 Key Features

- **🌊 Unified Processing Pipeline**: Combined image enhancement and threat detection in one seamless workflow
- **🔧 Model Management System**: Download and deploy AI models for different edge device configurations
- **🤖 GAN-Based Image Enhancement**: Advanced underwater image restoration using Generative Adversarial Networks
- **🛡️ Real-Time Threat Detection**: YOLO v11-based detection of submarines, mines, divers, and suspicious objects
- **📊 Interactive Dashboard**: Modern React-based interface with real-time monitoring and analytics
- **⚡ Edge Device Optimization**: Specialized models for AUV/ROV deployment with hardware acceleration
- **📱 Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **🐳 Container Ready**: Docker-based deployment for easy scaling and management

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

## 🚀 Quick Start

### Option 1: Demo Script (Recommended)
```bash
# Windows
START_DEMO.bat

# Linux/Mac
chmod +x setup.sh && ./setup.sh
```

### Option 2: Manual Setup
```bash
# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Install Node.js dependencies
cd frontend && npm install

# 3. Start backend server
cd ../backend && python main.py

# 4. Start frontend (new terminal)
cd frontend && npm start

# 5. Access the system
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/docs
```

### 🌟 New Features
- **Unified Processing**: `/processing` - Combined enhancement + detection
- **Model Management**: `/models` - Download AI models for edge devices
- **Real-time Dashboard**: Live monitoring with threat alerts
- **Edge Deployment**: Optimized models for AUV/ROV systems

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