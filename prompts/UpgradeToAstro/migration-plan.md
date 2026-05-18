# Angular → Astro + React Migration Plan
## Audio Braille Patterns

**Author:** Ripley (Lead)  
**Date:** 2026-05-18  
**Site:** https://abp.beukesbunch.com/braille-patterns  
**Repo:** https://github.com/rpbeukes/audio-braille-patterns  

---

## Executive Summary

The Audio Braille Patterns site is a small Angular 9 app with **two routes**, **one data file** (5 hardcoded braille pattern entries), and **no backend services**. It is almost entirely static content, making it an ideal Astro migration candidate. The only interactive element is the mobile sidebar toggle — everything else can be rendered at build time as static HTML.

Astro's zero-JS-by-default model is a perfect match: the pattern table, About page, layout, and navigation can all ship as pure HTML. React islands are needed only for the sidebar toggle. The result will be a faster, lighter, more accessible site — important given its audience.

---

## Current App Inventory

### Routes
| Angular Route | Component | Notes |
|---|---|---|
| `/` | → redirects to `/braille-patterns` | Root redirect |
| `/braille-patterns` | `BraillePatternsComponent` | Main data table (lazy-loaded module) |
| `/about` | `AboutComponent` | Static text page |

### Components
| Component | File | Purpose | Interactivity |
|---|---|---|---|
| `AppComponent` | `src/app/app.component.ts` | Root shell; Google Analytics router tracking | None (just `<router-outlet>`) |
| `LayoutComponent` | `src/app/layout/layout.component.ts` | Shell with topnav + sidebar + outlet | None |
| `TopnavComponent` | `src/app/layout/components/topnav/topnav.component.ts` | Fixed Material toolbar; mobile hamburger toggle | **Yes** — toggles `push-right` class on `<body>` |
| `SidebarComponent` | `src/app/layout/components/sidebar/sidebar.component.ts` | Fixed left nav with 2 links | Minimal — `showMenu` string state, `addExpandClass` (unused) |
| `BraillePatternsComponent` | `src/app/layout/braillePatterns/braille-patterns.component.ts` | Material table of patterns | None — filter method (`applyFilter`) is defined but **not wired to any input in the template** |
| `AboutComponent` | `src/app/layout/about/about.component.ts` | Static text about the project | None |

### Data
| File | Content |
|---|---|
| `src/app/layout/braillePatterns/braillePattterns.ts` | `BraillePatternLine` interface + `BraillePatternLines` array (5 entries). Fields: `name`, `position`, `pictureUrl?`, `audioUrl` (YouTube), `blogContentUrl?` |

**5 Braille Pattern Entries:**
1. Tow truck
2. Valentine's heart
3. Santa Claus
4. Hello Kitty with Santa hat
5. Flower in pot

### Assets
| Path | Content |
|---|---|
| `src/assets/pattern-images/` | 5 PNG files: `braille_tow_truck.png`, `ValentineHeart.png`, `braille_santa.png`, `hello_kitty_braille_design.png`, `Flowerpot.png` |
| `src/assets/fonts/` | Custom fonts |
| `src/favicon.ico` | Site favicon |

### Styles
| File | Purpose |
|---|---|
| `src/styles/_main.scss` | Base layout: sidebar offset, main-container positioning |
| `src/styles/_material.scss` | Angular Material theme |
| `src/styles/_responsive.scss` | Breakpoint at 992px — sidebar show/hide |
| `src/styles/_utils.scss` | Utilities |

### External Dependencies
| Dependency | Purpose | Migration action |
|---|---|---|
| `@angular/material` | UI components (table, toolbar, sidenav, icons, list) | Replace with plain HTML/CSS or a lightweight alternative |
| `@angular/flex-layout` | Responsive flex utilities | Replace with CSS Flexbox/Grid |
| Google Fonts Material Icons CDN | `volume_up`, `brightness_auto`, `menu` icons | Keep CDN link in layout, or switch to `@iconify-icon/react` |
| Iconify CDN script | Braille icon (`mdi-braille`) in sidebar | Replace with `@iconify/react` React component or inline SVG |
| Google Analytics | `G-MGPH9L7VJC` (gtag) + `UA-123740081-4` (router tracking) | Migrate to Astro layout `<head>` |
| `rxjs` | Only used for router events (GA tracking) | Not needed in Astro |
| `zone.js` | Angular change detection | Not needed |

### Deploy
- **Host:** Netlify
- **CI:** GitHub Actions (`.github/workflows/CICD.yml`) — builds from `./frontend`, deploys to Netlify on push to `master`
- **Netlify SPA redirect:** `_redirects`: `/* /index.html 200`
- **Security headers:** `_headers`: X-XSS-Protection, X-Frame-Options, X-Content-Type-Options, Referrer-Policy

---

## Migration Architecture Decisions

### 1. Astro Islands — What Needs React vs What Doesn't

| Element | Strategy | Reason |
|---|---|---|
| Pattern table | Static Astro component | Data is hardcoded; sort happens at build time |
| About page | Static Astro page | Pure static text |
| Layout / page shell | Astro layout component | No client state |
| Topnav | Astro component + **React island** (`client:load`) | Needs DOM interaction for sidebar toggle |
| Sidebar | Astro component + **React island** (`client:load`) | Needs active-link state + open/close state |

The sidebar toggle in Angular directly manipulates `document.querySelector('body').classList.toggle('push-right')`. This will be replaced with a clean React island that manages open/close state via `useState`, passing the toggle function via props or a shared context.

### 2. New Project Location

Create a new `frontend-astro/` directory alongside the existing `frontend/`. This preserves the working Angular app during migration. Parker can swap the CICD build path once Phase 4 is complete and validated.

### 3. No React Router Needed

Astro's file-based routing replaces the Angular Router entirely. No `react-router-dom` dependency.

### 4. Data Strategy

No API, no CMS. The `BraillePatternLines` array moves to `frontend-astro/src/data/braille-patterns.ts` as a plain TypeScript data module. Astro can import it at build time.

### 5. Styling Strategy

Drop Angular Material and `@angular/flex-layout`. Replace with:
- Scoped Astro/React CSS for components
- Native CSS Flexbox/Grid (already used in the patterns, we just lose the Material wrapper)
- Retain Material Icons via CDN for icons (or migrate to `@iconify-icon/react`)

---

## Phase 0 — Astro Project Scaffold

**Owner:** Dallas (component migration) / Ripley (review)  
**Deliverable:** Working Astro + React skeleton at `frontend-astro/`

### Steps

1. **Scaffold Astro project:**
   ```bash
   cd C:\Repos\audio-braille-patterns
   npm create astro@latest frontend-astro -- --template minimal --typescript strict --no-git
   ```

2. **Add React integration:**
   ```bash
   cd frontend-astro
   npx astro add react
   ```

3. **Verify `astro.config.mjs`** includes React integration:
   ```js
   import { defineConfig } from 'astro/config';
   import react from '@astrojs/react';

   export default defineConfig({
     integrations: [react()],
     output: 'static',
   });
   ```

4. **Configure `tsconfig.json`** — ensure strict mode + React JSX:
   ```json
   {
     "extends": "astro/tsconfigs/strict",
     "compilerOptions": {
       "jsx": "react-jsx",
       "jsxImportSource": "react"
     }
   }
   ```

5. **Create directory structure:**
   ```
   frontend-astro/
   ├── public/
   │   ├── favicon.ico
   │   ├── _redirects
   │   ├── _headers
   │   └── pattern-images/   ← copy from frontend/src/assets/pattern-images/
   ├── src/
   │   ├── data/
   │   │   └── braille-patterns.ts
   │   ├── components/
   │   │   ├── Topnav.astro
   │   │   ├── Sidebar.astro
   │   │   └── SidebarToggle.tsx   ← React island
   │   ├── layouts/
   │   │   └── Layout.astro
   │   └── pages/
   │       ├── index.astro          ← redirect to /braille-patterns
   │       ├── braille-patterns.astro
   │       └── about.astro
   └── package.json
   ```

6. **Install dependencies:**
   ```bash
   npm install @iconify/react
   ```

**Gate:** `npm run dev` starts with no errors. Empty pages render with no JS errors.

---

## Phase 1 — Content / Data Migration

**Owner:** Dallas  
**Deliverable:** Data file and static assets in place

### Steps

1. **Copy `braillePattterns.ts` → `src/data/braille-patterns.ts`:**
   - Fix the typo in filename (`braillePattterns` → `braille-patterns`)
   - Rename the interface export to `BraillePattern` (cleaner)
   - Sort the data at the data layer (remove sort from component)
   - Assign positions at the data layer too
   - Ensure `audioUrl` values are real YouTube links (they already are)

   ```ts
   // src/data/braille-patterns.ts
   export interface BraillePattern {
     position: number;
     name: string;
     pictureUrl?: string;
     audioUrl: string;
     blogContentUrl?: string;
   }

   export const braillePatterns: BraillePattern[] = [
     {
       name: 'Flower in pot',
       blogContentUrl: 'https://www.pathstoliteracy.org/strategies/braille-designs-spring',
       pictureUrl: '/pattern-images/Flowerpot.png',
       audioUrl: 'https://youtu.be/e3czv4-QUKg',
     },
     {
       name: 'Hello Kitty with Santa hat',
       blogContentUrl: 'https://www.pathstoliteracy.org/strategies/braille-design-hello-kitty',
       pictureUrl: '/pattern-images/hello_kitty_braille_design.png',
       audioUrl: 'https://youtu.be/5srLaZP7q8s',
     },
     {
       name: 'Santa Claus',
       blogContentUrl: 'https://www.pathstoliteracy.org/strategies/braille-designs-christmas',
       pictureUrl: '/pattern-images/braille_santa.png',
       audioUrl: 'https://youtu.be/UTI7h2HeuFI',
     },
     {
       name: 'Tow truck',
       blogContentUrl: 'https://www.pathstoliteracy.org/strategies/tow-truck-braille-design',
       pictureUrl: '/pattern-images/braille_tow_truck.png',
       audioUrl: 'https://youtu.be/qRyK6Dqu6-c',
     },
     {
       name: "Valentine's heart",
       blogContentUrl: 'https://www.pathstoliteracy.org/strategies/braille-designs-valentines-day',
       pictureUrl: '/pattern-images/ValentineHeart.png',
       audioUrl: 'https://youtu.be/_zZO-N4Qsj8',
     },
   ].map((p, i) => ({ ...p, position: i + 1 }));
   ```
   
   > Note: Data is sorted alphabetically at definition time (matching the `ngOnInit` sort behaviour in the Angular component).

2. **Copy assets to `public/`:**
   - `frontend/src/assets/pattern-images/` → `frontend-astro/public/pattern-images/`
   - `frontend/src/favicon.ico` → `frontend-astro/public/favicon.ico`
   - `frontend/src/assets/fonts/` → `frontend-astro/public/fonts/` (if any font files exist)

3. **Copy Netlify config files to `public/`:**
   - `frontend/src/_redirects` → `frontend-astro/public/_redirects` (update contents — see Phase 4)
   - `frontend/src/_headers` → `frontend-astro/public/_headers` (keep security headers, verify syntax)

**Gate:** Data file imports without TypeScript errors. Images load at `http://localhost:4321/pattern-images/braille_tow_truck.png`.

---

## Phase 2 — Component Migration

**Owner:** Dallas  
**Deliverable:** All 6 Angular components replaced with Astro/React equivalents

### 2.1 — Layout (`src/layouts/Layout.astro`)

Replaces: `AppComponent`, `LayoutComponent`, and `index.html`

```astro
---
// src/layouts/Layout.astro
export interface Props { title?: string; }
const { title = 'Audio Braille Patterns Voice Recordings' } = Astro.props;
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>{title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-MGPH9L7VJC"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-MGPH9L7VJC');
  </script>
</head>
<body>
  <Topnav />
  <Sidebar currentPath={Astro.url.pathname} />
  <main class="main-container">
    <slot />
  </main>
</body>
</html>
```

> **Note:** The Angular app tracked page views for both `G-MGPH9L7VJC` (GA4) and `UA-123740081-4` (Universal Analytics). UA was sunset by Google in 2023 — only migrate the GA4 tag (`G-MGPH9L7VJC`).

### 2.2 — Topnav + Sidebar Toggle React Island

Replaces: `TopnavComponent` + its DOM manipulation sidebar toggle

**`src/components/SidebarToggle.tsx`** (React island):
```tsx
import { useState } from 'react';

export default function SidebarToggle() {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen(o => !o);
    document.getElementById('sidebar')?.classList.toggle('open');
  };

  return (
    <button
      type="button"
      aria-label="Toggle navigation menu"
      aria-expanded={open}
      className="sidebar-toggle-btn"
      onClick={toggle}
    >
      <span className="material-icons">menu</span>
    </button>
  );
}
```

**`src/components/Topnav.astro`**:
```astro
---
import SidebarToggle from './SidebarToggle.tsx';
---
<header class="topnav fix-nav">
  <SidebarToggle client:load />
  <div class="nav-brand">
    <span>Audio Braille Patterns Voice Recordings</span>
  </div>
</header>
```

### 2.3 — Sidebar (`src/components/Sidebar.astro`)

Replaces: `SidebarComponent`

```astro
---
export interface Props { currentPath: string; }
const { currentPath } = Astro.props;
import { Icon } from '@iconify/react';
---
<nav id="sidebar" aria-label="Main navigation">
  <ul>
    <li>
      <a
        href="/braille-patterns"
        class:list={[{ active: currentPath.includes('braille-patterns') }]}
        aria-current={currentPath.includes('braille-patterns') ? 'page' : undefined}
      >
        <!-- Inline braille SVG or @iconify/react -->
        Braille Patterns
      </a>
    </li>
    <li>
      <a
        href="/about"
        class:list={[{ active: currentPath === '/about' }]}
        aria-current={currentPath === '/about' ? 'page' : undefined}
      >
        <span class="material-icons" aria-hidden="true">brightness_auto</span> About
      </a>
    </li>
  </ul>
</nav>
```

> The `class:list` directive replaces Angular's `[routerLinkActive]`. `aria-current="page"` replaces the visual-only active class with a semantically correct accessibility attribute — important for this accessibility-focused site.

### 2.4 — Braille Patterns Page (`src/pages/braille-patterns.astro`)

Replaces: `BraillePatternsComponent`

```astro
---
import Layout from '../layouts/Layout.astro';
import { braillePatterns } from '../data/braille-patterns';
---
<Layout title="Braille Patterns — Audio Braille Patterns">
  <table class="patterns-table">
    <thead>
      <tr>
        <th scope="col">No.</th>
        <th scope="col">Name</th>
        <th scope="col">Pattern</th>
        <th scope="col">Audio</th>
      </tr>
    </thead>
    <tbody>
      {braillePatterns.map(pattern => (
        <tr>
          <td>{pattern.position}</td>
          <td>
            {pattern.blogContentUrl
              ? <a href={pattern.blogContentUrl} target="_blank" rel="noopener">{pattern.name}</a>
              : pattern.name}
          </td>
          <td class="pattern-cell">
            {pattern.pictureUrl
              ? <img src={pattern.pictureUrl} alt={`Braille pattern for ${pattern.name}`} width="64" />
              : <span>Not Available</span>}
          </td>
          <td>
            <a
              href={pattern.audioUrl}
              target="_blank"
              rel="noopener"
              aria-label={`Open audio instructions for ${pattern.name}`}
            >
              <span class="material-icons" aria-hidden="true">volume_up</span>
            </a>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</Layout>
```

> The `blogContentUrl` field is not displayed in the Angular table — this plan adds it as a link on the pattern name, which is an improvement. **Confirm with Ruan** if this is desired.
> 
> The `alt` text on images is improved: `alt=""` in Angular (empty) → `alt="Braille pattern for {name}"` — critical for screen reader users on an accessibility-focused site.

### 2.5 — About Page (`src/pages/about.astro`)

Replaces: `AboutComponent`

```astro
---
import Layout from '../layouts/Layout.astro';
---
<Layout title="About — Audio Braille Patterns">
  <article>
    <h1>About us...</h1>
    <p>
      Our blind daughter likes doing
      <a href="https://www.pathstoliteracy.org/strategies/just-fun-braille-designs" target="_blank" rel="noopener">braille patterns</a>
      for fun. Not only is this a fun activity, it also helps with her braille literacy.
    </p>
    <p>She is not really fond of screen-readers and we have to read the instructions to her, which makes her feel very dependant.</p>
    <p>In an attempt to change that, we created voice recordings with the braille pattern instructions. She loves the human voice, especially her mom's, instead of the robot screen-reader.</p>
    <p>This website will list all the audio braille pattern voice recordings with the hope other kids will enjoy it too. Of course big kids (adults) are welcome too :)</p>
    <p>This site was created with love for our blind community.</p>
    <p>Have fun!</p>
    <p>PS: For more detail on our family, feel free to read our daughter's <a href="https://genique.beukesbunch.com/2016/genique-s-story/" target="_blank" rel="noopener">story</a>.</p>
    <p>PPS: For feedback, issues and contributions, please go to GitHub: <a href="https://github.com/rpbeukes/audio-braille-patterns/" target="_blank" rel="noopener">https://github.com/rpbeukes/audio-braille-patterns</a></p>
  </article>
</Layout>
```

### 2.6 — Root Index Redirect (`src/pages/index.astro`)

Replaces: Angular router's `redirectTo: 'braille-patterns'`

```astro
---
return Astro.redirect('/braille-patterns');
---
```

**Gate:** Both pages render in dev server. Sidebar highlights correct page. Mobile toggle opens/closes sidebar. Images load.

---

## Phase 3 — Routing and Page Structure

**Owner:** Dallas  
**Deliverable:** All routes work, including 404 handling

### Steps

1. **Verify Astro file-based routes** match Angular routes:
   | Old Angular route | New Astro file |
   |---|---|
   | `/` → `/braille-patterns` | `src/pages/index.astro` (redirect) |
   | `/braille-patterns` | `src/pages/braille-patterns.astro` |
   | `/about` | `src/pages/about.astro` |

2. **Add 404 page:** `src/pages/404.astro` — simple "Page not found" with link back to Braille Patterns.

3. **Update `public/_redirects`** for Netlify:
   - Remove the SPA catch-all (`/* /index.html 200`) — not needed for static Astro output
   - Add a redirect if needed for any old Angular URLs that users may have bookmarked:
     ```
     /braille-patterns  /braille-patterns/  301
     ```
   - Astro static output generates `/braille-patterns/index.html` — confirm Netlify serves this correctly (it does by default).

4. **Confirm `base` config** is not needed — the site serves from root of `abp.beukesbunch.com`, not a subdirectory. If it is a subdirectory, set `base: '/braille-patterns'` in `astro.config.mjs` and update all asset paths.

   > **Decision needed from Ruan:** Does the Netlify site serve from the root (`abp.beukesbunch.com`) or from a subdirectory? The current `<base href="/">` suggests root, but the public URL shows `/braille-patterns` as the default route. This affects Astro's `base` config.

**Gate:** All three routes return 200. Root `/` redirects to `/braille-patterns`. `/nonexistent` returns the 404 page.

---

## Phase 4 — Build / Deploy

**Owner:** Parker  
**Deliverable:** Updated CICD pipeline deploys Astro site to Netlify

### Required Changes to `.github/workflows/CICD.yml`

1. **Change `working-directory`** from `./frontend` to `./frontend-astro`

2. **Update Node version** — Astro requires Node 18+. Change:
   ```yaml
   node-version: 16
   ```
   to:
   ```yaml
   node-version: 20
   ```

3. **Remove Angular-specific steps:**
   - Remove: `npm run ngVersion`
   - Remove: `ngcc` postinstall (not in Astro)

4. **Update build command** — Astro builds with `npm run build` (same command, different output):
   - Angular outputs to `./frontend/dist`
   - Astro outputs to `./frontend-astro/dist`

5. **Update artifact path:**
   ```yaml
   path: ./frontend-astro/dist
   ```

6. **Update Netlify deploy path:**
   ```yaml
   run: npm run netlify:deploy:prod -- --message "..."
   working-directory: ./frontend-astro
   ```
   - Verify `package.json` `netlify:deploy:prod` script points to correct `--dir ./dist`

7. **Update `public/_headers`** — copy existing security headers from `frontend/src/_headers` verbatim. They are not Angular-specific and apply equally to Astro output.

### Netlify-Specific Notes
- Astro static output is fully compatible with Netlify's CDN — no Netlify adapter needed unless SSR is added later
- The Netlify site ID and auth token secrets remain unchanged
- Netlify `_redirects` and `_headers` files must be in `public/` for Astro to copy them to `dist/`

**Gate:** Push to feature branch triggers CI. Build completes. Draft Netlify deploy succeeds. Site loads at Netlify preview URL.

---

## Phase 5 — Testing and Accessibility Validation

**Owner:** Lambert  
**Deliverable:** Passing test suite + accessibility audit

### Testing

1. **Remove Angular test infrastructure** (not needed in new project):
   - `karma.conf.js`, `src/test.ts`, `e2e/`, `protractor.conf.js`
   - Jasmine/Karma/Protractor deps

2. **Add Vitest** for unit tests (Astro-compatible):
   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom
   ```

3. **Test coverage priorities:**
   - `src/data/braille-patterns.ts` — verify all 5 entries have required fields, positions are sequential, sorted alphabetically
   - `SidebarToggle.tsx` — toggle opens/closes sidebar
   - Route redirects — root → `/braille-patterns`

4. **Add Playwright for E2E** (replaces Protractor):
   ```bash
   npm install -D @playwright/test
   ```
   - Test: braille patterns table renders all 5 rows
   - Test: each audio link has correct `aria-label`
   - Test: About page loads and contains expected content
   - Test: mobile sidebar toggle works

### Accessibility Validation (Critical — this site serves blind users)

5. **Verify all `aria-label` attributes** on audio links are preserved — current Angular template has:
   ```html
   [attr.aria-label]="'Open audio instructions for ' + element.name"
   ```
   This **must** be in the Astro output. Confirm with axe-core or Lighthouse.

6. **Add `alt` text to pattern images** — current Angular template uses `[src]` binding with no `alt` attribute. New Astro template adds `alt="Braille pattern for {name}"`. Verify no empty `alt` on images.

7. **Run axe-core accessibility audit:**
   ```bash
   npx @axe-core/cli http://localhost:4321/braille-patterns
   ```
   Minimum target: **zero critical violations**.

8. **Run Lighthouse** on both pages:
   - Target: Accessibility score ≥ 95
   - Performance score ≥ 90 (Astro static output should easily hit this)

9. **Keyboard navigation test:**
   - Tab through all interactive elements (sidebar links, audio links, topnav)
   - Sidebar toggle is keyboard-operable (button element, not div)
   - All links have visible focus indicators

10. **Screen reader test** (if possible): test with NVDA or JAWS that the pattern table is navigable and audio link labels are announced correctly.

**Gate:** Zero critical axe violations. Lighthouse accessibility ≥ 95. All Playwright E2E tests pass.

---

## Risk Register

| Risk | Severity | Notes |
|---|---|---|
| **Base URL / subdirectory deploy** | 🔴 High | Unclear if site deploys from root or subdirectory. If subdirectory (`/braille-patterns`), Astro `base` config must be set and all asset paths updated. **Confirm with Ruan before Phase 3.** |
| **UA-123740081-4 analytics** | 🟡 Medium | Universal Analytics was shut down by Google in July 2023. The Angular app has two GA tags — only GA4 (`G-MGPH9L7VJC`) should be migrated. The UA tag should be dropped. |
| **Image `alt` text gap** | 🟡 Medium | Angular template uses `[src]` binding with no `alt` attribute — images have no alt text currently. The Astro migration adds proper alt text. Verify this doesn't break any existing behaviour. |
| **`blogContentUrl` field not shown in current UI** | 🟢 Low | The field exists in the data but is not displayed in the Angular table. The migration plan proposes linking pattern names to blog URLs. Confirm with Ruan this is desired. |
| **`applyFilter` method dead code** | 🟢 Low | The `applyFilter` method in `BraillePatternsComponent` is defined but not wired to any input. It is not being migrated — there is no filter UI. If filtering is desired in future, it can be added as a React island. |
| **Material Icons CDN** | 🟢 Low | The Material Icons CDN is kept. If the site needs to work offline or reduce external dependencies, switch to a local icon solution. |
| **Iconify `mdi-braille` icon** | 🟢 Low | Currently loaded via CDN script. Replace with `@iconify/react` React component in `Sidebar.astro` (or inline SVG). The CDN approach is fragile. |
| **Node 16 → 20 upgrade** | 🟢 Low | Parker needs to update Node version in CI. Astro requires Node ≥ 18. Not a migration risk, just a CI change. |

---

## Decisions Needed from Ruan

1. **Base URL:** Is the site deployed at the root of `abp.beukesbunch.com` (i.e., `https://abp.beukesbunch.com/`) or in a subdirectory? The current public URL `https://abp.beukesbunch.com/braille-patterns` is the Angular default route, not a subdirectory — but this needs confirming.

2. **Pattern name links:** Should pattern names link to their `blogContentUrl` (pathstoliteracy.org) in the new table? The data has this field but the Angular UI does not use it.

3. **Filter UI:** The Angular code has an `applyFilter` method that was never wired up. Do you want a search/filter input added to the Braille Patterns page in the Astro version?

4. **`frontend` directory fate:** After the Astro migration is verified and deployed, should the old `frontend/` Angular directory be deleted, or archived? Recommend deleting once deployment is confirmed stable.

---

## Sequencing and Team Assignments

| Phase | Owner | Depends On |
|---|---|---|
| Phase 0: Scaffold | Dallas | — |
| Phase 1: Data / Assets | Dallas | Phase 0 |
| Phase 2: Components | Dallas | Phase 1 |
| Phase 3: Routing | Dallas | Phase 2 |
| Phase 4: Build/Deploy | Parker | Phase 0 (can start in parallel on CI changes) |
| Phase 5: Testing / A11y | Lambert | Phase 3 |

Ripley reviews and gates each phase before the next begins.

---

## Definition of Done

- [ ] All Angular routes (`/`, `/braille-patterns`, `/about`) resolve correctly in the Astro build
- [ ] All 5 braille pattern entries display with correct images, names, and audio links
- [ ] `aria-label` on every audio link is present and correct
- [ ] Mobile sidebar toggle works (opens/closes sidebar)
- [ ] Google Analytics GA4 tag is present and firing
- [ ] Netlify deploy succeeds from GitHub Actions on push to `master`
- [ ] Lighthouse accessibility score ≥ 95 on both pages
- [ ] Zero critical axe-core violations
- [ ] Old `frontend/` Angular code removed (after confirmation)
