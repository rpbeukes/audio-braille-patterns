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
