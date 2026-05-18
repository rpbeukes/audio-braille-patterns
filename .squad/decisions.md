# Squad Decisions

## Active Decisions

### 2026-05-18: Flowbite Template Evaluation & Adoption

**Status:** Confirmed — implementation pending

Adopt [themesberg/flowbite-astro-admin-dashboard](https://github.com/themesberg/flowbite-astro-admin-dashboard) (MIT license) as scaffold for `frontend-astro/`, replacing minimal Astro template.

**Key findings:**
- No React present — uses vanilla `flowbite` JS (not `flowbite-react`)
- Sidebar mobile toggle handled entirely by Flowbite's JS drawer (eliminates need for separate React island)
- Updated Decision 1: React islands not required for initial migration
- Updated Decision 5: Use Tailwind CSS + Flowbite v2 (not plain CSS)
- Dark mode included as bonus feature (`localStorage` `color-theme` key)

**Template cleanup required:**
- Remove: Dashboard modules, CRUD pages, Form pages, authentication, apexcharts, @faker-js/faker, sitemap, shiki, tailwind-scrollbar, flowbite-typography
- Keep: astro, @astrojs/tailwind, tailwindcss, flowbite
- Stripping reduces template to ~20-30% of original size

**Actions:**
- Dallas: Phase 0 clone → gut → scaffold ABP structure
- Dallas: Phase 2 strip NavBarSidebar, SideBar; build table and about pages
- Ripley: Review Phase 0 gate (dev server, sidebar, dark mode)
- Parker: Update CICD working-directory to `./frontend-astro`; upgrade Node 20+

---

### 2026-05-18: Template Evaluation — bookworm-light-astro

**Status:** Evaluated — ⚠️ Partial fit (not adopted)

Evaluated [bookworm-light-astro](https://github.com/themefisher/bookworm-light-astro) as alternative template.

**Verdict:** Passes hard requirement (React is present, production-ready). However, **template is full-featured blog with multi-author support, post management, categories, tags, and search**. For ABP (simple YouTube link listing), represents significant bloat. Astro + React + TypeScript stack ideal, but blog infrastructure must be almost entirely removed (target: ~20-30% of current size remains). **Not recommended** — Flowbite template or minimal Astro starter more efficient.

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
