# Project Context

- **Owner:** Ruan Beukes
- **Project:** Audio Braille Patterns — Angular → Astro + React migration
- **Site:** https://abp.beukesbunch.com/braille-patterns
- **Stack (current):** Angular, TypeScript
- **Stack (target):** Astro, React, TypeScript
- **What it does:** Lists YouTube links for audio/braille pattern learning content
- **Created:** 2026-05-18

## Core Context

Dallas is the Frontend Dev for the Audio Braille Patterns migration project.

**The mission:** Rebuild the Angular app as an Astro + React site. The site is content-focused — a list of YouTube links for audio/braille patterns. Astro is ideal: static by default, React islands where needed.

**Astro key facts:**
- File-based routing in `src/pages/`
- Components are `.astro` files or `.tsx` React files
- React islands: add `client:load`, `client:visible`, etc. to make components interactive
- Content collections: type-safe way to manage markdown/JSON content
- `astro.config.mjs`: configure integrations (React, Tailwind, etc.)

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-05-18 — Migration Plan & Architecture Decisions from Ripley

Ripley completed the initial architecture and planning phase. Key info for Dallas:

**Migration Strategy (6 phases):**
1. Scaffold `frontend-astro/` with Astro + React integration
2. Migrate data to `src/data/braille-patterns.ts` (fixing typo, sorting at data layer)
3. Build components: layout, patterns table, about page, sidebar toggle (React island)
4. Set up Astro file-based routing
5. Configure build/deploy (Parker updates CICD)
6. Testing + accessibility (Lambert leads QA)

**Key Component Work for Dallas:**
- `Layout.astro` — shell layout with global nav
- `PatternsTable.astro` — static render of 5 braille patterns (build-time)
- `AboutPage.astro` — static about content
- `SidebarToggle.tsx` — **React island only** with `client:load` (only interactive element)
- `Navigation.astro` — nav menu with `aria-current="page"` on active link

**Critical Context:**
- Sidebar toggle is the **only** interactive element (DOM class toggle on `<body>`)
- Everything else is static HTML at build time
- No React Router, no client-side data fetching
- Google Material Icons CDN retained; Material design framework dropped

**Accessibility Improvements (Required by Lambert):**
- Add `alt="Braille pattern for {name}"` to all pattern images
- Add `aria-current="page"` on active nav link
- Site serves users with visual/hearing differences — a11y is not optional

**Decisions Pending Ruan (May Affect Component Work):**
- Q1: Netlify domain root vs. subdirectory? (affects Astro `base` config)
- Q2: Link pattern names to `blogContentUrl`? (adds table cell link)
- Q3: Add search/filter UI? (adds React island complexity)
- Q4: Delete old `frontend/` after migration? (cleanup decision)

**Full migration plan:** See Ripley's learnings in this file or `prompts/UpgradeToAstro/migration-plan.md`
