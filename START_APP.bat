@echo off
echo ========================================
echo   🏋️ NutriFit App Startup Script
echo ========================================
echo.

REM Check if backend .env exists
if not exist "backend\.env" (
    echo Creating backend .env file...
    copy "backend\.env.example" "backend\.env"
    echo ✅ Backend .env created
    echo.
    echo ⚠️ IMPORTANT: Please update backend\.env with your MongoDB connection string
    echo.
)

REM Check if node_modules exists in root
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    call npm install
    echo ✅ Frontend dependencies installed
    echo.
)

REM Check if node_modules exists in backend
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo ✅ Backend dependencies installed
    echo.
)

echo 🚀 Starting NutriFit Application...
echo.
echo Frontend will run on: http://localhost:5173
echo Backend will run on: http://localhost:5000
echo.
echo 📝 Note: Keep this window open to keep the app running
echo 📝 Press Ctrl+C to stop the application
echo.
echo ========================================
echo.

REM Start backend in a new terminal
start "NutriFit Backend" cmd /k "cd backend && npm start"

REM Wait a moment for backend to initialize
timeout /t 3 /nobreak > nul

REM Start frontend
echo Starting frontend...
npm run dev

pause
