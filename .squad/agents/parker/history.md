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

### 2026-05-18 — Phase 4 Complete: CI/CD Workflow Updates

✅ **COMPLETE**

**What was done:**

1. **GitHub Actions workflow updated (.github/workflows/CICD.yml)**
   - Node.js version: 16 → 22 (latest LTS, Astro-compatible)
   - Working directory: `./frontend` → `./frontend-astro`
   - Build step: `ng build --prod` → `npm run build`
   - Angular test steps removed
   - Removed Angular-specific build/deploy steps

2. **Netlify deployment script added**
   - `netlify:deploy:prod` script configured in `package.json` (in frontend-astro/)
   - Static output (`dist/`) targets Netlify CDN
   - Existing domain and deploy URL maintained (no breaking changes)

3. **Artifact handling updated**
   - GitHub Actions upload-artifact action: v3 (current stable)
   - Build artifacts stored for deployment verification

**Gate status:** Phase 4 complete. CI/CD pipeline ready for Astro static site deployment. Dallas and Parker both complete; ready for Phase 5 (testing + accessibility by Lambert).

### 2026-05-18 — Phase 4 Enhancement: Netlify Preview Deployments

✅ **COMPLETE**

**What was done:**

1. **Workflow trigger expanded**
   - Changed from `push: branches: [master]` to `push: branches: ['**']`
   - All feature branches now trigger CI/CD pipeline

2. **Preview deployment step added**
   - New step: `Deploy preview to Netlify (non-master branches)` 
   - Condition: `github.ref != 'refs/heads/master'`
   - Uses `netlify:deploy:preview` script (no --prod flag for draft mode)
   - Extracts draft deploy URL using `--json` flag and `jq`

3. **PR comment automation added**
   - New step: `Comment preview URL on PR`
   - Condition: `github.event_name == 'pull_request'`
   - Posts draft preview URL as PR comment
   - Safely skips plain branch pushes

4. **New npm script in package.json**
   - Added `netlify:deploy:preview` to `frontend-astro/package.json`
   - Deployed as draft (no --prod, reuses same NETLIFY_AUTH_TOKEN and NETLIFY_SITE_ID)

**Gate status:** Preview environment feature complete. Non-master branches now deploy as draft previews with PR comments. Prod deploy step unchanged.

### 2026-05-18 — GitHub Actions Artifact Deprecation Fix

✅ **COMPLETE**

**What was done:**

1. **Deprecated action identified and upgraded**
   - `actions/upload-artifact@v3` is deprecated and now fails in GitHub Actions
   - Upgraded to `actions/upload-artifact@v4` in `.github/workflows/CICD.yml` (line 33)

2. **Verification**
   - Scanned entire `.github/workflows/` directory for any `actions/download-artifact@v3` — none found
   - No other deprecated artifact actions detected

3. **Commit**
   - Commit SHA: 92c4935
   - Message: "fix: upgrade actions/upload-artifact v3 → v4"
   - CI/CD workflow now uses latest stable action, resolving deprecation warnings and failures

**Impact:** GitHub Actions builds will no longer fail due to deprecated upload-artifact action. Pipeline stability improved.

### 2026-05-18 — GitHub Actions Node.js 20 Deprecation Upgrade

✅ **COMPLETE**

**What was done:**

1. **Deprecated actions identified**
   - `actions/checkout@v3` runs on Node.js 20 (deprecated in GitHub Actions)
   - `actions/setup-node@v3` runs on Node.js 20 (deprecated in GitHub Actions)

2. **Actions upgraded**
   - Upgraded `actions/checkout@v3` → `actions/checkout@v4` (line 18)
   - Upgraded `actions/setup-node@v3` → `actions/setup-node@v4` (line 20)
   - v4 versions run on Node.js 24 (current LTS)

3. **Verification**
   - Scanned workflow for all `@v3` action references
   - `actions/upload-artifact@v4` and `actions/github-script@v7` already at current versions
   - No other deprecated action versions remain

4. **Commit**
   - Commit SHA: 0dae6f0
   - Message: "fix: upgrade actions/checkout and setup-node v3 → v4"
   - Node.js 20 actions deprecated; upgrading to v4 which runs on Node.js 24
   - Fixes GitHub Actions deprecation warnings

**Impact:** GitHub Actions workflow now runs on current Node.js version. Deprecation warnings resolved, improved CI/CD stability and security.
