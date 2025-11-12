@echo off
color 0A
title NutriFit - Fitness Tracker App

:MENU
cls
echo.
echo  ========================================
echo    🏋️  NUTRIFIT FITNESS TRACKER 
echo  ========================================
echo.
echo  1. 🚀 START APP (Automatic Setup)
echo  2. 🔧 Check System
echo  3. 📦 Install Dependencies Only
echo  4. 🗑️  Clean Install (Fresh Start)
echo  5. ❌ Exit
echo.
echo  ========================================
echo.
set /p choice="  Enter your choice (1-5): "

if "%choice%"=="1" goto START_APP
if "%choice%"=="2" goto CHECK_SYSTEM
if "%choice%"=="3" goto INSTALL_DEPS
if "%choice%"=="4" goto CLEAN_INSTALL
if "%choice%"=="5" goto EXIT
goto MENU

:START_APP
cls
echo.
echo  ========================================
echo    🚀 Starting NutriFit Application
echo  ========================================
echo.

REM Check and create backend .env if needed
if not exist "backend\.env" (
    echo  📝 Creating backend configuration...
    (
        echo PORT=5000
        echo NODE_ENV=development
        echo CLIENT_URL=http://localhost:5173
        echo MONGODB_URI=mongodb://localhost:27017/nutrifit
        echo JWT_SECRET=nutrifit_secret_key_2024_change_in_production
        echo JWT_EXPIRE=7d
        echo BCRYPT_SALT_ROUNDS=12
    ) > backend\.env
    echo  ✅ Backend .env created
    echo.
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo  📦 Installing frontend dependencies...
    call npm install --silent
    echo  ✅ Frontend dependencies installed
    echo.
)

if not exist "backend\node_modules" (
    echo  📦 Installing backend dependencies...
    cd backend
    call npm install --silent
    cd ..
    echo  ✅ Backend dependencies installed
    echo.
)

echo  ========================================
echo    ✅ Setup Complete!
echo  ========================================
echo.
echo  📱 Frontend: http://localhost:5173
echo  🔌 Backend:  http://localhost:5000
echo.
echo  💡 TIP: Keep this window open while using the app
echo  💡 Press Ctrl+C in both windows to stop
echo.
echo  ========================================
echo.
echo  🚀 Launching servers...
echo.

REM Start backend in new window
start "🔌 NutriFit Backend Server" cmd /k "cd /d %~dp0backend && npm start"

REM Give backend time to start
timeout /t 3 /nobreak > nul

REM Start frontend
echo  Starting frontend development server...
echo.
npm run dev

goto END

:CHECK_SYSTEM
cls
echo.
echo  ========================================
echo    🔧 System Check
echo  ========================================
echo.

echo  Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  ❌ Node.js NOT installed
    echo     Download from: https://nodejs.org/
) else (
    echo  ✅ Node.js installed
    node --version
)
echo.

echo  Checking npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  ❌ npm NOT installed
) else (
    echo  ✅ npm installed
    npm --version
)
echo.

echo  Checking frontend dependencies...
if exist "node_modules" (
    echo  ✅ Frontend dependencies installed
) else (
    echo  ⚠️  Frontend dependencies NOT installed
)
echo.

echo  Checking backend dependencies...
if exist "backend\node_modules" (
    echo  ✅ Backend dependencies installed
) else (
    echo  ⚠️  Backend dependencies NOT installed
)
echo.

echo  Checking backend config...
if exist "backend\.env" (
    echo  ✅ Backend .env file exists
) else (
    echo  ⚠️  Backend .env file missing
)
echo.

echo  ========================================
echo.
pause
goto MENU

:INSTALL_DEPS
cls
echo.
echo  ========================================
echo    📦 Installing Dependencies
echo  ========================================
echo.

echo  Installing frontend dependencies...
call npm install
echo  ✅ Frontend dependencies installed
echo.

echo  Installing backend dependencies...
cd backend
call npm install
cd ..
echo  ✅ Backend dependencies installed
echo.

echo  ========================================
echo    ✅ Installation Complete!
echo  ========================================
echo.
pause
goto MENU

:CLEAN_INSTALL
cls
echo.
echo  ========================================
echo    🗑️  Clean Install
echo  ========================================
echo.
echo  ⚠️  This will delete:
echo     - node_modules folders
echo     - package-lock.json files
echo.
set /p confirm="  Continue? (Y/N): "
if /i not "%confirm%"=="Y" goto MENU

echo.
echo  Cleaning frontend...
if exist "node_modules" rd /s /q node_modules
if exist "package-lock.json" del /q package-lock.json
echo  ✅ Frontend cleaned

echo.
echo  Cleaning backend...
if exist "backend\node_modules" rd /s /q backend\node_modules
if exist "backend\package-lock.json" del /q backend\package-lock.json
echo  ✅ Backend cleaned

echo.
echo  Installing fresh dependencies...
call npm install
cd backend
call npm install
cd ..

echo.
echo  ========================================
echo    ✅ Clean Install Complete!
echo  ========================================
echo.
pause
goto MENU

:EXIT
cls
echo.
echo  Thanks for using NutriFit! 💪
echo  Stay healthy and keep training! 🏋️
echo.
timeout /t 2 /nobreak > nul
exit

:END
pause
