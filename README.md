# Inertia Website

Static website for Inertia - Data-Driven Beyblade Performance

## 📁 Project Structure

```
/
├── static-site/          # SOURCE FILES - Edit these!
│   ├── index.html        # Homepage
│   ├── products/         # Product pages
│   ├── css/              # Stylesheets
│   ├── assets/           # Images, icons
│   └── deploy.sh         # Deployment script
├── CLAUDE.md             # Context for Claude Code
├── DEPLOYMENT.md         # Deployment documentation
└── README.md             # This file
```

## 🚀 Deployment

All source files live in `static-site/`. The deployment script copies them to the repository root and pushes to GitHub, which automatically syncs to Hostinger.

**To deploy:**
```bash
cd static-site
./deploy.sh
```

## ✏️ Making Changes

1. Edit files in `static-site/` directory
2. Test locally by opening `static-site/index.html` in browser
3. Run `./deploy.sh` from inside `static-site/` directory
4. Changes automatically deploy to Hostinger

## 📝 Note

**Do NOT edit files in the repository root** - they get overwritten during deployment. Always edit files in `static-site/`.
