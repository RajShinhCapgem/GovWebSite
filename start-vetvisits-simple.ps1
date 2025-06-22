# VetVisits Simple Startup Script
# This script starts both services and exits

Write-Host "Starting VetVisits services..." -ForegroundColor Green

# Start the API service in background  
Write-Host "1. Starting VetVisits API service..." -ForegroundColor Yellow
$apiProcess = Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd 'c:\Code\GovWebSite\vetvisits-api'; npm start" -PassThru -WindowStyle Normal

# Wait a few seconds for API to initialize
Write-Host "   Waiting for API to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Test if API is responding
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✓ API service is running on port 3001" -ForegroundColor Green
        Write-Host "   ✓ API Documentation: http://localhost:3001/api-docs" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   ⚠ API may need more time to start up..." -ForegroundColor Orange
    Write-Host "   Check http://localhost:3001/health manually" -ForegroundColor Gray
}

# Start the main application in background
Write-Host "2. Starting VetVisits main application..." -ForegroundColor Yellow
$appProcess = Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd 'c:\Code\GovWebSite\vetvisits'; npm start" -PassThru -WindowStyle Normal

# Wait a moment for main app to initialize
Write-Host "   Waiting for main application to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Test if main app is responding
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✓ Main application is running on port 3000" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠ Main application may need more time to start up..." -ForegroundColor Orange
    Write-Host "   Check http://localhost:3000 manually" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🎉 VetVisits services startup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Available URLs:" -ForegroundColor White
Write-Host "  • Main Application:    http://localhost:3000" -ForegroundColor Cyan
Write-Host "  • API Health Check:    http://localhost:3001/health" -ForegroundColor Cyan
Write-Host "  • API Documentation:   http://localhost:3001/api-docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Process IDs:" -ForegroundColor White
Write-Host "  • API Service:         $($apiProcess.Id)" -ForegroundColor Gray
Write-Host "  • Main Application:    $($appProcess.Id)" -ForegroundColor Gray
Write-Host ""
Write-Host "Two PowerShell windows have opened for the services." -ForegroundColor Yellow
Write-Host "Close those windows to stop the services, or use:" -ForegroundColor Yellow
Write-Host "  Stop-Process -Id $($apiProcess.Id)" -ForegroundColor Gray
Write-Host "  Stop-Process -Id $($appProcess.Id)" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit this script (services will continue running)..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
