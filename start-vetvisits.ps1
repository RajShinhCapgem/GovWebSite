# VetVisits Startup Script
# This script starts the API service first, then the main application

Write-Host "Starting VetVisits services..." -ForegroundColor Green

# Start the API service in background
Write-Host "1. Starting VetVisits API service..." -ForegroundColor Yellow
$apiProcess = Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd 'c:\Code\GovWebSite\vetvisits-api'; npm start" -PassThru -WindowStyle Normal

# Wait a few seconds for API to initialize
Write-Host "   Waiting for API to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# Test if API is responding
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✓ API service is running on port 3001" -ForegroundColor Green
        Write-Host "   ✓ API Documentation: http://localhost:3001/api-docs" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   ⚠ API may still be starting up..." -ForegroundColor Orange
}

# Start the main application in background
Write-Host "2. Starting VetVisits main application..." -ForegroundColor Yellow
$appProcess = Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd 'c:\Code\GovWebSite\vetvisits'; npm start" -PassThru -WindowStyle Normal

# Wait a moment for main app to initialize
Write-Host "   Waiting for main application to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# Test if main app is responding
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✓ Main application is running on port 3000" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠ Main application may still be starting up..." -ForegroundColor Orange
}

Write-Host ""
Write-Host "🎉 VetVisits services started!" -ForegroundColor Green
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
Write-Host "To stop services, close the PowerShell windows or use:" -ForegroundColor Yellow
Write-Host "  Stop-Process -Id $($apiProcess.Id)" -ForegroundColor Gray
Write-Host "  Stop-Process -Id $($appProcess.Id)" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C to exit this script (services will continue running)" -ForegroundColor Yellow

# Keep script running to show status
try {
    while ($true) {
        Start-Sleep -Seconds 30
        
        # Check if processes are still running
        $apiRunning = Get-Process -Id $apiProcess.Id -ErrorAction SilentlyContinue
        $appRunning = Get-Process -Id $appProcess.Id -ErrorAction SilentlyContinue
        
        $timestamp = Get-Date -Format "HH:mm:ss"
        if ($apiRunning -and $appRunning) {
            Write-Host "[$timestamp] ✓ Both services running" -ForegroundColor Green
        } elseif ($apiRunning) {
            Write-Host "[$timestamp] ⚠ Only API service running" -ForegroundColor Orange
        } elseif ($appRunning) {
            Write-Host "[$timestamp] ⚠ Only main application running" -ForegroundColor Orange
        } else {
            Write-Host "[$timestamp] ✗ Both services stopped" -ForegroundColor Red
            break
        }
    }
} catch {
    Write-Host "Script interrupted by user" -ForegroundColor Yellow
}
