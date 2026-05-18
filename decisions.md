# Decisions Log

> Canonical merged decisions for audio-braille-patterns. All decisions are final once merged here.

---

## 2026-05-18 — Architectural Decisions: Angular → Astro Migration

**Author:** Ripley (Lead)  
**Date:** 2026-05-18  
**Status:** Proposed — awaiting Ruan's input on open questions

### Decision 1: Astro Islands Architecture — React only where interactive

**Decision:** Use Astro static output with React islands scoped to interactive components only.

**Rationale:** The Angular app has exactly one interactive element: the mobile sidebar toggle (which manipulates DOM classes). Everything else — the pattern table, About page, layout, navigation — is static content. Astro's zero-JS-by-default model ships the static pages as pure HTML, with a single React island (`SidebarToggle.tsx`) hydrated with `client:load` for the toggle button only.

**Implications:**
- No React Router needed
- Pattern table renders at build time (5 entries, hardcoded data)
- No client-side data fetching
- JS bundle is minimal — only the sidebar toggle React component ships to the browser

### Decision 2: New Project Directory `frontend-astro/`

**Decision:** Scaffold the Astro project in a new `frontend-astro/` directory at repo root, alongside the existing `frontend/` (Angular) directory.

**Rationale:** Preserves the working Angular site during migration. Parker can switch the CICD `working-directory` from `./frontend` to `./frontend-astro` once the Astro site is verified and deployed. The old `frontend/` is deleted after confirmation of stable production deploy.

### Decision 3: Static Output (No SSR)

**Decision:** Use Astro's default `output: 'static'` mode. No Netlify adapter, no SSR.

**Rationale:** The app has no server-side requirements — all content is hardcoded TypeScript data. Static output is simpler, faster, and already compatible with the existing Netlify CDN deploy.

### Decision 4: Data Strategy — Hardcoded TypeScript Data File

**Decision:** Migrate `braillePattterns.ts` to `src/data/braille-patterns.ts` as a plain TypeScript data module. No CMS, no API.

**Rationale:** The site has 5 entries. A CMS is overkill. The data lives in the repo and is versioned with the code. If the pattern list grows significantly in future, a CMS (e.g. Astro Content Collections, or a headless CMS) can be added then.

**Changes from Angular version:**
- Filename typo fixed: `braillePattterns` → `braille-patterns`
- Data sorted alphabetically at definition time (removing `ngOnInit` sort logic)
- Positions assigned at data layer via `.map((p, i) => ({ ...p, position: i + 1 }))`
- Interface renamed from `BraillePatternLine` to `BraillePattern`

### Decision 5: Drop Angular Material + Flex Layout

**Decision:** Angular Material and `@angular/flex-layout` are not migrated. Replace with plain CSS Flexbox/Grid.

**Rationale:** Angular Material brings the entire Material design system for a table, a toolbar, and a sidenav — massively disproportionate for this app's needs. Plain CSS achieves the same layout with zero framework overhead. Google Material Icons CDN is retained for the `volume_up`, `menu`, and `brightness_auto` icons.

### Decision 6: Accessibility Improvements as Part of Migration

**Decision:** Proactively fix two accessibility gaps during migration rather than preserving them.

**Changes:**
1. Pattern images: Angular template has no `alt` attribute on images. Astro version adds `alt="Braille pattern for {name}"`.
2. Active nav link: Angular uses `[routerLinkActive]` CSS class only. Astro version adds `aria-current="page"` on the active nav link.

**Rationale:** This site's primary audience includes blind users. Accessibility is not optional. These are clear gaps in the current implementation and are trivial to fix during migration.

### Open Questions (Decisions Needed from Ruan)

| # | Question | Impact |
|---|---|---|
| Q1 | Does the Netlify site serve from the domain root (`abp.beukesbunch.com/`) or a subdirectory? | If subdirectory, Astro `base` config must be set and all asset/route paths updated |
| Q2 | Should pattern names link to their `blogContentUrl` (pathstoliteracy.org) in the new table? | Minor UX enhancement — the data has this field but Angular UI doesn't use it |
| Q3 | Should a search/filter input be added to the Braille Patterns page? (`applyFilter` was dead code in Angular) | Scope change — if yes, this becomes a React island |
| Q4 | After successful Astro deployment, should `frontend/` be deleted from the repo? | Recommend yes, to avoid confusion. Confirm before Parker removes it from CICD. |
