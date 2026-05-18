# Decisions Log

> Canonical merged decisions for audio-braille-patterns. All decisions are final once merged here.

---

## 2026-05-18 — Template Direction: Flowbite Astro Admin Dashboard — REJECTED

**Author:** Ruan Beukes  
**Date:** 2026-05-18  
**Status:** **Rejected**

**Template evaluated:** [themesberg/flowbite-astro-admin-dashboard](https://github.com/themesberg/flowbite-astro-admin-dashboard)

**Finding:** Template uses Astro + Tailwind CSS + Flowbite vanilla JS only. **React is entirely absent** — `flowbite-react` is not a dependency. The sidebar toggle is wired via Flowbite's vanilla JS data attributes, not React.

**Reason for rejection:** Ruan requires React in the migration stack. This template would eliminate React from the project.

**Decision:** Template is not adopted. The original architecture stands: **Astro + React islands** (Decision 1 remains unchanged). `@astrojs/react` integration is required. `SidebarToggle.tsx` (React island, `client:load`) remains the approach for the mobile sidebar toggle.

**Note:** `flowbite-react` (https://github.com/themesberg/flowbite-react) exists as a separate React component library built on Tailwind + Flowbite, which could be adopted in future if a Flowbite design system is desired — but this is deferred and outside current scope.

---

## 2026-05-18 — Architectural Decisions: Angular → Astro Migration

**Author:** Ripley (Lead)  
**Date:** 2026-05-18  
**Status:** **Active — in progress**

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

### Open Questions (Resolved)

| # | Question | Impact | Ruan's Response | Status | Conclusion |
|---|---|---|---|---|---|
| Q1 | Does the Netlify site serve from the domain root (`abp.beukesbunch.com/`) or a subdirectory? | If subdirectory, Astro `base` config must be set and all asset/route paths updated | I'm not sure, the files are deployed to `audio-braille-pattern`, but when the site is hit, it goes to `abp.beukesbunch.com` and then the app route `abp.beukesbunch.com/braille-patterns` automatically. ![Netlify UI screenshot](\netlify-deployment-file-structure.png) | ✅ Resolved | `audio-braille-pattern` is the Netlify site slug, not a URL path. Custom domain serves from root `/`. No `base` config needed. `/braille-patterns` is a route, not a directory. See `.squad/decisions/inbox/ripley-q1-base-url-resolved.md`. |
| Q2 | Should pattern names link to their `blogContentUrl` (pathstoliteracy.org) in the new table? | Minor UX enhancement — the data has this field but Angular UI doesn't use it | No | ✅ Resolved | No links. Data field preserved in type but not rendered. No architecture impact. |
| Q3 | Should a search/filter input be added to the Braille Patterns page? (`applyFilter` was dead code in Angular) | Scope change — if yes, this becomes a React island | I want this app to be static generated, so  if the filter is not need, we can add it later. | ✅ Resolved | Fully static confirmed. No filter island in scope. Decision 1 (islands architecture) stands as written — SidebarToggle is the only React island. |
| Q4 | After successful Astro deployment, should `frontend/` be deleted from the repo? | Recommend yes, to avoid confusion. Confirm before Parker removes it from CICD. | Let's wait with this one until I'm happy with the result. | ✅ Resolved | Parker does NOT touch `frontend/` until Ruan explicitly confirms. Decision 2 (parallel directories) stands. |

---

## 2026-05-18 — Inbox Entry: Q1 — Base URL / Netlify Deployment

**Author:** Ripley (Lead)  
**Resolved:** 2026-05-18

### Question

Does the Netlify site serve from the domain root (`abp.beukesbunch.com/`) or a subdirectory?  
If subdirectory, Astro `base` config must be set and all asset/route paths updated.

### Ruan's Answer

> "I'm not sure, the files are deployed to `audio-braille-pattern`, but when the site is hit, it goes to `abp.beukesbunch.com` and then the app route `abp.beukesbunch.com/braille-patterns` automatically."

### Analysis

`audio-braille-pattern` is the **Netlify site slug** — the internal project name that determines the `{slug}.netlify.app` fallback URL. It is **not** a URL path segment.

When a custom domain (`abp.beukesbunch.com`) is configured in Netlify, the site is always served from the domain root (`/`). The slug plays no role in routing.

`/braille-patterns` is an **Angular client-side route**, not a directory path. In the current Angular build, Netlify's `_redirects` rule (`/* /index.html 200`) catches all paths and lets Angular's router handle them. In Astro, `pages/braille-patterns.astro` becomes a real static file at `/braille-patterns/index.html` — same URL, same behaviour, no redirect hack needed.

### Determination

**Astro `base` config is NOT needed.**

- The custom domain serves from root `/`
- `/braille-patterns` is a route, not a deployment subdirectory
- No asset path changes required
- No `base` prefix in `astro.config.mjs`

### Risk Assessment

**Risk: NONE.**

The Netlify `_redirects` file in the current Angular build can be dropped (or reduced) — Astro static output creates real HTML files at the correct paths. The SPA catch-all redirect is no longer necessary for the main routes. It may be kept as a fallback for any bookmarked deep links during the cutover window, but is not architecturally required.

### Action Required

- Parker: Do **not** set `base` in `astro.config.mjs`
- Parker: The `_redirects` SPA rule can be removed or kept as a transitional safety net — confirm with Ruan at deploy time
- No impact on any other architectural decision
