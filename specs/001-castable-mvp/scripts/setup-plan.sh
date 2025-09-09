#!/bin/bash

# Setup Plan Script for Castable MVP
# This script sets up the development environment and validates the implementation plan

set -e

echo "🚀 Setting up Castable MVP development plan..."

# Check if we're in the right directory
if [ ! -f "specs/001-castable-mvp/spec.md" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Validate required tools
echo "🔍 Validating required tools..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check if we're in the castable-app directory
if [ ! -f "castable-app/package.json" ]; then
    echo "❌ Error: castable-app directory not found. Please run from project root."
    exit 1
fi

echo "✅ All required tools are available"

# Navigate to castable-app directory
cd castable-app

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Check environment variables
echo "🔧 Checking environment configuration..."

if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local file not found. You'll need to configure:"
    echo "   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
    echo "   - CLERK_SECRET_KEY"
    echo "   - DATABASE_URL"
    echo "   - AWS_ACCESS_KEY_ID"
    echo "   - AWS_SECRET_ACCESS_KEY"
    echo "   - AWS_S3_BUCKET_NAME"
    echo "   - STRIPE_SECRET_KEY"
    echo "   - STRIPE_WEBHOOK_SECRET"
else
    echo "✅ Environment file found"
fi

# Check database connection
echo "🗄️  Checking database connection..."
if npm run db:check 2>/dev/null; then
    echo "✅ Database connection successful"
else
    echo "⚠️  Warning: Database connection failed. Please check your DATABASE_URL"
fi

# Check S3 connection
echo "☁️  Checking S3 connection..."
if npm run s3:check 2>/dev/null; then
    echo "✅ S3 connection successful"
else
    echo "⚠️  Warning: S3 connection failed. Please check your AWS credentials"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Configure your environment variables in .env.local"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Begin implementing Phase 2 tasks from the task list"
echo ""
echo "📋 Current phase: Phase 1 - Core Infrastructure"
echo "📊 Progress: 4/5 tasks completed"
echo ""
echo "✅ Setup complete!"
