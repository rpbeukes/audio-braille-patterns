# Project Context

- **Owner:** Ruan Beukes
- **Project:** Audio Braille Patterns — Angular → Astro + React migration
- **Site:** https://abp.beukesbunch.com/braille-patterns
- **Stack (current):** Angular, TypeScript
- **Stack (target):** Astro, React, TypeScript
- **What it does:** Lists YouTube links for audio/braille pattern learning content
- **Created:** 2026-05-18

## Core Context

Lambert is the Tester for the Audio Braille Patterns migration project.

**The mission:** Ensure the migrated Astro site is accessible, correct, and complete. The site serves users with visual and hearing differences — accessibility is a core concern, not an afterthought.

**Key testing concerns:**
- WCAG 2.1 AA compliance (color contrast, keyboard nav, screen reader labels)
- YouTube embeds must have accessible titles/labels
- Static page output must match Angular app content
- No JavaScript required for core content viewing (Astro's static-first helps here)

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-05-18 — Icon Sourcing Standard: Iconify API as Source of Truth

Dallas fixed the braille icon in Sidebar.astro. The previously inlined SVG was incorrect — not actually `mdi:braille` from MDI / Iconify. The correct icon depicts a hand reading braille, not just a dot grid.

**Team decision:** When inlining MDI icons, fetch SVG paths from the Iconify API directly (`https://api.iconify.design/{icon-set}:{icon-name}.svg`) rather than transcribing from memory or secondary sources.

**Accessibility implications:** Icons sourced from Iconify API maintain consistent visual representation across the app. When icons are used in UI with labels, ensure the icon itself has either `aria-hidden="true"` (if text label present) or an appropriate `aria-label` (if icon-only).



Ripley completed the initial architecture and planning phase. Key info for Lambert:

**Testing Strategy (QA Responsibilities):**
- Verify Astro static build produces correct HTML output
- Compare rendered pages against Angular version (functional parity)
- WCAG 2.1 AA accessibility audit (critical — site serves blind users)
- Keyboard navigation audit (sidebar toggle must be keyboard-operable)
- Screen reader testing (image alt text, aria-current, semantic HTML)
- No JavaScript required for core content (Astro's static-first should enforce this)

**Accessibility Audit Scope:**
- **Images:** Verify `alt="Braille pattern for {name}"` present on all patterns
- **Navigation:** Verify `aria-current="page"` on active nav link
- **Color contrast:** Verify text/background ratios meet WCAG AA (4.5:1 for body text)
- **Keyboard:** Test sidebar toggle with Tab/Enter/Escape keys
- **Screen readers:** Test with NVDA or JAWS (YouTube links must be labeled properly)

**Test Stack:**
- Vitest for unit tests (if components need testing)
- Playwright for E2E tests (verify page loads, content renders, sidebar toggle works)
- axe-core for accessibility scanning (run on all pages)

**Key Context:**
- The site has exactly **5 braille patterns** and **2 pages** (patterns + about)
- Only **1 interactive element**: sidebar toggle (React island)
- Everything else is static HTML at build time
- Site's primary audience includes blind users — accessibility is not optional

**Decisions Pending Ruan (May Affect Test Coverage):**
- Q1: Netlify domain root vs. subdirectory? (affects link validation)
- Q2: Link pattern names to `blogContentUrl`? (adds table link to test)
- Q3: Add search/filter UI? (adds interactive component to test)
- Q4: Delete old `frontend/` after migration? (no test impact)

**Full migration plan:** See Ripley's learnings or `prompts/UpgradeToAstro/migration-plan.md`

### 2026-05-18 — Phase 5 Complete: Accessibility Audit PASS

**Lambert completed the final phase of the ABP migration.** Static HTML audit of all 3 pages (braille-patterns, about, 404) passed WCAG 2.1 AA with zero issues.

**Key wins:**
- All lang attributes, titles, semantic HTML in place
- Table correctly marked with `<thead>`, `<tbody>`, `scope="col"` on headers
- All 5 pattern images have descriptive `alt="Braille pattern for {name}"` (beats Angular's empty `alt=""`)
- All 5 audio links have `aria-label="Open audio instructions for {name}"`
- Sidebar nav (`aria-label="Main navigation"`)
- SidebarToggle button properly labeled and expanded state tracked (`aria-expanded="false"` in static HTML)
- All external links carry `rel="noopener"` (404 back link included)
- 10/10 tests passing (6 data + 4 SidebarToggle)

**Verdict:** Migration improves accessibility. All pages clean for screen reader users and keyboard navigation. **READY FOR PRODUCTION.**

All 6 phases now complete:
- Phase 0 (Dallas): Astro scaffold ✅
- Phase 1 (Dallas): Data & assets ✅
- Phase 2 (Ripley): Page structure ✅
- Phase 3 (Ripley): React island ✅
- Phase 4 (Parker): CI/CD ✅
- Phase 5 (Lambert): a11y audit ✅
