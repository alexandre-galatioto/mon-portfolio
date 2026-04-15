# Phase 1: Foundation - Pattern Map

**Mapped:** 2026-04-15
**Files analyzed:** 10 new files
**Analogs found:** 0 / 10 — greenfield project, no existing source code

---

## Greenfield Notice

This is a brand-new Astro project. Only `public/fonts/` exists in the working directory — no `src/`, no `package.json`, no `astro.config.*`. There are zero codebase analogs to extract from. All patterns below are sourced from Astro official documentation best practices and the contracts established in `01-CONTEXT.md` and `01-UI-SPEC.md`.

---

## File Classification

| New File | Role | Data Flow | Closest Analog | Match Quality |
|----------|------|-----------|----------------|---------------|
| `astro.config.mjs` | config | static | none | no analog |
| `package.json` | config | static | none | no analog |
| `src/content/config.ts` | config / schema | static | none | no analog |
| `src/content/projects/sample-project.md` | content | static | none | no analog |
| `src/content/about/index.md` | content | static | none | no analog |
| `src/layouts/BaseLayout.astro` | layout | request-response | none | no analog |
| `src/components/Nav.astro` | component | event-driven | none | no analog |
| `src/styles/tokens.css` | utility / config | static | none | no analog |
| `src/styles/global.css` | utility / config | static | none | no analog |
| `src/pages/index.astro` | page (stub) | request-response | none | no analog |

---

## Pattern Assignments

### `astro.config.mjs` (config, static)

**Analog:** none — use Astro official scaffold pattern

**Core pattern:**
```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',      // PERF-02: pure static output, zero client-side JS bundle
});
```

**Notes:**
- `output: 'static'` is mandatory (PERF-02, REQUIREMENTS.md)
- No integrations in Phase 1 — no React, Tailwind, or adapters
- `site` field can be added in Phase 3 when the deployment URL is known

---

### `package.json` (config, static)

**Analog:** none — standard Astro scaffold

**Core pattern:**
```json
{
  "name": "portfolio",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^4.x"
  }
}
```

**Notes:**
- No extra dependencies in Phase 1 — vanilla CSS, no component libraries (D-04)
- `"type": "module"` required for `.mjs` config

---

### `src/content/config.ts` (config / schema, static)

**Analog:** none — use Astro content collections API

**Core pattern:**
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    cover:       z.string(),
    images:      z.array(z.string()),
    order:       z.number(),
    liveUrl:     z.string().url().optional(),
    featured:    z.boolean().default(false),
  }),
});

const about = defineCollection({
  type: 'content',
  schema: z.object({}),   // no required front matter — body is the content
});

export const collections = { projects, about };
```

**Notes:**
- Schema fields map exactly to D-09 in CONTEXT.md
- `cover` and `images` are kept as separate fields per D-10
- `featured` defaults to `false` per D-09; rendering logic is Phase 2 scope
- `about` collection has an empty schema — bio lives entirely in the Markdown body (D-11)
- File must be at `src/content/config.ts` — this exact path is the Astro convention; any other path is ignored

---

### `src/content/projects/sample-project.md` (content, static)

**Analog:** none — representative placeholder content

**Core pattern:**
```markdown
---
title: "Sample Project"
description: "A short description of this project, one to two sentences."
cover: "/images/projects/sample/cover.jpg"
images:
  - "/images/projects/sample/01.jpg"
  - "/images/projects/sample/02.jpg"
  - "/images/projects/sample/03.jpg"
order: 1
liveUrl: "https://example.com"
featured: false
---

Extended project description can go here if needed by Phase 2 pages.
```

**Notes:**
- Image paths use `/images/...` rooted at `public/` — actual images are added by the developer
- `liveUrl` is optional; the sample includes it; a second sample file should omit it to exercise PROJ-05
- `order: 1` — lowest value appears first on home page (CONT-03)

---

### `src/content/about/index.md` (content, static)

**Analog:** none

**Core pattern:**
```markdown
---
---

Alexandre Galatioto is an art director with 10+ years of experience across brand, editorial, and digital projects.

[LinkedIn](https://linkedin.com/in/username) · [Instagram](https://instagram.com/username)
```

**Notes:**
- No required front matter fields — schema is empty (see `config.ts` pattern above)
- Body-only content makes this editable without any code changes (CONT-04)
- LinkedIn and Instagram links declared here satisfy ABOUT-02 and ABOUT-03 at the data layer; Phase 2 renders them

---

### `src/layouts/BaseLayout.astro` (layout, request-response)

**Analog:** none — use Astro layout component convention

**Core pattern:**
```astro
---
// src/layouts/BaseLayout.astro
import Nav from '../components/Nav.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Art director portfolio' } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
  </head>
  <body>
    <Nav />
    <main>
      <slot />
    </main>
  </body>
</html>
```

**Notes:**
- `import '../styles/global.css'` in the layout is the single import point for global styles (D-07)
- `global.css` itself imports `tokens.css` — downstream components never need to import tokens directly
- `<slot />` is the Astro content projection mechanism — no React `children` prop
- No analytics scripts, no third-party tags (PERF-03)
- TypeScript interface for `Props` is the Astro convention for typed layouts

---

### `src/components/Nav.astro` (component, event-driven)

**Analog:** none — custom implementation per UI-SPEC

**Structure pattern** (from `01-UI-SPEC.md` Component Inventory):
```astro
---
// src/components/Nav.astro
// No imports needed — pure HTML/CSS/inline script
---

<nav class="site-nav" id="site-nav">
  <a href="/" class="nav-logo">Alexandre Galatioto</a>
  <ul class="nav-links">
    <li><a href="/work">Work</a></li>
    <li><a href="/about">About</a></li>
  </ul>
  <button class="nav-hamburger" aria-label="Open menu" aria-expanded="false" id="nav-hamburger">
    <span class="bar"></span>
    <span class="bar"></span>
    <span class="bar"></span>
  </button>
</nav>

<div class="nav-overlay" id="nav-overlay" aria-hidden="true">
  <button class="nav-close" aria-label="Close menu" id="nav-close">
    <span class="bar bar--close-1"></span>
    <span class="bar bar--close-2"></span>
  </button>
  <ul class="overlay-links">
    <li><a href="/work">Work</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</div>

<style>
  .site-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    height: var(--nav-height);
    padding: 0 var(--space-lg);
    background: var(--color-bg);
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: transform 200ms ease;
  }

  .site-nav.nav--hidden {
    transform: translateY(calc(-1 * var(--nav-height)));
  }

  .nav-logo {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
    text-decoration: none;
  }

  .nav-links {
    display: flex;
    gap: var(--space-lg);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-links a {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
    text-decoration: none;
  }

  .nav-links a:hover {
    opacity: 0.6;
  }

  /* Active link underline */
  .nav-links a[aria-current="page"] {
    border-bottom: 2px solid var(--color-accent);
    padding-bottom: 2px;
  }

  /* Hamburger — hidden on desktop */
  .nav-hamburger {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: var(--space-sm);
    width: var(--touch-target);
    height: var(--touch-target);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .bar {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--color-text);
  }

  /* Overlay */
  .nav-overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: var(--color-bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: opacity 150ms ease, visibility 150ms ease;
  }

  .nav-overlay.overlay--open {
    opacity: 1;
    visibility: visible;
  }

  .overlay-links {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xl);
  }

  .overlay-links a {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
    text-decoration: none;
  }

  .nav-close {
    position: absolute;
    top: var(--space-lg);
    right: var(--space-lg);
    width: var(--touch-target);
    height: var(--touch-target);
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Mobile breakpoint */
  @media (max-width: 768px) {
    .nav-links {
      display: none;
    }

    .nav-hamburger {
      display: flex;
    }
  }
</style>

<script>
  // Scroll hide / show (NAV-02)
  const nav = document.getElementById('site-nav');
  let lastScrollY = window.scrollY;
  const SCROLL_THRESHOLD = 80;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= 0) {
      nav?.classList.remove('nav--hidden');
    } else if (currentScrollY > lastScrollY && currentScrollY > SCROLL_THRESHOLD) {
      nav?.classList.add('nav--hidden');
    } else if (currentScrollY < lastScrollY) {
      nav?.classList.remove('nav--hidden');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });

  // Mobile overlay toggle (NAV-03)
  const hamburger = document.getElementById('nav-hamburger');
  const overlay = document.getElementById('nav-overlay');
  const closeBtn = document.getElementById('nav-close');

  function openMenu() {
    overlay?.classList.add('overlay--open');
    overlay?.setAttribute('aria-hidden', 'false');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay?.classList.remove('overlay--open');
    overlay?.setAttribute('aria-hidden', 'true');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);

  // Close on overlay link click
  overlay?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
</script>
```

**Key constraints:**
- Inline `<script>` block only — no bundled JS file (PERF-02)
- `{ passive: true }` on scroll listener — performance best practice
- `aria-expanded` toggled by script — accessibility requirement (UI-SPEC Copywriting Contract)
- `position: sticky` on nav — keeps it in layout flow, avoids layout shift
- Scroll threshold: 80px (UI-SPEC Interaction Contract)
- Transition: `200ms ease` for scroll hide/show; `150ms ease` for overlay (UI-SPEC Interaction Contract)

---

### `src/styles/tokens.css` (utility / config, static)

**Analog:** none — defines from `01-UI-SPEC.md` CSS Custom Properties Contract

**Complete token set (exact values from UI-SPEC):**
```css
/* src/styles/tokens.css */
/* Design tokens for Art Director Portfolio
   Source of truth: .planning/phases/01-foundation/01-UI-SPEC.md
   All components import via global.css → tokens.css chain */

:root {
  /* Typography */
  --font-family-base:      'Neue Haas Unica', system-ui, sans-serif;
  --font-size-sm:          14px;
  --font-size-base:        16px;
  --font-size-lg:          24px;
  --font-size-xl:          40px;
  --font-weight-regular:   400;
  --font-weight-medium:    500;
  --line-height-body:      1.5;
  --line-height-heading:   1.2;
  --line-height-display:   1.1;

  /* Color */
  --color-bg:              #FFFFFF;
  --color-surface:         #F5F5F5;
  --color-text:            #111111;
  --color-text-muted:      #999999;
  --color-accent:          #111111;
  --color-destructive:     #CC0000;

  /* Spacing */
  --space-xs:              4px;
  --space-sm:              8px;
  --space-md:              16px;
  --space-lg:              24px;
  --space-xl:              32px;
  --space-2xl:             48px;
  --space-3xl:             64px;

  /* Component */
  --nav-height:            64px;
  --touch-target:          48px;
}
```

**Notes:**
- Declare ONLY what is specified above — do not add tokens Phase 1 does not need
- `--font-weight-bold: 700` is intentionally absent in Phase 1 (UI-SPEC Typography: "Bold deferred to Phase 2")
- `--color-surface`, `--color-text-muted`, `--color-destructive` are declared now for completeness but not used until Phase 2

---

### `src/styles/global.css` (utility / config, static)

**Analog:** none — standard CSS reset + base styles

**Core pattern:**
```css
/* src/styles/global.css */
@import './tokens.css';
@import url('/fonts/NeueHaasUnica-Regular.woff2') format('woff2');

/* @font-face declarations — woff2 only, no legacy formats needed for modern browsers */
@font-face {
  font-family: 'Neue Haas Unica';
  src: url('/fonts/NeueHaasUnica-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Neue Haas Unica';
  src: url('/fonts/NeueHaasUnica-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Neue Haas Unica';
  src: url('/fonts/NeueHaasUnica-Italic.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

/* Phase 2 will add Bold (700) when page headings are implemented */

/* Reset */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Base */
html {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-body);
  color: var(--color-text);
  background-color: var(--color-bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  min-height: 100vh;
}

img {
  display: block;
  max-width: 100%;
}

a {
  color: inherit;
}

ul {
  list-style: none;
}
```

**Notes:**
- `@import './tokens.css'` must be the first line — this is the single chain that makes tokens available everywhere
- `font-display: swap` on all `@font-face` rules — prevents invisible text during font load (PERF-01)
- Only woff2 format declared — the `public/fonts/stylesheet.css` ships all legacy formats, but since the project targets modern browsers only woff2 is needed in `global.css`
- Phase 1 declares only the three weights used in Phase 1 (Regular 400, Medium 500, Italic 400i) — Bold 700 added in Phase 2 per UI-SPEC
- `img { display: block; max-width: 100% }` is the base that DSGN-03 builds on in Phase 3

---

### `src/pages/index.astro` (page stub, request-response)

**Analog:** none — Astro file-based routing convention

**Core pattern (minimal stub for Phase 1 — full home page is Phase 2):**
```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Work — Alexandre Galatioto">
  <!-- Home page content built in Phase 2 -->
</BaseLayout>
```

**Notes:**
- `src/pages/index.astro` maps to the `/` route by Astro's file-based routing
- All page files follow the same three-part structure: frontmatter fence `---`, then HTML template, then `<style>` scoped block if needed
- Phase 1 only needs a stub so `npm run dev` starts without errors (Success Criterion 1)
- Phase 2 will replace the comment with the full project grid

---

## Shared Patterns

### CSS Token Import Chain
**Source:** UI-SPEC CSS Custom Properties Contract
**Apply to:** `src/styles/global.css` (all other files inherit via BaseLayout import)
```css
/* In global.css — first line */
@import './tokens.css';
/* In BaseLayout.astro frontmatter */
import '../styles/global.css';
```
All components then reference `var(--token-name)` directly without importing anything — tokens cascade from `:root`.

### Astro Component Frontmatter Fence
**Apply to:** All `.astro` files (layouts, components, pages)
```astro
---
// TypeScript imports and logic go here
---
<!-- HTML template here -->
<style>
  /* Scoped CSS here — automatically scoped to this component by Astro */
</style>
<script>
  // Inline JS here — not bundled, runs as-is in the browser
</script>
```
The three-section structure (frontmatter / template / style+script) is the universal Astro component pattern.

### Inline Script Constraint (PERF-02)
**Apply to:** `src/components/Nav.astro` — and any future component that needs client interactivity
```astro
<!-- CORRECT: inline <script> inside .astro file -->
<script>
  document.getElementById('btn')?.addEventListener('click', () => { ... });
</script>

<!-- WRONG: do NOT add src/scripts/*.js files and import them as modules -->
<!-- WRONG: do NOT add client:load directives (no framework components in Phase 1) -->
```
Astro static mode with inline scripts produces zero client-side JS bundle. A standalone `src/scripts/` file would get bundled, violating PERF-02.

### Font Path Convention
**Source:** `public/fonts/` directory (confirmed present)
**Apply to:** `src/styles/global.css` `@font-face` declarations
```css
/* Paths are relative to the public/ root — always use absolute paths starting with /fonts/ */
src: url('/fonts/NeueHaasUnica-Regular.woff2') format('woff2');
```
The `public/` directory is served as the site root — `/fonts/file.woff2` maps to `public/fonts/file.woff2`.

---

## No Analog Found

All files in Phase 1 are new with no existing source code analog. The table below documents the reason:

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `astro.config.mjs` | config | static | Greenfield — no existing Astro config |
| `package.json` | config | static | Greenfield — no package manifest yet |
| `src/content/config.ts` | config / schema | static | Greenfield — no Astro content collections yet |
| `src/content/projects/sample-project.md` | content | static | Greenfield — no content files yet |
| `src/content/about/index.md` | content | static | Greenfield — no content files yet |
| `src/layouts/BaseLayout.astro` | layout | request-response | Greenfield — no layouts yet |
| `src/components/Nav.astro` | component | event-driven | Greenfield — no components yet |
| `src/styles/tokens.css` | utility | static | Greenfield — no styles yet |
| `src/styles/global.css` | utility | static | Greenfield — no styles yet |
| `src/pages/index.astro` | page | request-response | Greenfield — no pages yet |

Patterns above are sourced from: Astro official documentation (v4), CONTEXT.md decisions D-01 through D-16, and `01-UI-SPEC.md` design contracts.

---

## Metadata

**Analog search scope:** `/Users/lemondebrule/Downloads/_Claude/` (full working directory)
**Files scanned:** `public/fonts/stylesheet.css`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/phases/01-foundation/01-CONTEXT.md`, `.planning/phases/01-foundation/01-UI-SPEC.md`
**Existing source files found:** 0 (greenfield)
**Pattern extraction date:** 2026-04-15
