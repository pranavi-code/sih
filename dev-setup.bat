@echo off
REM Development Mode Test Script
REM This runs the system without Docker for testing

echo 🔧 Development Mode - Manual Testing
echo =====================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed
    pause
    exit /b 1
)

REM Check Node.js/npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js/npm is not installed
    pause
    exit /b 1
)

echo [INFO] Prerequisites check passed!
echo.

echo [INFO] Setting up backend...
cd backend

REM Create virtual environment
if not exist "venv" (
    echo [INFO] Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment and install dependencies
echo [INFO] Installing backend dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt

echo.
echo [INFO] Backend setup complete!
echo.

REM Go back to root and setup frontend
cd ..
echo [INFO] Setting up frontend...
cd frontend

if not exist "node_modules" (
    echo [INFO] Installing frontend dependencies...
    npm install
) else (
    echo [INFO] Frontend dependencies already installed
)

echo.
echo [INFO] Frontend setup complete!
echo.

cd ..

echo ✅ Development environment ready!
echo.
echo 📝 To start the system manually:
echo.
echo 1. Backend (in one terminal):
echo    cd backend
echo    venv\Scripts\activate
echo    python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
echo.
echo 2. Frontend (in another terminal):
echo    cd frontend  
echo    npm start
echo.
echo 3. Access:
echo    - Frontend: http://localhost:3000
echo    - Backend API: http://localhost:8000
echo    - API Docs: http://localhost:8000/docs
echo.
pause