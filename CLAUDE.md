# Claude Code Context - Inertia Website

This file provides context for Claude Code about the Inertia website project setup and deployment workflow.

## 🏗️ Project Overview

**Project**: Inertia Website - Data-Driven Beyblade Performance
**Framework**: Static HTML/CSS/JS (No build step)
**Deployment**: GitHub → Hostinger (static hosting)
**Repository**: Deployment-only structure on GitHub

## 🔄 Current Architecture

### The Evolution
- **Phase 1**: Next.js with TypeScript and Tailwind CSS
- **Phase 2**: Simplified to static website for easier maintenance
- **Current**: Pure HTML/CSS/JS with Alpine.js for interactivity

### Technology Stack
- **HTML**: Standard semantic HTML5
- **CSS**: MVP design system + Tailwind utilities
- **JavaScript**: Alpine.js for lightweight interactivity
- **Visual Editor**: Pinegrow for WYSIWYG editing
- **No build step**: Edit files directly and deploy

### Repository Structure
```
PROJECT ROOT:
├── static-site/          # Source files (edit these!)
│   ├── index.html        # Homepage
│   ├── css/              # Stylesheets
│   │   ├── design-tokens.css  # Colors, fonts, variables
│   │   ├── utilities.css      # Tailwind-like utilities
│   │   ├── mvp.css           # MVP design system
│   │   └── animations.css    # Alpine.js helpers
│   ├── js/               # Future JavaScript
│   ├── assets/           # Images, fonts, etc.
│   └── deploy.sh         # Deployment script
│
GITHUB REPOSITORY (deployed):
├── index.html            # Deployed homepage
├── css/                  # Deployed stylesheets
├── assets/               # Deployed assets
└── *.svg, *.ico         # Static files
```

## 📋 Key Commands & Scripts

### Development
```bash
# No build step needed!
# Edit files in static-site/ directory
# Open static-site/index.html in browser to preview
```

### Deployment
```bash
cd static-site
./deploy.sh              # One-click deployment
```

**What the deployment script does:**
1. `git rm -r --cached .` - Clears all tracked files from git
2. `cp -r static-site/* ./` - Copies static files to repository root
3. `git add *.html css/ assets/ *.ico *.svg` - Adds only built files to git
4. `git commit && git push` - Deploys clean files to GitHub
5. Hostinger automatically syncs from GitHub

## 🎯 Working with This Project

### Making Content Changes
- **Direct editing**: Edit HTML, CSS, or JS files in `static-site/`
- **Visual editing**: Open `static-site/index.html` in Pinegrow
- **Preview**: Open `static-site/index.html` in browser
- **Deploy**: Run `./deploy.sh` from `static-site/` directory

### Design System
- **Colors**: Defined in `css/design-tokens.css` (`--void`, `--cyan`, `--steel`, etc.)
- **Components**: Pre-built in `css/mvp.css` (`.card`, `.cta-primary`, etc.)
- **Typography**: Inter and Inter Tight from Google Fonts
- **Theme**: Dark theme with cyan accents and void aesthetic

### Animation System
- **Framework**: Alpine.js for smooth, modern animations
- **Hero animations**: Title, tagline, and buttons fade in on load
- **Scroll animations**: Sections appear as you scroll down
- **Interactive effects**: Cards lift and glow on hover

## 🚨 Important Notes for Claude Code

1. **Always edit files in `static-site/` directory** - Never edit root files (they get overwritten)
2. **Use deployment script** - Run `./deploy.sh` from `static-site/` directory
3. **No build step** - Files are ready to deploy as-is
4. **Test locally** - Open `static-site/index.html` in browser before deploying
5. **Preserve Alpine.js directives** - Keep `x-data`, `x-show`, etc. when editing

## 🎨 Visual Editing with Pinegrow

### Pinegrow Workflow
1. Open Pinegrow
2. Open `static-site/index.html`
3. Edit visually using Pinegrow's interface
4. Save changes
5. Run `./deploy.sh`

### Pinegrow Tips
- Site uses CSS custom properties for theming
- Components use classes from `mvp.css`
- Alpine.js directives are preserved for animations
- Responsive design built with utility classes

## 🔧 Customization

### Adding New Animations
```html
<!-- Fade in on scroll -->
<div x-data="{ visible: false }"
     x-intersect="visible = true"
     x-show="visible"
     x-transition>
  Your content here
</div>

<!-- Hover effect -->
<div x-data="{ hovered: false }"
     @mouseenter="hovered = true"
     @mouseleave="hovered = false"
     :class="{ 'scale-110': hovered }">
  Hover me
</div>
```

### Modifying Colors
Edit `static-site/css/design-tokens.css`:
```css
:root {
  --void: #0A0A0A;    /* Background */
  --steel: #1A1F2E;   /* Cards */
  --frost: #F5F5F5;   /* Text */
  --cyan: #00E5FF;    /* Accent */
  --gold: #FFD700;    /* Badges */
}
```

## 🌐 Deployment Flow

```
Static Files (static-site/) → Deploy Script → GitHub (root) → Hostinger
         ↓                        ↓              ↓              ↓
    Source Files             Copy & Commit   Deployed Files   Live Site
    (edit these)             (automated)      (tracked)      (public)
```

## 📝 Benefits of Current Approach

- **No build step**: Edit and deploy instantly
- **Visual editing**: Use Pinegrow for WYSIWYG editing
- **Modern animations**: Alpine.js provides smooth interactions
- **Fast deployment**: Single script handles everything
- **Easy maintenance**: Standard HTML/CSS anyone can edit
- **Excellent performance**: No framework overhead
- **Simple debugging**: View source shows actual code

## 🔄 Legacy Information

The project previously used Next.js with TypeScript and Tailwind CSS. Those files may still exist but are no longer active. The current production site runs entirely from the static-site/ directory.

## 🔗 External Connections

- **GitHub Repository**: `https://github.com/xoeieox/inertia-website.git`
- **Hostinger**: Connected to GitHub main branch for automatic deployment
- **Domain**: Configured through Hostinger's DNS settings

---

**Last Updated**: September 2025
**Current Setup**: Static website with Alpine.js animations and Pinegrow visual editing