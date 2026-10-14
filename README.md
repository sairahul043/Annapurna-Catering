# 🍛 Annapurna Caterers — Premium Catering Website

> **అన్నపూర్ణ / Annapurna Caterers** — Authentic Andhra Pradesh catering for weddings, poojas, receptions & corporate events.

## 🌐 Live Site

Deploy via **GitHub Pages** — push this folder to a GitHub repository, enable Pages in Settings → Pages → Source: `main` branch, and your site goes live.

## 📄 Pages

| Page | File | Description |
|------|------|-------------|
| **Home** | `index.html` | Full-viewport parallax hero, animated counters, teaser grid |
| **Packages & Menus** | `packages.html` | Veg/Non-Veg toggle, 8 transparent per-plate pricing tiers (₹225–₹595), live stations |
| **Services & Formats** | `services.html` | Delivery Only vs Full Vindu comparison, feature table, 4-step workflow |
| **Cost Calculator** | `calculator.html` | Interactive calculator with guest count stepper, package & service selectors, live budget estimate |
| **About & Hygiene** | `about.html` | 18-year story, quality pillars, milestones timeline, FSSAI/ISO badges |
| **Contact Us** | `contact.html` | Quote request form → WhatsApp, URL param pre-fill from packages/services pages |

## 🎨 Shared Assets

| File | Purpose |
|------|---------|
| `style.css` | Complete CSS framework — design tokens, 15+ keyframe animations, glassmorphism, scroll-reveal classes, responsive breakpoints |
| `animations.js` | Vanilla JS engine — IntersectionObserver reveals, animated counters, parallax, magnetic buttons, cursor glow, text-split, mobile nav |

## ✨ Premium Features

- **Scroll-triggered animations** — `.reveal-up`, `.reveal-left`, `.reveal-scale`, `.reveal-rotate` with stagger delays
- **Parallax hero backgrounds** on every page
- **Glassmorphism cards** with frosted blur effects
- **Magnetic hover buttons** that follow cursor
- **Animated number counters** (years, events, plates)
- **Character-split text animation** on hero headings
- **Cursor glow follower** on desktop
- **Smooth page transitions** via `body.loaded` entrance
- **Custom scrollbar** with gold accent
- **Mobile-first responsive** — 1024px / 768px / 480px breakpoints

## 📱 Contact Integration

All forms and CTAs route directly to WhatsApp — **no backend required**.

- 📞 **Phone/WhatsApp**: +91 73860 46000
- 📧 **Email**: Annapoornacatering8@gmail.com
- 📸 **Instagram**: [@annapoorna_premiumcatering](https://www.instagram.com/annapoorna_premiumcatering)

## 🚀 Deployment

```bash
# 1. Create a GitHub repository
git init
git add .
git commit -m "Annapurna Caterers premium website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main

# 2. Enable GitHub Pages
# Go to Settings → Pages → Source: Deploy from branch → main → / (root) → Save
```

Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## 🛠️ Tech Stack

- **Pure HTML5 + CSS3 + Vanilla JavaScript** — no frameworks, no build tools
- **Google Fonts** — Cormorant Garamond, Plus Jakarta Sans, Noto Serif Telugu
- **Font Awesome 6.5.1** — icons via CDN
- **Unsplash** — hero/background images via CDN URLs
- **GitHub Pages** compatible — fully static, zero server dependencies
