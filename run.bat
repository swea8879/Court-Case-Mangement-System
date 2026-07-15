@echo off
title JusticeFlow AI - Startup Manager
echo ===================================================
echo   JusticeFlow AI Court Case Management System      
echo   Full-Stack Startup Runner for Windows            
echo ===================================================
echo.

:: 1. Check Server Dependencies
if not exist "server\node_modules\" (
    echo [System] Installing backend server dependencies...
    cd server
    call npm install
    cd ..
    echo [System] Backend installation complete.
) else (
    echo [System] Backend dependencies verified.
)

:: 2. Check Client Dependencies
if not exist "client\node_modules\" (
    echo [System] Installing frontend client dependencies...
    cd client
    call npm install --legacy-peer-deps
    cd ..
    echo [System] Frontend installation complete.
) else (
    echo [System] Frontend dependencies verified.
)

echo.
echo [System] Booting Backend Server in a new window...
start cmd /k "title LexisAI-Backend && cd server && npm start"

echo [System] Booting Frontend React Client in a new window...
start cmd /k "title LexisAI-Frontend && cd client && npm run dev"

echo.
echo ===================================================
echo  Both server and client are starting up!            
echo  Backend: http://localhost:5000                    
echo  Frontend: http://localhost:5173 or 5174           
echo ===================================================
echo.
pause
