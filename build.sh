#!/bin/bash
# Nixpacks build script for Railway
# 1. Build React dashboard frontend
# 2. FastAPI backend will serve it as static files from /dist

echo "=== Building Athena Dashboard frontend ==="
cd dashboard
npm install
npm run build
cd ..

echo "=== Installing Python dependencies ==="
pip install -r requirements.txt

echo "=== Build complete ==="
