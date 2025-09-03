@echo off
REM Deploy script for Google Apps Script (Windows)

echo 🚀 Deploying Code.gs to Google Apps Script...

REM Check if clasp is installed
where clasp >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 Installing clasp...
    npm install -g @google/clasp
)

REM Check if .clasprc.json exists
if not exist "%USERPROFILE%\.clasprc.json" (
    echo ❌ Error: .clasprc.json not found
    echo Please run 'clasp login' first to authenticate
    pause
    exit /b 1
)

REM Push and deploy
echo 📤 Pushing code to Apps Script...
clasp push

echo 🚀 Deploying to web app...
clasp deploy

echo ✅ Deployment complete!
echo Your Apps Script has been updated and deployed.
pause
