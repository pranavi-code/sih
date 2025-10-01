@echo off
echo ========================================
echo   AI Underwater Image Enhancement Demo
echo   SIH 2025 - Maritime Security System
echo ========================================
echo.

echo Starting backend server...
cd backend
start "Backend Server" cmd /k "python main.py"
timeout /t 3

echo.
echo Starting frontend development server...
cd ../frontend
start "Frontend Server" cmd /k "npm start"

echo.
echo ========================================
echo   System Starting...
echo   Backend: http://localhost:8000
echo   Frontend: http://localhost:3000
echo   API Docs: http://localhost:8000/docs
echo ========================================
echo.
echo Press any key to close this window...
pause > nul