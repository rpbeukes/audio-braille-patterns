# Project Context

- **Owner:** Ruan Beukes
- **Project:** Audio Braille Patterns — Angular → Astro + React migration
- **Site:** https://abp.beukesbunch.com/braille-patterns
- **Stack (current):** Angular, TypeScript
- **Stack (target):** Astro, React, TypeScript
- **What it does:** Lists YouTube links for audio/braille pattern learning content
- **Created:** 2026-05-18

## Core Context

Parker is the DevOps engineer for the Audio Braille Patterns migration project.

**The mission:** Set up and maintain the build + deployment pipeline for the new Astro site. The current site is deployed as a simple static Angular app — the Astro migration should result in an equally simple (or simpler) static deployment.

**Key deployment concerns:**
- Astro static output (`output: 'static'`) targeting Netlify or Vercel
- GitHub Actions for CI: build + test on every PR
- Node.js version must match Astro's requirements (Node 18+)
- The current site URL must continue to work (no broken links)

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-05-18 — Migration Plan & Architecture Decisions from Ripley

Ripley completed the initial architecture and planning phase. Key info for Parker:

**Build & Deployment Changes:**

**Current (Angular):**
- Node 16, `./frontend` working directory
- `ng build`, `ng test` commands
- `_redirects` for SPA routing (`/* /index.html 200`)
- GitHub Actions → Netlify static deploy on master push

**Target (Astro):**
- Node 18+ (Astro requirement)
- `./frontend-astro` working directory
- `npm run build` (generates static HTML in `dist/`)
- No SPA redirect needed (Astro file-based routing produces direct HTML files)
- GitHub Actions → Netlify static deploy (same)
- `output: 'static'` in `astro.config.mjs` (no Netlify adapter, no SSR)

**CICD Updates Needed:**
- Update Node.js version from 16 → 18+ in workflow
- Update working-directory from `./frontend` → `./frontend-astro`
- Replace Angular build step (`ng build --prod`) with Astro (`npm run build`)
- Replace Angular test step with new test stack (Vitest + Playwright)
- Keep Netlify deploy target — no URL change
- Remove Angular-specific build steps

**Phased Approach:**
1. Build `frontend-astro/` alongside existing `frontend/` (parallel, no downtime)
2. Test Astro site in staging first
3. Once stable, switch CICD to `frontend-astro/`
4. After confirmation of 1–2 production deploys, delete old `frontend/` from repo (decision Q4 from Ruan)

**Key Constraints:**
- **Static output only** — no server-side rendering
- **Hardcoded data** — no API or CMS (5 braille patterns built into data layer)
- **Netlify CDN** — existing domain and deploy target stay the same

**Decisions Pending Ruan (May Affect Build Config):**
- Q1: Netlify domain root vs. subdirectory? (affects Astro `base` config in `astro.config.mjs`)
- Q2: Link pattern names? (UI change, doesn't affect build)
- Q3: Add search/filter UI? (adds React to build, doesn't change output type)
- Q4: Delete old `frontend/` after migration? (cleanup step for Parker)

**Full migration plan:** See Ripley's learnings or `prompts/UpgradeToAstro/migration-plan.md`
