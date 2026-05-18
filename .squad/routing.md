# Work Routing

How to decide who handles what.

## Routing Table

| Work Type | Route To | Examples |
|-----------|----------|----------|
| Migration architecture, upgrade strategy, breaking changes | Ripley | Plan migration phases, analyze Angular → Astro differences, sequence work |
| Astro components, React UI, YouTube embeds, styling | Dallas | Build Astro pages, React components, braille pattern listings |
| Build pipeline, CI/CD, deployment, hosting config | Parker | Netlify/Vercel config, GitHub Actions, environment setup |
| Testing, accessibility checks, quality gates | Lambert | Component tests, a11y audits, regression checks, visual diffs |
| Code review | Ripley | Review PRs, check quality, gate releases |
| Scope & priorities | Ripley | What to migrate next, trade-offs, decisions |
| Session logging | Scribe | Automatic — never needs routing |

## Issue Routing

| Label | Action | Who |
|-------|--------|-----|
| `squad` | Triage: analyze issue, assign `squad:{member}` label | Ripley |
| `squad:ripley` | Pick up issue and complete the work | Ripley |
| `squad:dallas` | Pick up issue and complete the work | Dallas |
| `squad:lambert` | Pick up issue and complete the work | Lambert |
| `squad:parker` | Pick up issue and complete the work | Parker |

### How Issue Assignment Works

1. When a GitHub issue gets the `squad` label, **Ripley** triages it — analyzing content, assigning the right `squad:{member}` label, and commenting with triage notes.
2. When a `squad:{member}` label is applied, that member picks up the issue in their next session.
3. Members can reassign by removing their label and adding another member's label.
4. The `squad` label is the "inbox" — untriaged issues waiting for Lead review.

## Rules

1. **Eager by default** — spawn all agents who could usefully start work, including anticipatory downstream work.
2. **Scribe always runs** after substantial work, always as `mode: "background"`. Never blocks.
3. **Quick facts → coordinator answers directly.** Don't spawn an agent for "what port does the server run on?"
4. **When two agents could handle it**, pick the one whose domain is the primary concern.
5. **"Team, ..." → fan-out.** Spawn all relevant agents in parallel as `mode: "background"`.
6. **Anticipate downstream work.** If a component is being migrated, Lambert can write test cases from requirements simultaneously.
7. **Issue-labeled work** — when a `squad:{member}` label is applied to an issue, route to that member. Ripley handles all `squad` (base label) triage.
