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
