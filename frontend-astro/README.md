# Audio Braille Patterns — Astro Frontend

Astro + React rewrite of the [Audio Braille Patterns Voice Recordings](https://abp.beukesbunch.com) site, migrated from Angular 9.

## Stack

- **Astro** 6.3.3 — static site generator (`output: 'static'`)
- **React** 19.2.6 — React island for sidebar toggle (`client:load`)
- **Vitest** — unit tests (`src/test/`)
- **Node** ≥ 22.12.0

## Project Structure

```text
frontend-astro/
├── public/
│   ├── fonts/FontinSans/        # FontinSans OTF files
│   └── _redirects               # Netlify SPA catch-all
├── src/
│   ├── components/
│   │   ├── Layout.astro          # HTML shell (GA4, Material Icons CDN, fonts)
│   │   ├── Sidebar.astro         # Nav with mdi:braille + brightness_auto icons
│   │   ├── SidebarToggle.tsx     # React island — sidebar open/close
│   │   └── Topnav.astro          # Top header bar
│   ├── data/
│   │   └── braille-patterns.ts  # 5 pattern entries (sorted alphabetically)
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro           # Redirects to /braille-patterns
│   │   ├── braille-patterns.astro
│   │   ├── about.astro
│   │   └── 404.astro
│   └── test/
│       └── *.test.ts             # Vitest tests (10 passing)
└── package.json
```

## Commands

Run from `frontend-astro/`:

| Command                  | Action                                        |
| :----------------------- | :-------------------------------------------- |
| `npm install`            | Install dependencies                          |
| `npm run dev`            | Start dev server at `localhost:4321`          |
| `npm run build`          | Build static site to `./dist/`               |
| `npm run preview`        | Preview build locally                         |
| `npm run test`           | Run Vitest unit tests                         |
| `npm run netlify:deploy:prod` | Deploy to Netlify production             |

## Notes

- **Sidebar toggle button** is hidden via `display: none` CSS — the toggle component remains in the DOM to preserve functionality but is not visible.
- **Braille Patterns icon** — inline `mdi:braille` SVG fetched from `api.iconify.design/mdi:braille.svg` (hand reading braille). Do not substitute with a generic dot-grid SVG.
- **About icon** — `<span class="material-icons">brightness_auto</span>` loaded via Material Icons CDN.
- **GA4 tag** `G-MGPH9L7VJC` is loaded in `Layout.astro`. The old UA tag has been dropped (sunset 2023).

