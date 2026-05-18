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

### 2026-05-18 — Phase 0 Complete: Astro Scaffold

✅ **COMPLETE & GATED** — Ready for Ripley Phase 0 review

Completed Phase 0 — minimal Astro + React scaffold at `frontend-astro/`.

**Versions installed:**
- `astro`: ^6.3.3 (create-astro 5.0.6)
- `react`: ^19.2.6
- `react-dom`: ^19.2.6
- `@astrojs/react`: ^5.0.5
- `@types/react`: ^19.2.14
- `@types/react-dom`: ^19.2.3

**What was done:**
1. `npm create astro@latest frontend-astro -- --template minimal --typescript strict --no-git --no-install` — scaffold created, deps installed separately
2. `npx astro add react --yes` — React integration added, `tsconfig.json` auto-updated
3. `astro.config.mjs` — added `output: 'static'` (not added by astro add react)
4. Directories created: `src/data/`, `src/components/`, `src/layouts/`
5. Assets copied to `public/`: `pattern-images/` (5 images), `favicon.ico`, `_redirects`, `_headers`
   - `_redirects` and `_headers` were in `frontend/src/` (not `frontend/public/`)
6. `npm run build` — ✅ 1 page built, no TypeScript errors

**Deviations from plan:**
- `decisions.md` mentioned Flowbite template adoption, but Ruan confirmed minimal scaffold only — no external template used.
- `--no-install` flag IS supported by create-astro 5.0.6; used successfully.
- `astro add react` auto-updated `tsconfig.json` with jsx/jsxImportSource — no manual edit needed.

**Gate status:** Awaiting Ripley Phase 0 Review Gate. Ripley will verify:
- Dev server: `npm run dev` in `frontend-astro/` starts without errors
- HMR: Code changes reflect in browser
- Sidebar dark mode: verify both work
- TypeScript: no errors reported

**Next action after gate approval:** Phase 1 — Migrate data to `src/data/braille-patterns.ts`

### 2026-05-18 — Phase 1 Complete: Data & Assets Migration

✅ **COMPLETE**

**What was done:**

1. **Data file created:** `frontend-astro/src/data/braille-patterns.ts`
   - Interface renamed `BraillePatternLine` → `BraillePattern` (cleaner, context-appropriate)
   - Array renamed `BraillePatternLines` → `braillePatterns` (camelCase, no "Lines" suffix)
   - All 5 entries preserved: Tow truck, Valentine's heart, Santa Claus, Hello Kitty with Santa hat, Flower in pot
   - Image paths updated from `assets/pattern-images/…` → `/pattern-images/…` (public/ root-relative)
   - Both interface and array exported; clean TypeScript, no `any`

2. **Assets verified:** All 5 PNGs already present in `frontend-astro/public/pattern-images/` from Phase 0. No copy needed.

3. **Fonts copied:** `frontend/src/assets/fonts/FontinSans/` (5 `.otf` files) → `frontend-astro/public/fonts/FontinSans/`
   - Fontin_Sans_B.otf, Fontin_Sans_BI.otf, Fontin_Sans_I.otf, Fontin_Sans_R.otf, Fontin_Sans_SC.otf

4. **Build:** `npm run build` — ✅ 1 page built, 0 TypeScript errors, 0 warnings

**Deviations from plan:** None. Phase 1 spec followed exactly.

**Next action:** Phase 2 — Build components (Layout.astro, PatternsTable.astro, AboutPage.astro, SidebarToggle.tsx, Navigation.astro)

### 2026-05-18 — Phase 3 Complete: 404 Page & Build Verification

✅ **COMPLETE**

**What was done:**

1. **404 page created:** `frontend-astro/src/pages/404.astro` — custom error page for missing routes
2. **_redirects file updated:** Configuration adjusted for proper URL routing behavior
3. **Build verification:** All 4 pages built successfully with 0 TypeScript errors
   - Index page
   - About page
   - 404 error page
   - Additional page

**Gate status:** Phase 3 complete and verified. Ready for Phase 4 CI/CD updates by Parker.

### 2026-05-18 — Braille Icon Fix: Replaced Wrong SVG Path

✅ **COMPLETE**

**What was done:**

The `mdi:braille` inline SVG in `frontend-astro/src/components/Sidebar.astro` was using the wrong path data — it was a braille dot grid icon, not the actual MDI braille icon (which shows a hand/arm reading braille with dots alongside).

- Fetched correct path from `https://api.iconify.design/mdi:braille.svg`
- Replaced the incorrect multi-circle path data with the correct path from MDI
- SVG wrapper kept identical (`width="24" height="24" viewBox="0 0 24 24" fill="currentColor"`)
- Build verified: 4 pages, 0 TypeScript errors
- Committed: `fix(icons): correct mdi:braille SVG path to match Angular app`

**Root cause:** When the original inline SVG was added, the wrong icon was sourced (likely a different braille-related icon from MDI, not the canonical `mdi:braille`).
