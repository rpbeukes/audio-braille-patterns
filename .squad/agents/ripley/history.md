# Project Context

- **Owner:** Ruan Beukes
- **Project:** Audio Braille Patterns — Angular → Astro + React migration
- **Site:** https://abp.beukesbunch.com/braille-patterns
- **Stack (current):** Angular, TypeScript
- **Stack (target):** Astro, React, TypeScript
- **What it does:** Lists YouTube links for audio/braille pattern learning content
- **Created:** 2026-05-18

## Core Context

Ripley is the Lead for the Audio Braille Patterns migration project.

**The mission:** Migrate the site from Angular to Astro with React. The site is a simple YouTube link listing app focused on accessibility (audio/braille patterns). Astro's static-first, islands architecture is an ideal fit — most pages are static HTML, with React islands only where interactivity is needed.

**Why Astro + React:**
- Astro ships zero JS by default — great for a mostly-static content site
- React islands can be used for any interactive components (search, filters, video embeds)
- Astro has first-class TypeScript support
- Astro + React is a well-supported combination

**Key migration concerns:**
- Angular routing → Astro file-based routing
- Angular components → Astro components (or React components with Astro islands)
- Angular services/DI → simple TypeScript modules or Astro data fetching
- Build/deploy config needs updating for the new stack

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-05-18 — Angular App Analysis + Migration Plan

**What the Angular app actually contains:**

- Angular 9.1.6, single-page app, deployed on Netlify via GitHub Actions
- Two routes: `/braille-patterns` (default) and `/about`. Root redirects to `/braille-patterns`.
- Six components: `AppComponent` (root/GA), `LayoutComponent` (shell), `TopnavComponent` (toolbar + mobile toggle), `SidebarComponent` (left nav), `BraillePatternsComponent` (data table), `AboutComponent` (static text)
- One data file: `frontend/src/app/layout/braillePatterns/braillePattterns.ts` (note typo) — `BraillePatternLine` interface + `BraillePatternLines` array of exactly 5 hardcoded entries (Tow truck, Valentine's heart, Santa Claus, Hello Kitty with Santa hat, Flower in pot)
- Each entry has: `name`, `position`, `pictureUrl?`, `audioUrl` (YouTube), `blogContentUrl?`
- Five PNG images in `frontend/src/assets/pattern-images/`
- No HTTP services, no API calls, no state management, no custom pipes
- `applyFilter()` method is defined in `BraillePatternsComponent` but NOT wired to any input in the template — dead code
- Angular Material used for table, toolbar, sidenav, icons — heavy for this tiny app
- Iconify CDN for braille icon (`mdi-braille`)
- Two Google Analytics tags: GA4 `G-MGPH9L7VJC` and UA `UA-123740081-4` (UA was shut down in 2023 — only GA4 should be migrated)
- Netlify SPA redirect `/* /index.html 200` in `_redirects`
- Security headers in `_headers` (X-XSS-Protection, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- CI: GitHub Actions, Node 16, `./frontend` working directory, Netlify deploy on push to master

**Key architectural notes:**

- The app is almost entirely static content — only the sidebar mobile toggle requires client-side JS
- The sort in `BraillePatternsComponent.ngOnInit()` can be done at build time in Astro data layer
- The `blogContentUrl` field in the data is not displayed in the Angular UI — it's an enhancement opportunity in migration
- Angular image `[src]` binding has no `alt` attribute — images have no alt text currently (accessibility gap)
- The sidebar toggle manipulates `document.querySelector('body').classList.toggle('push-right')` — clean React island approach is better

**Migration plan summary:**

- Written to `prompts/UpgradeToAstro/migration-plan.md`
- 6 phases: Scaffold → Data → Components → Routing → Build/Deploy → Testing/A11y
- Strategy: Astro static output, React island only for `SidebarToggle` (only interactive element)
- New project at `frontend-astro/` alongside existing `frontend/` (preserve Angular during migration)
- Data file moves to `src/data/braille-patterns.ts` with typo fixed and sort done at data layer
- Pattern table → static Astro page; About → static Astro page; Layout → Astro layout
- Drop Angular Material/Flex Layout; use plain CSS + Material Icons CDN
- Parker: update CICD to Node 20, new working-directory, remove Angular-specific steps
- Lambert: Vitest + Playwright, axe-core accessibility audit (critical — site serves blind users)
- Accessibility improvements: add proper `alt` text to images, `aria-current` on nav links, keyboard-operable sidebar toggle
- 4 decisions needed from Ruan: base URL, pattern name links, filter UI, old `frontend/` directory fate
