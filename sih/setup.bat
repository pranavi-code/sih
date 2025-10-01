@echo off
REM Underwater Image Enhancement System - Windows Setup Script
REM This script sets up the complete development environment on Windows

setlocal enabledelayedexpansion

echo 🌊 AI-Based Underwater Image Enhancement System Setup
echo ======================================================
echo.

REM Check if Docker is installed and running
echo [INFO] Checking Docker installation...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    echo Visit: https://docs.docker.com/get-docker/
    pause
    exit /b 1
)

docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running. Please start Docker Desktop.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not installed.
    pause
    exit /b 1
)

echo [INFO] Docker and Docker Compose are ready!
echo.

REM Check if Git is installed
echo [INFO] Checking Git installation...
git --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Git is not installed. Some features may not work.
) else (
    echo [INFO] Git is available!
)
echo.

REM Create necessary directories
echo [INFO] Creating necessary directories...
if not exist "models" mkdir models
if not exist "uploads" mkdir uploads
if not exist "logs" mkdir logs
if not exist "test-images" mkdir test-images
if not exist "backups" mkdir backups
echo [INFO] Directories created successfully!
echo.

REM Create environment file
echo [INFO] Setting up environment configuration...
if not exist ".env" (
    (
        echo # Database Configuration
        echo MONGODB_URL=mongodb://admin:underwater_admin_2024@mongodb:27017/underwater_security?authSource=admin
        echo REDIS_URL=redis://redis:6379
        echo.
        echo # API Configuration
        echo API_HOST=0.0.0.0
        echo API_PORT=8000
        echo LOG_LEVEL=INFO
        echo MAX_FILE_SIZE=52428800
        echo WORKERS=4
        echo.
        echo # Model Configuration
        echo MODEL_PATH=/app/models
        echo UPLOAD_PATH=/app/uploads
        echo ENHANCEMENT_MODEL=underwater_gan_v2.h5
        echo DETECTION_MODEL=yolo_underwater_v11.pt
        echo.
        echo # Frontend Configuration
        echo REACT_APP_API_URL=http://localhost:8000/api
        echo REACT_APP_MAX_FILE_SIZE=52428800
        echo.
        echo # Security
        echo JWT_SECRET_KEY=your-secret-key-change-in-production
        echo JWT_ALGORITHM=HS256
        echo JWT_EXPIRE_MINUTES=1440
        echo.
        echo # Edge Deployment
        echo TENSORRT_ENABLED=false
        echo QUANTIZATION_ENABLED=true
        echo EDGE_BATCH_SIZE=1
    ) > .env
    echo [INFO] Environment file created: .env
) else (
    echo [INFO] Environment file already exists: .env
)
echo.

REM Setup test images directory
echo [INFO] Setting up test images directory...
(
    echo # Test Images for Underwater Enhancement System
    echo.
    echo Place your test images in this directory for testing the system.
    echo.
    echo ## Recommended Test Images:
    echo - **underwater_clear.jpg**: Clear underwater scene for enhancement testing
    echo - **underwater_murky.jpg**: Low visibility image for challenging enhancement
    echo - **submarine_test.jpg**: Image containing submarine for threat detection
    echo - **underwater_debris.jpg**: Scene with debris for object detection
    echo.
    echo ## Image Requirements:
    echo - Format: JPG, PNG, BMP, TIFF
    echo - Max size: 50MB
    echo - Resolution: Any (will be processed accordingly^)
    echo - Color: RGB color images preferred
    echo.
    echo ## Testing Process:
    echo 1. Upload images through the web interface at http://localhost
    echo 2. Check enhancement results in the Image Enhancement page
    echo 3. Verify threat detection in the Threat Detection page
    echo 4. Monitor processing metrics in the Analytics dashboard
) > test-images\README.md
echo [INFO] Test images directory setup complete!
echo.

REM Ask user if they want to start services
set /p start_services="Do you want to start the services now? [Y/n]: "
if /i "%start_services%"=="n" (
    echo [INFO] Setup complete! Run 'docker-compose up -d' when ready to start.
    pause
    exit /b 0
)

REM Pull Docker images
echo [INFO] Pulling required Docker images...
docker-compose pull
if errorlevel 1 (
    echo [ERROR] Failed to pull Docker images.
    pause
    exit /b 1
)
echo [INFO] Docker images pulled successfully!
echo.

REM Build the application
echo [INFO] Building the application...
docker-compose build --no-cache
if errorlevel 1 (
    echo [ERROR] Failed to build the application.
    pause
    exit /b 1
)
echo [INFO] Application built successfully!
echo.

REM Start the services
echo [INFO] Starting all services...
docker-compose up -d
if errorlevel 1 (
    echo [ERROR] Failed to start services.
    pause
    exit /b 1
)
echo [INFO] Services are starting up...
echo.

REM Wait for services to be ready
echo [INFO] Waiting for services to initialize...
timeout /t 30 /nobreak >nul

REM Check backend health
echo [INFO] Checking service health...
for /l %%i in (1,1,10) do (
    curl -f http://localhost:8000/health >nul 2>&1
    if not errorlevel 1 (
        echo [INFO] Backend service is healthy!
        goto :frontend_check
    )
    if %%i==10 (
        echo [ERROR] Backend service failed to start properly
        echo [INFO] Recent service logs:
        docker-compose logs --tail=20
        pause
        exit /b 1
    )
    echo [INFO] Waiting for backend service... (%%i/10^)
    timeout /t 5 /nobreak >nul
)

:frontend_check
curl -f http://localhost >nul 2>&1
if not errorlevel 1 (
    echo [INFO] Frontend service is healthy!
) else (
    echo [WARNING] Frontend service may still be starting up
)

REM Display final information
echo.
echo 🎉 Setup Complete!
echo.
echo Your AI-Based Underwater Image Enhancement System is ready!
echo.
echo 📍 Access Points:
echo   🖥️  Web Dashboard:     http://localhost
echo   📚 API Documentation: http://localhost:8000/docs
echo   🔧 Database Admin:    http://localhost:8081 (admin/admin^)
echo.
echo 🔍 Service Status:
docker-compose ps
echo.
echo 📝 Useful Commands:
echo   View logs:      docker-compose logs -f [service]
echo   Stop services:  docker-compose down
echo   Restart:        docker-compose restart [service]
echo   Update:         docker-compose pull ^&^& docker-compose up -d
echo.
echo 🚀 Ready to enhance underwater images and detect maritime threats!
echo.
echo [WARNING] Note: The system may take a few minutes to fully initialize all AI models.
echo.
pause