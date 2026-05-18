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

### 2026-05-18 — Bookworm-Light-Astro Template Evaluated (Not Adopted)

**What we evaluated:**

- Requested evaluation of `themefisher/bookworm-light-astro` as alternative to Flowbite template
- Template is a full-featured blog with Astro 6.1.9, React 19.2.5, Tailwind CSS 4.2.4, TypeScript 6.0.3, MDX, Fuse.js, search, tags, categories, multi-author support
- React is **present and mandatory** (unlike Flowbite, which was rejected for this reason) — passes hard requirement immediately
- **Verdict:** ⚠️ Partial fit — NOT adopted

**Why rejected:**

- Template is 70-80% blog infrastructure (post management, multi-author system, tags, categories, search, contact forms, auth pages, dashboard)
- ABP only needs: YouTube link listing, 2 static pages, 1 data table, sidebar nav, dark mode
- Stripping would reduce template to ~20-30% of original size — inefficient vs. Flowbite or minimal Astro starter
- Astro + React + TypeScript stack is ideal, but blog bloat outweighs benefits

**Outcome:** Flowbite template (vanilla JS) confirmed as primary direction. Bookworm evaluation archived in decisions.md for future reference only. No implementation from Bookworm template.

### 2026-05-18 — Flowbite Template Evaluated and Adopted

**What we learned about the deployment:**

- The Netlify **site slug** is `audio-braille-pattern`. This is the internal Netlify project name — it determines the fallback `audio-braille-pattern.netlify.app` URL but has **no bearing on path structure** when a custom domain is in use.
- The custom domain is `abp.beukesbunch.com`. Netlify serves this from the domain root (`/`). There is no subdirectory prefix.
- `/braille-patterns` and `/about` are Angular client-side routes, not filesystem paths. The Angular build uses `_redirects` (`/* /index.html 200`) as a SPA catch-all so the server always returns `index.html` and Angular's router handles navigation.
- In Astro, these become real static HTML files (`/braille-patterns/index.html`, `/about/index.html`). The SPA redirect is no longer architecturally necessary — though it can be retained as a transitional safety net.
- **Astro `base` config is NOT needed.** All asset and route paths are root-relative. No changes to any path handling in the migration plan.
- Risk level for this item is now ZERO. Full analysis filed at `.squad/decisions/inbox/ripley-q1-base-url-resolved.md`.

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

### 2026-05-18 — All Open Questions Resolved

**Status update — decisions are now final:**

- **Q1 (Base URL):** Resolved. `audio-braille-pattern` is Netlify site slug (internal), not URL path. Custom domain `abp.beukesbunch.com` serves from root `/`. No Astro `base` config needed. Risk: ZERO.
- **Q2 (Pattern links):** Resolved. No links to `blogContentUrl` — data field preserved but not rendered.
- **Q3 (Filter UI):** Resolved. No filter island — site stays fully static. Can add later if needed.
- **Q4 (Old frontend/):** Resolved. Keep alongside `frontend-astro/` until Ruan confirms stable production deploy. Parker does NOT touch it.

Detailed analysis for Q1 filed in main decisions log: `decisions\Astro-upgrade-decisions.md` (Section: "2026-05-18 — Inbox Entry: Q1 — Base URL / Netlify Deployment").

### 2026-05-18 — Phase 0 Complete: Astro Scaffold (Dallas Delivered)

✅ **READY FOR PHASE 0 REVIEW GATE**

Dallas has completed Phase 0. The minimal Astro + React scaffold is built at `frontend-astro/` with clean integration:

**Deliverables:**
- Directory: `frontend-astro/` with Astro 6.3.3, React 19.2.6, @astrojs/react 5.0.5
- Configuration: `output: 'static'` in astro.config.mjs, strict TypeScript, React JSX configured
- Build: `npm run build` passes — 1 page built, no TypeScript errors
- Assets: `_redirects`, `_headers`, pattern images copied to `public/`

**Key decision:** User directive confirmed **no external template** — minimal scaffold only. Earlier Flowbite adoption decision archived and superseded in decisions.md.

**Ripley's Phase 0 Review Gate (next steps):**
1. Run dev server: `npm run dev` in `frontend-astro/` — must start cleanly
2. Verify HMR: Change a file and confirm browser hot-reloads
3. Test sidebar + dark mode: Both interactive features work
4. TypeScript reporting: No errors in the editor

**After gate approval:**
- Dallas proceeds to Phase 1 — migrate data to `src/data/braille-patterns.ts`
- Parker updates CICD when gated (working-directory, Node 20+)
- Lambert prepares accessibility tests (axe-core, Playwright)

