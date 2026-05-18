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

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
