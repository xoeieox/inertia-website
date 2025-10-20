# Deployment Guide

## 🚀 Quick Deployment

To deploy your static website:

```bash
cd static-site
./deploy.sh
```

That's it! No build step, no npm, no complexity.

## 🔄 Development Workflow

### Making Changes

1. **Direct editing**: Edit HTML, CSS, or JS files directly
2. **Pinegrow editing**: Open `index.html` in Pinegrow for visual editing
3. **Deploy**: Run `./deploy.sh` to publish changes

### File Structure

```
static-site/
├── index.html          # Homepage (edit with Pinegrow)
├── css/
│   ├── design-tokens.css   # Color scheme, fonts, variables
│   ├── utilities.css       # Tailwind-like utility classes
│   ├── mvp.css            # MVP design system
│   └── animations.css     # Alpine.js animation helpers
├── js/                 # (Future JavaScript if needed)
├── assets/             # Images, fonts, etc.
└── deploy.sh           # One-click deployment
```

## 🎨 Visual Editing with Pinegrow

1. Open Pinegrow
2. Open `static-site/index.html`
3. Edit visually using Pinegrow's interface
4. Save changes
5. Run `./deploy.sh`

### Pinegrow Tips

- The site uses CSS custom properties (`--void`, `--cyan`, etc.)
- Components use classes from `mvp.css` (`.card`, `.cta-primary`, etc.)
- Alpine.js directives are preserved for animations

## 🎭 Animation System

The site uses Alpine.js for smooth, modern animations:

- **Hero animations**: Title, tagline, and buttons fade in on load
- **Scroll animations**: Sections appear as you scroll down
- **Spinning icon**: Insight prototype has a rotating symbol
- **Card hover effects**: Products cards lift and glow on hover

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

## 🔧 Customization

### Colors

Edit `css/design-tokens.css`:

```css
:root {
  --void: #0A0A0A;    /* Background */
  --steel: #1A1F2E;   /* Cards */
  --frost: #F5F5F5;   /* Text */
  --cyan: #00E5FF;    /* Accent */
  --gold: #FFD700;    /* Badges */
}
```

### Typography

Fonts are loaded from Google Fonts:
- **Headers**: Inter Tight (thin, elegant)
- **Body**: Inter (readable, modern)

### Components

All components are in `css/mvp.css`:
- `.cta-primary` - Main buttons
- `.cta-secondary` - Ghost buttons
- `.card` - Product cards
- `.hero` - Hero section
- `.container` - Content wrapper

## 📦 Deployment Details

The `deploy.sh` script:

1. Clears all tracked files from git
2. Copies static-site files to project root
3. Commits only the built HTML/CSS/JS files
4. Pushes to GitHub
5. Hostinger automatically syncs from GitHub

### Deployment Requirements

- Git repository connected to Hostinger
- Execute permissions on `deploy.sh`
- No build dependencies (Node.js, npm, etc.)

## 🎯 Benefits of This Approach

- **No build step**: Edit and deploy instantly
- **Visual editing**: Use Pinegrow for WYSIWYG editing
- **Modern animations**: Alpine.js provides smooth interactions
- **Fast deployment**: Single script handles everything
- **Easy maintenance**: Standard HTML/CSS anyone can edit
- **Excellent performance**: No framework overhead

## 🚨 Important Notes

- Always edit files in `static-site/` directory
- Don't edit files in project root (they get overwritten)
- Test changes locally by opening `index.html` in browser
- The deployment script replaces all root files with static-site content

## 🔄 Reverting Changes

If you need to go back:

1. The original Next.js files are preserved
2. You can run the original build script
3. Or restore from git history

The static site is completely separate from the Next.js version.