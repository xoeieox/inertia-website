# scripts/website-management.sh
# Updated for vault access bridge integration

#!/bin/bash

# Set project paths
VAULT_PATH="/Users/erhei/Library/CloudStorage/ProtonDrive-xerah@pm.me-folder/inertia-vault"
WEBSITE_PATH="/Users/erhei/Library/CloudStorage/ProtonDrive-xerah@pm.me-folder/inertia-website"

# Website management functions for Claude Code

website_auto_publish() {
    echo "📤 Auto-publishing new vault content..."
    cd "$WEBSITE_PATH"
    npm run auto-publish
    echo "✅ Auto-publish complete"
}

website_vault_search() {
    echo "🔍 Searching vault for: $1"
    cd "$WEBSITE_PATH"
    node scripts/vault-access-bridge.js search "$1"
}

website_vault_structure() {
    echo "📁 Getting vault structure..."
    cd "$WEBSITE_PATH"
    node scripts/vault-access-bridge.js structure
}

website_create_product_page() {
    local product=$1
    local vault_ref=$2
    echo "🚀 Creating $product page using vault reference: $vault_ref"
    cd "$WEBSITE_PATH"
    
    # This would be used by Claude Code to create pages
    echo "Claude Code would use vault reference: $vault_ref"
    echo "To create product page at: src/app/products/${product,,}/page.tsx"
}

website_create_blog_from_vault() {
    local vault_file=$1
    echo "📝 Creating blog post from vault file: $vault_file"
    cd "$WEBSITE_PATH"
    
    # Check if file exists in auto-publish blog folder
    if [ -f "$VAULT_PATH/Daily-Operations/Blog-Posts/$vault_file" ]; then
        npm run auto-publish
        echo "✅ Blog post auto-published"
    else
        echo "❌ File not found in auto-publish blog folder"
        echo "💡 Place file in: Daily-Operations/Blog-Posts/ with publish: true"
    fi
}

website_build() {
    echo "🏗️  Building website..."
    cd "$WEBSITE_PATH"
    npm run build
    echo "✅ Build complete"
}

website_deploy() {
    echo "🚀 Deploying to Hostinger..."
    cd "$WEBSITE_PATH"
    
    # Auto-publish any new content first
    npm run auto-publish
    
    # Build the site
    npm run build
    
    # Deploy via git
    git add .
    git commit -m "Auto-deploy: $(date)"
    git push origin main
    
    echo "✅ Deployment complete"
}

website_dev() {
    echo "🧪 Starting development server..."
    cd "$WEBSITE_PATH"
    npm run dev
}

website_claude_code_demo() {
    echo "🤖 Claude Code Demo Commands:"
    echo ""
    echo "# Access vault content for page creation:"
    echo "website_vault_search 'ESP32'"
    echo "website_vault_structure"
    echo ""
    echo "# Create content using vault references:"
    echo "website_create_product_page 'insight' 'Products/Insight/Framework.md'"
    echo ""
    echo "# Auto-publish prepared content:"
    echo "website_auto_publish"
    echo ""
    echo "# Deploy everything:"
    echo "website_deploy"
}

# Workflow commands
website_content_workflow() {
    echo "📋 Inertia Content Workflow:"
    echo ""
    echo "1. WORK IN VAULT: Create/update content as normal"
    echo "2. PREPARE FOR WEB: Move to auto-publish folders if desired"
    echo "3. CLAUDE CODE ASSIST: Use vault content to generate web pages"
    echo "4. AUTO-PUBLISH: Run auto-publish for blog posts and updates"
    echo "5. DEPLOY: Push to GitHub for automatic hosting"
    echo ""
    echo "Auto-publish folders:"
    echo "  📝 Daily-Operations/Blog-Posts/"
    echo "  📊 Products/*/Status-Updates/Published/"
    echo "  📚 Technology/Public-Guides/"
}

website_help() {
    echo "Inertia Website Management Commands:"
    echo ""
    echo "VAULT INTEGRATION:"
    echo "  website_auto_publish        - Auto-publish prepared vault content"
    echo "  website_vault_search QUERY  - Search vault content"
    echo "  website_vault_structure     - Show vault organization"
    echo ""
    echo "CONTENT CREATION:"
    echo "  website_create_product_page PRODUCT VAULT_REF"
    echo "  website_create_blog_from_vault FILE"
    echo ""
    echo "DEVELOPMENT:"
    echo "  website_dev                 - Start development server"
    echo "  website_build               - Build static website"
    echo "  website_deploy              - Auto-publish + build + deploy"
    echo ""
    echo "HELP:"
    echo "  website_content_workflow    - Show content creation workflow"
    echo "  website_claude_code_demo    - Show Claude Code integration examples"
    echo "  website_help                - Show this help"
}

# Make functions available
case "$1" in
    "auto-publish") website_auto_publish ;;
    "search") website_vault_search "$2" ;;
    "structure") website_vault_structure ;;
    "create-product") website_create_product_page "$2" "$3" ;;
    "create-blog") website_create_blog_from_vault "$2" ;;
    "build") website_build ;;
    "deploy") website_deploy ;;
    "dev") website_dev ;;
    "workflow") website_content_workflow ;;
    "demo") website_claude_code_demo ;;
    "help"|*) website_help ;;
esac   