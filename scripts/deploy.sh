#!/bin/bash

# Deploy script for Inertia website
# This script builds the Next.js site and copies the output to the repository root for GitHub deployment

set -e  # Exit on any error

echo "🏗️  Building Next.js site..."
npm run build

echo "🧹 Cleaning repository root (keeping essential files)..."
# Remove old deployment files but keep source files and git
find . -maxdepth 1 \( -name "*.html" -o -name "*.js" -o -name "*.css" -o -name "*.ico" -o -name "*.svg" -o -name "*.txt" \) -delete 2>/dev/null || true
rm -rf _next 2>/dev/null || true

echo "📦 Copying built files to repository root..."
# Copy all contents from out/ to root
cp -r out/* ./

echo "📝 Adding files to git..."
git add .

echo "✅ Deployment files ready! Run 'git commit' and 'git push' to deploy."
echo ""
echo "Files in repository root:"
ls -la *.html *.ico *.svg *.txt _next/ 2>/dev/null || echo "Built files copied successfully"