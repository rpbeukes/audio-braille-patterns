# Project Decisions Log

Audio Braille Patterns — Team decisions, all archived here.

---

## Decision: Upgrade GitHub Actions Artifact Deprecation

**Date:** 2026-05-18  
**Author:** Parker  
**Status:** ✅ Executed & Committed  
**Severity:** High (Pipeline Failure)

### Problem

`actions/upload-artifact@v3` was deprecated by GitHub Actions and now fails when the workflow runs. This breaks the CI/CD pipeline's ability to store build artifacts.

### Solution

**Single action required:** Upgrade `actions/upload-artifact@v3` → `@v4`

#### Changes Made

**File:** `.github/workflows/CICD.yml`  
**Line:** 33  
**Before:**
```yaml
- uses: actions/upload-artifact@v3
```
**After:**
```yaml
- uses: actions/upload-artifact@v4
```

**Verification:**
- Scanned entire `.github/workflows/` for any `actions/download-artifact@v3` — none found
- No other deprecated artifact actions detected

### Impact

- ✅ Pipeline deprecation warning eliminated
- ✅ Build artifacts continue to be stored reliably
- ✅ No breaking changes to workflow logic (v4 API is backward-compatible for our use case)
- ✅ No secrets or credentials affected

### Commit

**SHA:** `92c4935`  
**Message:** "fix: upgrade actions/upload-artifact v3 → v4"

### Decision

**Approved:** Executed immediately. No team consensus required for security/stability fixes.

### Recommendations

- Monitor GitHub Actions deprecation announcements for future version updates
- Consider automating dependency updates for GitHub Actions (GitHub Dependabot for workflows)

---

## Decision: Preview Deploy on Manual Workflow Dispatch

**Date:** 2026-05-18  
**Author:** Parker  
**Status:** ✅ Executed & Committed  
**Severity:** Standard

### Problem

Manual preview deployments required opening a PR. The developer workflow lacked a way to trigger a preview Netlify deployment directly from GitHub Actions on feature branches.

### Solution

Updated the "Deploy preview to Netlify" CI/CD step to trigger on manual `workflow_dispatch` events in addition to pull_request events, but only for non-master branches.

#### Changes Made

**File:** `.github/workflows/CICD.yml`  
**Line:** 47  
**Before:**
```yaml
if: github.event_name == 'pull_request'
```
**After:**
```yaml
if: (github.event_name == 'pull_request' || github.event_name == 'workflow_dispatch') && github.ref != 'refs/heads/master'
```

### Impact

- ✅ Manual preview deployments now possible on feature branches without opening PRs
- ✅ Improved developer workflow for testing preview builds
- ✅ Production branch (master) protected from manual dispatch previews
- ✅ "Comment preview URL on PR" step remains unchanged (only applies to pull_request events)

### Commit

**SHA:** `f7e202e`  
**Message:** "fix: run preview deploy on manual workflow_dispatch for non-master branches"

### Decision

**Approved:** Executed immediately. Non-breaking workflow enhancement.

---

# Decision: Add netlify-cli to devDependencies

**Date:** 2026-05-18  
**Author:** Parker (DevOps)  
**Status:** ✅ Applied

## Problem

CI step "Deploy preview to Netlify (non-master branches)" failed with:

```
sh: 1: netlify: not found
Error: Process completed with exit code 127.
```

The `netlify:deploy:prod` and `netlify:deploy:preview` npm scripts call the `netlify` binary directly, but `netlify-cli` was not listed in `devDependencies`. The CI's `npm install` step therefore never installed it, leaving the binary absent on the runner.

## Decision

Add `netlify-cli` to `devDependencies` in `frontend-astro/package.json` so the existing `npm install` step in CICD.yml installs it automatically. No separate install step is needed in the workflow.

## Side Effect: Peer Dependency Conflict

`netlify-cli@^26.0.2` requires `@opentelemetry/api@^1.8.0`, while `vitest@^4.1.6` has an optional peer requirement of `@opentelemetry/api@^1.9.0`. npm refuses to resolve this without a flag.

**Fix:** Added `frontend-astro/.npmrc` with `legacy-peer-deps=true`. This is scoped to the `frontend-astro/` working directory and does not affect the rest of the repo. It is the standard npm mechanism for resolving transitive peer conflicts without forcing or overriding specific versions.

## Affected Files

- `frontend-astro/package.json` — `netlify-cli` added to `devDependencies`
- `frontend-astro/package-lock.json` — updated
- `frontend-astro/.npmrc` — new file, `legacy-peer-deps=true`

## Commit

`73bcbc1` — `fix: add netlify-cli to devDependencies so CI can deploy`

---


## Decision: Write Netlify Preview URL to GitHub Actions Job Summary

Hub Actions Job Summary

**Date:** 2026-05-18  
**Author:** Parker (DevOps)  
**Status:** ✅ Implemented

## Context

After a preview deploy runs (via PR or `workflow_dispatch`), the Netlify draft URL was only visible inside the Netlify dashboard. Ruan requested the URL appear directly in the GitHub Actions UI without requiring a Netlify login.

## Decision

Add a step to `.github/workflows/CICD.yml` that writes a formatted markdown block — including branch name, short commit SHA, and a clickable preview link — to `$GITHUB_STEP_SUMMARY` after every successful preview deploy.

## Rationale

- `$GITHUB_STEP_SUMMARY` renders markdown in the workflow run's "Summary" tab — no extra tools, tokens, or dashboards needed.
- The step reuses the existing `steps.netlify_preview.outputs.deploy_url` output; no new secrets or scripts required.
- The same `if:` condition as the deploy step ensures it only runs for preview scenarios (PR or `workflow_dispatch`, non-master).
- PR comments (existing step) continue to work; job summary is additive, not a replacement.

## Affected Files

- `.github/workflows/CICD.yml` — new step inserted between deploy step and PR comment step

---

## Decision: Exclude Testing Libraries from Vite Optimizer

**Date:** 2026-05-21  
**Author:** Dallas  
**Status:** ✅ Implemented

## Context

`npm run dev` in `frontend-astro/` was failing with:

```
✘ [ERROR] Could not resolve "@testing-library/dom"
    node_modules/@testing-library/react/dist/@testing-library/react.esm.js:5:126
```

Vite's dependency pre-bundler (esbuild optimizer) runs at dev server startup and attempts to bundle all imported packages — including `@testing-library/react`. This package declares `@testing-library/dom` as a required peer dependency, and when Vite tried to resolve it, it was missing from `node_modules`.

## Root Causes

1. `@testing-library/dom` was not listed in `devDependencies` despite being a required peer of `@testing-library/react@^16.3.2`.
2. Test libraries should never be pre-bundled by Vite — they are used exclusively by Vitest/jsdom and are never loaded in the browser.

## Decision

**Testing libraries (`@testing-library/*`) are explicitly excluded from Vite's `optimizeDeps` in `astro.config.mjs`.**

```js
vite: {
  optimizeDeps: {
    exclude: ['@testing-library/react', '@testing-library/dom', '@testing-library/jest-dom'],
  },
},
```

**Additionally, `@testing-library/dom` must be kept as an explicit `devDependency`** even though it's a peer dep — npm does not auto-install peer deps in all environments.

## Why

Vite's optimizer is designed for browser-loaded dependencies. Test libraries run in a Node/jsdom environment under Vitest and have no business being in the browser bundle. Excluding them:
- Prevents Vite from resolving test-only transitive dependencies at dev startup
- Keeps the dev server startup lean
- Makes the intent explicit: test libs are test-only

## Affected Files

- `frontend-astro/package.json` — added `@testing-library/dom` to `devDependencies`
- `frontend-astro/astro.config.mjs` — added `vite.optimizeDeps.exclude`

## Rule Going Forward

When adding any new testing library to this project, also add it to `vite.optimizeDeps.exclude` in `astro.config.mjs`.

