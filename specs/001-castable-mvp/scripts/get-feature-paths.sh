#!/bin/bash

# Get Feature Paths Script
# This script lists all available features and their paths

set -e

echo "📁 Available Features:"
echo "====================="

# Check if specs directory exists
if [ ! -d "specs" ]; then
    echo "❌ No specs directory found. Run from project root."
    exit 1
fi

# List all feature directories
for feature_dir in specs/*/; do
    if [ -d "$feature_dir" ]; then
        feature_name=$(basename "$feature_dir")
        feature_number=$(echo "$feature_name" | cut -d'-' -f1)
        feature_slug=$(echo "$feature_name" | cut -d'-' -f2-)
        
        echo ""
        echo "🔹 Feature $feature_number: $feature_slug"
        echo "   📁 Path: $feature_dir"
        
        # Check if key files exist
        if [ -f "$feature_dir/spec.md" ]; then
            echo "   ✅ spec.md"
        else
            echo "   ❌ spec.md (missing)"
        fi
        
        if [ -f "$feature_dir/plan.md" ]; then
            echo "   ✅ plan.md"
        else
            echo "   ❌ plan.md (missing)"
        fi
        
        if [ -f "$feature_dir/tasks.md" ]; then
            echo "   ✅ tasks.md"
        else
            echo "   ❌ tasks.md (missing)"
        fi
        
        # Check for scripts
        if [ -d "$feature_dir/scripts" ]; then
            script_count=$(find "$feature_dir/scripts" -name "*.sh" | wc -l)
            echo "   📜 Scripts: $script_count files"
        fi
        
        # Check for contracts
        if [ -d "$feature_dir/contracts" ]; then
            contract_count=$(find "$feature_dir/contracts" -type f | wc -l)
            echo "   📋 Contracts: $contract_count files"
        fi
    fi
done

echo ""
echo "📊 Summary:"
echo "==========="

# Count total features
total_features=$(find specs -maxdepth 1 -type d | wc -l)
total_features=$((total_features - 1))  # Subtract the specs directory itself

echo "Total features: $total_features"

# Count completed features (have all required files)
completed_features=0
for feature_dir in specs/*/; do
    if [ -f "$feature_dir/spec.md" ] && [ -f "$feature_dir/plan.md" ] && [ -f "$feature_dir/tasks.md" ]; then
        completed_features=$((completed_features + 1))
    fi
done

echo "Completed features: $completed_features"
echo "Incomplete features: $((total_features - completed_features))"

echo ""
echo "🎯 Usage:"
echo "========="
echo "To work on a feature:"
echo "  cd specs/<feature-directory>"
echo "  ./scripts/setup-plan.sh"
echo ""
echo "To create a new feature:"
echo "  ./specs/001-castable-mvp/scripts/create-new-feature.sh <name> <number>"
