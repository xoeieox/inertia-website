#!/bin/bash

# Simple Static Site Deployment Script
# This script deploys the static site to the repository root for Hostinger

set -e  # Exit on any error

echo "🚀 Deploying Inertia Static Website..."

# Get the script directory and parent directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "📂 Static site location: $SCRIPT_DIR"
echo "📁 Project root: $PROJECT_ROOT"

# Navigate to project root
cd "$PROJECT_ROOT"

echo "🧹 Removing ALL tracked files from git..."
git rm -r --cached . 2>/dev/null || true

echo "📦 Copying static site files to repository root..."
# Copy static-site contents to root
cp -r static-site/* ./

echo "📝 Adding files to git..."
# Add all the static files
git add index.html css/ js/ assets/ README.md 2>/dev/null || true

echo "💾 Committing deployment..."
COMMIT_MSG="Deploy static website $(date '+%Y-%m-%d %H:%M:%S')

✨ Migrated to simple static HTML + Alpine.js
🎨 Visual editing ready with Pinegrow
🚀 No build step required

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

if git diff --staged --quiet; then
    echo "ℹ️  No changes to deploy"
else
    git commit -m "$COMMIT_MSG"
    echo "✅ Changes committed! Pushing to GitHub..."

    git push origin main

    echo ""
    echo "🎉 Static website deployed successfully!"
    echo ""
    echo "📝 What was deployed:"
    echo "   • Simple HTML + Alpine.js site"
    echo "   • CSS design system (MVP + utilities)"
    echo "   • Scroll-triggered animations"
    echo "   • Pinegrow-editable structure"
    echo ""
    echo "🔧 To make changes:"
    echo "   1. Edit files in static-site/ directory"
    echo "   2. Or use Pinegrow to edit index.html"
    echo "   3. Run ./static-site/deploy.sh to deploy"
    echo ""
    echo "🌐 Your site should be live at your Hostinger domain shortly!"
fi

echo "✨ Deployment complete!"