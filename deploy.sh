#!/bin/bash
# Deploy script for Google Apps Script

echo "🚀 Deploying Code.gs to Google Apps Script..."

# Check if clasp is installed
if ! command -v clasp &> /dev/null; then
    echo "📦 Installing clasp..."
    npm install -g @google/clasp
fi

# Check if .clasprc.json exists
if [ ! -f ~/.clasprc.json ]; then
    echo "❌ Error: ~/.clasprc.json not found"
    echo "Please run 'clasp login' first to authenticate"
    exit 1
fi

# Push and deploy
echo "📤 Pushing code to Apps Script..."
clasp push

echo "🚀 Deploying to web app..."
clasp deploy

echo "✅ Deployment complete!"
echo "Your Apps Script has been updated and deployed."
