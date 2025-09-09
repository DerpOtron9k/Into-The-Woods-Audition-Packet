#!/bin/bash

# Create New Feature Script
# This script creates a new feature specification following Spec Kit conventions

set -e

FEATURE_NAME=$1
FEATURE_NUMBER=$2

if [ -z "$FEATURE_NAME" ] || [ -z "$FEATURE_NUMBER" ]; then
    echo "❌ Error: Please provide feature name and number"
    echo "Usage: ./create-new-feature.sh <feature-name> <feature-number>"
    echo "Example: ./create-new-feature.sh 'advanced-analytics' '002'"
    exit 1
fi

# Convert feature name to kebab-case
FEATURE_SLUG=$(echo "$FEATURE_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g')

echo "🚀 Creating new feature: $FEATURE_NAME (specs/$FEATURE_NUMBER-$FEATURE_SLUG)..."

# Create feature directory
FEATURE_DIR="specs/$FEATURE_NUMBER-$FEATURE_SLUG"
mkdir -p "$FEATURE_DIR"/{contracts,memory,scripts}

# Create spec.md from template
cp templates/spec-template.md "$FEATURE_DIR/spec.md"

# Create plan.md from template
cp templates/plan-template.md "$FEATURE_DIR/plan.md"

# Create tasks.md from template
cp templates/tasks-template.md "$FEATURE_DIR/tasks.md"

# Create memory directory files
cat > "$FEATURE_DIR/memory/constitution.md" << EOF
# $FEATURE_NAME Development Constitution

## Core Principles

### 1. User-Centric Development
- Every feature must directly address a user pain point
- User experience takes precedence over technical elegance
- Mobile-first design approach for all public-facing interfaces

### 2. Simplicity Over Complexity
- Prefer simple, maintainable solutions over complex architectures
- Avoid over-engineering - build only what's needed
- Choose battle-tested technologies over cutting-edge alternatives

### 3. Performance & Reliability
- Page load times must be under 3 seconds
- 99.9% uptime target for production
- Graceful error handling with user-friendly messages

## Technical Standards

### Code Quality
- TypeScript for all code
- ESLint and Prettier for code formatting
- Comprehensive test coverage (minimum 80%)
- Code reviews required for all changes

### Database Design
- Use UUIDs for all primary keys
- Implement proper foreign key relationships
- Add indexes for frequently queried fields
- Use database migrations for schema changes

## Success Metrics

### Technical Metrics
- Build time < 5 minutes
- Test coverage > 80%
- Page load time < 3 seconds
- Error rate < 0.1%

### Business Metrics
- User activation rate > 60%
- Time to value < 10 minutes
- Conversion rate > 5%
- User satisfaction score > 4.5/5
EOF

# Create scripts directory files
cat > "$FEATURE_DIR/scripts/setup-plan.sh" << 'EOF'
#!/bin/bash

# Setup Plan Script for {FEATURE_NAME}
# This script sets up the development environment and validates the implementation plan

set -e

echo "🚀 Setting up {FEATURE_NAME} development plan..."

# Check if we're in the right directory
if [ ! -f "specs/{FEATURE_NUMBER}-{FEATURE_SLUG}/spec.md" ]; then
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

echo ""
echo "🎯 Next steps:"
echo "1. Review the feature specification in specs/{FEATURE_NUMBER}-{FEATURE_SLUG}/spec.md"
echo "2. Update the implementation plan in specs/{FEATURE_NUMBER}-{FEATURE_SLUG}/plan.md"
echo "3. Begin implementing tasks from specs/{FEATURE_NUMBER}-{FEATURE_SLUG}/tasks.md"
echo ""
echo "✅ Setup complete!"
EOF

# Make scripts executable
chmod +x "$FEATURE_DIR/scripts/setup-plan.sh"

# Update template placeholders
sed -i "s/{FEATURE_NAME}/$FEATURE_NAME/g" "$FEATURE_DIR"/*.md
sed -i "s/{FEATURE_NUMBER}/$FEATURE_NUMBER/g" "$FEATURE_DIR"/*.md
sed -i "s/{FEATURE_SLUG}/$FEATURE_SLUG/g" "$FEATURE_DIR"/*.md

echo "✅ Feature specification created successfully!"
echo ""
echo "📁 Feature directory: $FEATURE_DIR"
echo "📋 Files created:"
echo "   - spec.md (Feature specification)"
echo "   - plan.md (Implementation plan)"
echo "   - tasks.md (Task list)"
echo "   - memory/constitution.md (Development constitution)"
echo "   - scripts/setup-plan.sh (Setup script)"
echo ""
echo "🎯 Next steps:"
echo "1. Edit specs/$FEATURE_NUMBER-$FEATURE_SLUG/spec.md with your feature requirements"
echo "2. Update specs/$FEATURE_NUMBER-$FEATURE_SLUG/plan.md with technical details"
echo "3. Customize specs/$FEATURE_NUMBER-$FEATURE_SLUG/tasks.md with specific tasks"
echo "4. Run ./specs/$FEATURE_NUMBER-$FEATURE_SLUG/scripts/setup-plan.sh to validate setup"
