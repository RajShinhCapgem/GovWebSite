@echo off
echo Starting VetVisits services...
echo.

echo 1. Starting VetVisits API service...
start "VetVisits API" cmd /k "cd /d c:\Code\GovWebSite\vetvisits-api && npm start"

echo    Waiting for API to initialize...
timeout /t 3 /nobreak >nul

echo 2. Starting VetVisits main application...
start "VetVisits App" cmd /k "cd /d c:\Code\GovWebSite\vetvisits && npm start"

echo    Waiting for main application to initialize...
timeout /t 3 /nobreak >nul

echo.
echo VetVisits services started!
echo.
echo Available URLs:
echo   Main Application:    http://localhost:3000
echo   API Health Check:    http://localhost:3001/health
echo   API Documentation:   http://localhost:3001/api-docs
echo.
echo Two command windows have opened - one for each service.
echo Close those windows to stop the services.
echo.
pause
