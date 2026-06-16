#!/usr/bin/env bash
set -e

echo "PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQogIGluZnJhLWxhYgogIEdpdEh1YjogaHR0cHM6Ly9naXRodWIuY29tL1JhaW5pbHlsL2luZnJhLWxhYgogIEF1dGhvcjogUmFpbmlseWwKPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQ==" | base64 -d
echo

if ! command -v node &>/dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo
    echo "Install Node.js first:"
    echo "  Ubuntu/Debian: curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt install -y nodejs"
    echo "  Or:            sudo snap install node --classic"
    echo "  macOS:         brew install node"
    echo
    exit 1
fi

echo "[OK] Node.js $(node -v) detected"

cd "$(dirname "$0")"

OLD_PID=$(lsof -ti:3000 2>/dev/null || true)
if [ -n "$OLD_PID" ]; then
    echo "[INFO] Killing leftover process on port 3000 (PID $OLD_PID)..."
    kill $OLD_PID 2>/dev/null || true
    sleep 1
fi

echo
echo "Detecting network..."
NPM_REGISTRY=""
if curl -s --connect-timeout 3 --max-time 5 https://registry.npmjs.org/-/ping >/dev/null 2>&1; then
    echo "[OK] Network is fine, using default npm registry"
else
    echo "[INFO] npmjs.org is slow, switching to China mirror..."
    NPM_REGISTRY="--registry=https://registry.npmmirror.com"
fi

[ -d "node_modules" ]        || { echo "[1/3] Installing root dependencies...";   npm install --silent $NPM_REGISTRY; }
[ -d "server/node_modules" ] || { echo "[2/3] Installing server dependencies..."; cd server && npm install --silent $NPM_REGISTRY && cd ..; }
[ -d "client/node_modules" ] || { echo "[3/3] Installing client dependencies..."; cd client && npm install --silent $NPM_REGISTRY && cd ..; }

if [ ! -f "client/dist/index.html" ]; then
    echo
    echo "Building frontend..."
    cd client && npm run build --silent && cd ..

    if [ ! -f "client/dist/index.html" ]; then
        echo "[ERROR] Frontend build failed!"
        exit 1
    fi
fi

echo
echo "========================================"
echo "  infra-lab is running!"
echo "  Browser will open automatically."
echo "  Press Ctrl+C to stop the server."
echo "========================================"
echo

if command -v xdg-open &>/dev/null; then
    xdg-open http://localhost:3000 &>/dev/null &
elif command -v open &>/dev/null; then
    open http://localhost:3000 &
fi

NODE_ENV=production exec node server/app.js
