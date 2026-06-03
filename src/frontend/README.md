# personal-portfolio-site

Personal résumé & portfolio site for **Michiel Van Herreweghe — DevOps & Software Engineer**, built with [Astro](https://astro.build/) + React.

Implemented from the Claude Design "Voltage" direction: a bold, lightning-yellow (`#FFD000`) dark/light theme using Space Grotesk + JetBrains Mono.

## Features

- **Three pages** (single-page app with hash routing + smooth page transitions): Home, Portfolio, About.
- **Dark / light theme toggle** — persisted to `localStorage`, applied before paint (no flash).
- **Language toggle** — English / Nederlands / Français, instant switch, persisted.
- **Scroll-reveal animations**, animated nav (scroll progress + active underline), and a mobile menu.
- **Contact form** with client-side validation and a success state.
- **Print-ready résumé** at [`/Resume.html`](public/Resume.html) ("Save as PDF" from the print dialog).
- **Drag-and-drop image slots** (`<image-slot>` web component) for the headshot, project thumbnails, and book cover.

## Project structure

```
src/
  layouts/Layout.astro        # <html> shell: fonts, global CSS, theme/lang FOUC guard, image-slot loader
  pages/index.astro           # mounts the React app island (client:only)
  styles/global.css           # design tokens + base styles
  lib/i18n.jsx                # EN/NL/FR content + LangProvider / useT()
  components/
    App.jsx                   # router, theme, page transitions (wrapped in LangProvider)
    Nav.jsx, ContactFooter.jsx
    icons.jsx, primitives.jsx # Icon set, Reveal/Button/Kicker/Marquee + useReveal hook
    pages/                    # HomePage, AboutPage, PortfolioPage
public/
  image-slot.js               # user-fillable image placeholder custom element
  Resume.html                 # standalone print-ready résumé
```

## Commands

| Command           | Action                                         |
| ----------------- | ---------------------------------------------- |
| `npm install`     | Install dependencies                           |
| `npm run dev`     | Start the dev server at `localhost:4321`       |
| `npm run build`   | Build the production site to `./dist/`         |
| `npm run preview` | Preview the production build locally           |

## Editing content

All copy and data live in [`src/lib/i18n.jsx`](src/lib/i18n.jsx). Language-neutral data (name, email, socials, skills, project metadata, currently-reading) is in `NEUTRAL`; per-language strings live in the `EN` / `NL` / `FR` objects. Update there and all three languages stay in sync.
