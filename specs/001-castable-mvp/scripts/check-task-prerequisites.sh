#!/bin/bash

# Check Task Prerequisites Script
# This script validates that all prerequisites are met before starting a task

set -e

TASK_ID=$1

if [ -z "$TASK_ID" ]; then
    echo "❌ Error: Please provide a task ID (e.g., 2.1, 3.4)"
    echo "Usage: ./check-task-prerequisites.sh <task-id>"
    exit 1
fi

echo "🔍 Checking prerequisites for task $TASK_ID..."

# Navigate to castable-app directory
cd castable-app

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Check basic prerequisites
echo "🔧 Checking basic prerequisites..."

# Check Node.js
if ! command_exists node; then
    echo "❌ Node.js is not installed"
    exit 1
fi

# Check npm
if ! command_exists npm; then
    echo "❌ npm is not installed"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "❌ Dependencies not installed. Run 'npm install' first."
    exit 1
fi

# Check environment variables
echo "🔐 Checking environment variables..."

if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found"
    exit 1
fi

# Source environment variables
source .env.local

# Check required environment variables
REQUIRED_VARS=(
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
    "CLERK_SECRET_KEY"
    "DATABASE_URL"
    "AWS_ACCESS_KEY_ID"
    "AWS_SECRET_ACCESS_KEY"
    "AWS_S3_BUCKET_NAME"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Environment variable $var is not set"
        exit 1
    fi
done

echo "✅ All environment variables are set"

# Task-specific prerequisites
case $TASK_ID in
    "1.1"|"1.2"|"1.3"|"1.4"|"1.5")
        echo "📋 Phase 1 tasks - Core Infrastructure"
        echo "✅ Prerequisites met for Phase 1 tasks"
        ;;
    "2.1"|"2.2"|"2.3"|"2.4"|"2.5"|"2.6")
        echo "📋 Phase 2 tasks - Director Dashboard"
        echo "🔍 Checking Phase 1 completion..."
        
        # Check if Phase 1 is complete
        if [ ! -f "src/lib/database.ts" ]; then
            echo "❌ Database setup not complete. Complete Phase 1 first."
            exit 1
        fi
        
        if [ ! -f "src/lib/s3.ts" ]; then
            echo "❌ S3 setup not complete. Complete Phase 1 first."
            exit 1
        fi
        
        echo "✅ Prerequisites met for Phase 2 tasks"
        ;;
    "3.1"|"3.2"|"3.3"|"3.4"|"3.5"|"3.6")
        echo "📋 Phase 3 tasks - Public Audition Pages"
        echo "🔍 Checking Phase 2 completion..."
        
        # Check if Phase 2 is complete
        if [ ! -f "src/app/(dashboard)/dashboard/page.tsx" ]; then
            echo "❌ Dashboard not complete. Complete Phase 2 first."
            exit 1
        fi
        
        echo "✅ Prerequisites met for Phase 3 tasks"
        ;;
    "4.1"|"4.2"|"4.3"|"4.4"|"4.5")
        echo "📋 Phase 4 tasks - Applicant Management"
        echo "🔍 Checking Phase 3 completion..."
        
        # Check if Phase 3 is complete
        if [ ! -f "src/app/shows/[showId]/page.tsx" ]; then
            echo "❌ Public pages not complete. Complete Phase 3 first."
            exit 1
        fi
        
        echo "✅ Prerequisites met for Phase 4 tasks"
        ;;
    "5.1"|"5.2"|"5.3"|"5.4"|"5.5")
        echo "📋 Phase 5 tasks - Billing & Plan Management"
        echo "🔍 Checking Phase 4 completion..."
        
        # Check if Phase 4 is complete
        if [ ! -f "src/components/applicant-grid.tsx" ]; then
            echo "❌ Applicant management not complete. Complete Phase 4 first."
            exit 1
        fi
        
        echo "✅ Prerequisites met for Phase 5 tasks"
        ;;
    *)
        echo "⚠️  Unknown task ID: $TASK_ID"
        echo "✅ Basic prerequisites met"
        ;;
esac

# Check if development server is running
if port_in_use 3000; then
    echo "✅ Development server is running on port 3000"
else
    echo "⚠️  Development server is not running. Start with 'npm run dev'"
fi

echo ""
echo "✅ All prerequisites for task $TASK_ID are met!"
echo "🚀 You can now proceed with the task implementation."
