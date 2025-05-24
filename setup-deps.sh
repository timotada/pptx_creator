#!/usr/bin/env bash
set -e

# 1) Install Node modules
if [ -f package.json ]; then
  echo "Installing JavaScript dependencies…"
  npm ci
fi

# 2) Install Python dependencies
if [ -f requirements.txt ]; then
  echo "Installing Python dependencies…"
  pip install --no-cache-dir -r requirements.txt
fi

echo "✅ Dependencies installed."
