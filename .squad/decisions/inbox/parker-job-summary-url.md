# Decision: Write Netlify Preview URL to GitHub Actions Job Summary

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
