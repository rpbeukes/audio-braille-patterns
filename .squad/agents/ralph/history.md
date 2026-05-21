# Project Context

- **Owner:** Ruan Beukes
- **Project:** Audio Braille Patterns — Angular → Astro + React migration
- **Site:** https://abp.beukesbunch.com/braille-patterns
- **Created:** 2026-05-18

## Core Context

Ralph monitors the work queue for the Audio Braille Patterns migration project.

## Learnings

### Test Library Rule (2026-05-21)

When adding any new testing library to `frontend-astro/`, always:
1. Add to `devDependencies` (npm does not auto-install peer deps in all environments)
2. Add to `vite.optimizeDeps.exclude` in `astro.config.mjs`

This prevents Vite from attempting to pre-bundle test-only utilities at dev startup.
