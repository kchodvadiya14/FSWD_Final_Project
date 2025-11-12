@echo off
echo ========================================
echo   🔧 NutriFit - System Check
echo ========================================
echo.

REM Check Node.js
echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is NOT installed
    echo    Please install Node.js from https://nodejs.org/
    echo.
) else (
    echo ✅ Node.js is installed
    node --version
    echo.
)

REM Check npm
echo Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is NOT installed
    echo.
) else (
    echo ✅ npm is installed
    npm --version
    echo.
)

REM Check frontend dependencies
echo Checking frontend dependencies...
if exist "node_modules" (
    echo ✅ Frontend dependencies installed
) else (
    echo ⚠️ Frontend dependencies NOT installed
    echo    Run: npm install
)
echo.

REM Check backend dependencies
echo Checking backend dependencies...
if exist "backend\node_modules" (
    echo ✅ Backend dependencies installed
) else (
    echo ⚠️ Backend dependencies NOT installed
    echo    Run: cd backend && npm install
)
echo.

REM Check backend .env
echo Checking backend configuration...
if exist "backend\.env" (
    echo ✅ Backend .env file exists
) else (
    echo ⚠️ Backend .env file NOT found
    echo    Copy backend\.env.example to backend\.env
    echo    Or run START_APP.bat to create it automatically
)
echo.

REM Check MongoDB
echo Checking MongoDB connection...
echo (This requires MongoDB to be running)
echo ℹ️ You can use MongoDB locally or MongoDB Atlas (cloud)
echo.

echo ========================================
echo   Summary
echo ========================================
echo.
echo To start the application:
echo 1. Make sure all ✅ checks above are green
echo 2. Start MongoDB (if using local MongoDB)
echo 3. Run START_APP.bat
echo.
echo Or manually:
echo   Terminal 1: cd backend ^&^& npm start
echo   Terminal 2: npm run dev
echo.
echo ========================================

pause
