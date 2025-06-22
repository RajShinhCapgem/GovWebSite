# VetVisits Startup Scripts

This document explains the different ways to start the VetVisits application and API services.

## Quick Start Options

### Option 1: PowerShell Script (Recommended for Windows)
```powershell
.\start-vetvisits.ps1
```
- **Features**: Health checks, status monitoring, process management
- **Best for**: Development and monitoring both services
- **Requirements**: PowerShell (Windows)

### Option 2: Batch File (Simple Windows)
```cmd
start-vetvisits.bat
```
- **Features**: Simple startup in separate command windows
- **Best for**: Quick startup on Windows
- **Requirements**: Windows Command Prompt

### Option 3: NPM Scripts (Cross-platform)
```bash
# Start both services simultaneously
npm run dev

# Or start individually
npm run start:api    # API only
npm run start:app    # Main app only

# Install all dependencies
npm run install:all
```
- **Features**: Cross-platform, uses concurrently for parallel execution
- **Best for**: Development workflow, CI/CD
- **Requirements**: Node.js and npm

### Option 4: Manual Startup
```bash
# Terminal 1: Start API
cd vetvisits-api
npm start

# Terminal 2: Start Main App (wait for API to be ready)
cd vetvisits
npm start
```
- **Features**: Full control over each service
- **Best for**: Debugging individual services
- **Requirements**: Multiple terminal windows

## Service Information

### VetVisits API (Port 3001)
- **Health Check**: http://localhost:3001/health
- **API Documentation**: http://localhost:3001/api-docs
- **Endpoints**: `/api/species`, `/api/products`, `/api/basket`, `/api/registrations`

### VetVisits Main Application (Port 3000)
- **Home Page**: http://localhost:3000
- **Features**: Animal registration, basket management, GOV.UK Design System

## Troubleshooting

### Port Already in Use
If you get "port already in use" errors:
```bash
# Windows: Kill processes on ports
netstat -ano | findstr :3000
netstat -ano | findstr :3001
taskkill /PID <process_id> /F

# Or use PowerShell
Stop-Process -Id <process_id>
```

### Dependencies Missing
```bash
# Install all dependencies
npm run install:all

# Or install individually
cd vetvisits-api && npm install
cd ../vetvisits && npm install
```

### API Connection Issues
1. Ensure API starts first and is healthy
2. Check http://localhost:3001/health
3. Verify no firewall blocking local connections
4. Check console logs for error messages

## Development Tips

- Use the PowerShell script for full monitoring
- Use `npm run dev` for regular development
- Check API docs at `/api-docs` for endpoint testing
- Both services support hot reload during development

## Stopping Services

### PowerShell Script
Press `Ctrl+C` in the script window

### Batch File
Close the individual command windows

### NPM Scripts
Press `Ctrl+C` in the terminal

### Manual
Close each terminal window or press `Ctrl+C` in each
