@echo off
REM Quick setup script for Plant Disease Detection Backend

echo ========================================
echo Plant Disease Detection Backend - Setup
echo ========================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found. Please install Python 3.8+ first.
    pause
    exit /b 1
)

echo [1/3] Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo [2/3] Checking model file...
if not exist "Final_PlantVillage38_model.keras" (
    echo WARNING: Model file not found!
    echo Please download Final_PlantVillage38_model.keras from your Google Drive
    echo and place it in the backend folder.
    echo See MODEL_EXPORT.md for instructions.
    echo.
    pause
)

echo [3/3] Starting backend server...
echo.
echo Backend will start at: http://localhost:8000
echo API Docs at: http://localhost:8000/docs
echo.

python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

pause
