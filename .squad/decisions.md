# Squad Decisions

## Active Decisions

### 2026-05-18: Scaffolding Strategy — No External Template (User Directive)

**Status:** ✅ Confirmed & Executed

**Direction:** Build the Astro site from a minimal scaffold (`npm create astro`, add `@astrojs/react`). No external template adoption. The Flowbite and bookworm templates were evaluated and declined.

**Why:** Ruan (user) explicitly requested no external template — build from scratch for full control and minimal bloat.

**Phase 0 Completion (by Dallas):**
- ✅ Astro 6.3.3 scaffold created in `frontend-astro/`
- ✅ React 19.2.6 + @astrojs/react 5.0.5 configured
- ✅ TypeScript strict mode enabled, tsconfig.json auto-configured
- ✅ `output: 'static'` added to astro.config.mjs
- ✅ `_redirects` and `_headers` copied from `frontend/src/` to `frontend-astro/public/`
- ✅ Build passes: 1 page built, 0 TypeScript errors

**Deviations from earlier decisions.md:**
- Earlier decision (Flowbite adoption) is overridden by user directive. Keeping template evaluation notes below for reference.
- Earlier Decision 1 & 5 updated: React islands are optional (not required for initial migration); Tailwind+Flowbite optional (not mandatory).

---

### 2026-05-18: Flowbite Template Evaluation & Adoption — ARCHIVED

**Status:** ⚠️ Superseded by user directive (no external template)

*(Included for historical reference; actual implementation does not proceed with Flowbite adoption.)*

Evaluated [themesberg/flowbite-astro-admin-dashboard](https://github.com/themesberg/flowbite-astro-admin-dashboard) (MIT license) as candidate template for `frontend-astro/`.

**Key findings:**
- No React present — uses vanilla `flowbite` JS (not `flowbite-react`)
- Sidebar mobile toggle handled entirely by Flowbite's JS drawer
- Dark mode included as bonus feature (`localStorage` `color-theme` key)

This template was not adopted per user directive (2026-05-18).

---

### 2026-05-18: Template Evaluation — bookworm-light-astro

**Status:** Evaluated — ⚠️ Partial fit (not adopted)

Evaluated [bookworm-light-astro](https://github.com/themefisher/bookworm-light-astro) as alternative template.

**Verdict:** Passes hard requirement (React is present, production-ready). However, **template is full-featured blog with multi-author support, post management, categories, tags, and search**. For ABP (simple YouTube link listing), represents significant bloat. Astro + React + TypeScript stack ideal, but blog infrastructure must be almost entirely removed (target: ~20-30% of current size remains). **Not recommended** — minimal Astro starter (per final user directive) more efficient.

**Tech stack (if adopted):**
- Astro 6.1.9, React 19.2.5, React DOM 19.2.5, @astrojs/react 5.0.4, Tailwind CSS 4.2.4, TypeScript 6.0.3, MDX, Fuse.js, gray-matter, marked, react-icons, date-fns

**Components to strip if used:**
- Multi-author system (config, author pages/routes)
- Post management (drafts, categories, tags, featured posts)
- Blog archive, pagination, contact form, site-wide search, GTM config
- Markdown/MDX authoring pipeline, content collections, sitemap

---

### 2026-05-18: Phase 1 — Data & Assets Migration (Dallas)

**Status:** ✅ Complete

- **Data file:** `frontend-astro/src/data/braille-patterns.ts`
- **Entries migrated:** 5
- **Interface:** BraillePattern
- **Assets verified:** All 5 pattern images present; all FontinSans fonts copied to `frontend-astro/public/fonts/FontinSans/`
- **Build:** Pass (1 page, 0 TypeScript errors)

Spec followed exactly. Image paths updated to root-relative format for Astro's public directory.

---

### 2026-05-18: Replace SPA `_redirects` Catch-All with Astro Static Rules (Dallas)

**Status:** ✅ Executed

**Change:** Remove Angular SPA catch-all (`/* /index.html 200`) from `public/_redirects`. Replace with:
```
/braille-patterns  /braille-patterns/  301
```

**Rationale:** Astro static mode generates real HTML files for each route. SPA catch-all would incorrectly serve root index.html for all URLs. Single rule handles trailing-slash normalization. Netlify automatically serves 404.html for unknown paths.

**Outcome:**
- Build: 4 pages (`index.html`, `braille-patterns/index.html`, `about/index.html`, `404.html`)
- Zero TypeScript errors
- _redirects updated

---

### 2026-05-18: Phase 5 — Static HTML Accessibility Audit (Lambert)

**Status:** ✅ PASS

**Pages audited:** braille-patterns, about, 404

**All checks passed:**
- Lang attribute, non-empty titles present on all pages
- Table marked up with `<thead>`, `<tbody>`, `scope="col"` on all `<th>`
- All 5 pattern images have descriptive `alt="Braille pattern for {name}"` (improvement over Angular)
- All audio links have `aria-label="Open audio instructions for {name}"`
- Sidebar nav has `aria-label="Main navigation"`
- SidebarToggle button has `type="button"`, `aria-label="Toggle navigation menu"`, `aria-expanded="false"`
- Decorative icons have `aria-hidden="true"`
- Active nav link has `aria-current="page"`
- All external links on /about have `rel="noopener"`
- 404 page complete with back link

**Test suite:** 10/10 tests passing (6 data + 4 SidebarToggle)

**Verdict:** All 3 pages clean. WCAG 2.1 AA compliant. Migration improves accessibility by replacing empty `alt=""` with descriptive text.

---

### 2026-05-18: CI/CD Pipeline Updated for Astro (Parker)

**Status:** ✅ Executed

**Changes to `.github/workflows/CICD.yml`:**
- Node version: 16 → 20 (Astro 6.x requires Node 18+)
- Working directory: `./frontend` → `./frontend-astro`
- Angular version step removed
- Install command simplified: `npm install && (npm ls …)` → `npm install`
- Artifact path: `./frontend/dist` → `./frontend-astro/dist`
- Upload artifact action: v1 → v3
- Netlify working-directory updated

**Changes to `frontend-astro/package.json`:**
- Added `"netlify:deploy:prod": "netlify deploy --dir ./dist --prod"`

**Note on Node version constraint:** `package.json` declares `engines >= 22.12.0`, but CI uses Node 20. npm warns but does not fail. Flagged for Ruan decision: align to Node 22 LTS or lower constraint.

**Secrets:** No changes — `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` already configured.

---

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
