@echo off
chcp 65001 >nul 2>&1
title infra-lab

powershell -Command "[Console]::OutputEncoding=[System.Text.Encoding]::UTF8;[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQogIGluZnJhLWxhYgogIEdpdEh1YjogaHR0cHM6Ly9naXRodWIuY29tL1JhaW5pbHlsL2luZnJhLWxhYgogIEF1dGhvcjogUmFpbmlseWwKPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQ=='))"
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please install Node.js first:
    echo   Download: https://nodejs.org
    echo   Or run:   winget install OpenJS.NodeJS.LTS
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo [OK] Node.js %NODE_VER% detected

netstat -ano | findstr ":3000 " | findstr "LISTENING" >"%TEMP%\yaml-pg-port.tmp" 2>nul
if exist "%TEMP%\yaml-pg-port.tmp" (
    for /f "tokens=5" %%a in (%TEMP%\yaml-pg-port.tmp) do (
        if not "%%a"=="" (
            echo [INFO] Killing leftover process on port 3000 ^(PID %%a^)...
            taskkill /PID %%a /F >nul 2>&1
        )
    )
    del "%TEMP%\yaml-pg-port.tmp" >nul 2>&1
)

echo.
echo Detecting network...
set NPM_REGISTRY=
curl -s --connect-timeout 3 --max-time 5 https://registry.npmjs.org/-/ping >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] npmjs.org is slow, switching to China mirror...
    set NPM_REGISTRY=--registry=https://registry.npmmirror.com
) else (
    echo [OK] Network is fine, using default npm registry
)

if not exist "node_modules" (
    echo.
    echo [1/3] Installing root dependencies...
    call npm install --silent %NPM_REGISTRY%
)

if not exist "server\node_modules" (
    echo [2/3] Installing server dependencies...
    cd server
    call npm install --silent %NPM_REGISTRY%
    cd ..
)

if not exist "client\node_modules" (
    echo [3/3] Installing client dependencies...
    cd client
    call npm install --silent %NPM_REGISTRY%
    cd ..
)

if not exist "client\dist\index.html" (
    echo.
    echo Building frontend...
    cd client
    call npm run build --silent
    cd ..

    if not exist "client\dist\index.html" (
        echo [ERROR] Frontend build failed!
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo   infra-lab is running!
echo   Browser will open automatically.
echo   Close this window to stop the server.
echo ========================================
echo.

set NODE_ENV=production
start http://localhost:3000
node server\app.js

pause
