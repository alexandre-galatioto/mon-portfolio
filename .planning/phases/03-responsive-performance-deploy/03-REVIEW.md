---
phase: 03-responsive-performance-deploy
reviewed: 2026-04-16T00:00:00Z
depth: standard
files_reviewed: 8
files_reviewed_list:
  - netlify.toml
  - src/content/config.ts
  - src/content/about/index.md
  - src/content/projects/sample-project-1.md
  - src/layouts/BaseLayout.astro
  - src/pages/about.astro
  - src/pages/index.astro
  - src/pages/projects/[slug].astro
findings:
  critical: 1
  warning: 4
  info: 2
  total: 7
status: issues_found
---

# Phase 03: Code Review Report

**Reviewed:** 2026-04-16  
**Depth:** standard  
**Files Reviewed:** 8  
**Status:** issues_found

## Summary

Eight files were reviewed covering the Netlify deployment config, Astro content schemas, and all page/layout components. The codebase is clean and well-structured overall. One critical bug was found: project markdown body content is never rendered on the detail page. Four warnings cover a missing null-guard on a content fetch, missing Escape-key handling and focus trap in the mobile nav overlay, and a significant cache header gap in `netlify.toml`. Two info-level items cover in-place array mutation and missing directional labels on project navigation links.

---

## Critical Issues

### CR-01: Project body content is never rendered on the detail page

**File:** `src/pages/projects/[slug].astro:19-20`

**Issue:** `render(entry)` is never called in `[slug].astro`. The `Content` component — which renders the markdown body — is never imported or placed in the template. Every project detail page silently drops its body copy. Compare with `about.astro` lines 7-8 where `render` is called correctly.

**Fix:**
```astro
---
// Add render import and call
import { getCollection, render } from 'astro:content';
// ...
const { entry, prev, next } = Astro.props;
const { data } = entry;
const { Content } = await render(entry);
---

<!-- Then place <Content /> in the template, e.g. after .project-gallery -->
<div class="project-body">
  <Content />
</div>
```

---

## Warnings

### WR-01: `getEntry` result used without null check

**File:** `src/pages/about.astro:6-8`

**Issue:** `getEntry('about', 'index')` returns `undefined` when the entry does not exist. The result is passed directly to `render(entry)` and destructured without a guard. If the file is renamed, deleted, or the collection misconfigured, this throws a runtime error at build time with a misleading stack trace.

**Fix:**
```astro
const entry = await getEntry('about', 'index');
if (!entry) {
  throw new Error('Missing required content entry: about/index');
}
const { Content } = await render(entry);
const { data } = entry;
```

### WR-02: Mobile overlay has no Escape-key handler and no focus trap

**File:** `src/components/Nav.astro:200-225`

**Issue:** When the overlay opens, pressing `Escape` does not close it (WCAG 2.1 SC 2.1.2 — No Keyboard Trap). Additionally, focus is not trapped inside the overlay, so tabbing past the last link moves focus to content hidden behind the overlay. Both are accessibility failures for keyboard and screen reader users.

**Fix:**
```js
// Escape key closes the menu
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay?.classList.contains('overlay--open')) {
    closeMenu();
    hamburger?.focus(); // return focus to trigger
  }
});

// Focus trap: intercept Tab on the last focusable element
const focusable = () =>
  Array.from(overlay?.querySelectorAll('a, button') ?? []) as HTMLElement[];

overlay?.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const items = focusable();
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last?.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first?.focus();
  }
});
```

### WR-03: Astro-generated assets not covered by cache headers in netlify.toml

**File:** `netlify.toml:5-13`

**Issue:** Astro writes all hashed static assets (JS bundles, CSS, processed images) to `/_astro/`. The `netlify.toml` only sets a long-lived cache on `/fonts/*`. The `/_astro/` directory — which contains content-hashed filenames and is safe to cache indefinitely — receives no explicit `Cache-Control` header, so Netlify serves it with its default short TTL. This undermines the hash-based cache-busting strategy.

**Fix:**
```toml
[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### WR-04: Project navigation links have no directional context for assistive technology

**File:** `src/pages/projects/[slug].astro:69-80`

**Issue:** The `<nav aria-label="Project navigation">` renders only the project title as link text (e.g., `<a href="/projects/anticor">anticor</a>`). Screen reader users have no indication of whether the link is the previous or next project. The CSS classes `.project-nav__prev` / `.project-nav__next` carry visual meaning only.

**Fix:**
```astro
{prev && (
  <a href={`/projects/${prev.slug}`} class="project-nav__prev">
    <span class="sr-only">Previous project: </span>{prev.data.title}
  </a>
)}
{next && (
  <a href={`/projects/${next.slug}`} class="project-nav__next">
    <span class="sr-only">Next project: </span>{next.data.title}
  </a>
)}
```

Add the visually-hidden utility to global CSS:
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## Info

### IN-01: In-place array mutation in getStaticPaths

**File:** `src/pages/projects/[slug].astro:8`

**Issue:** `projects.sort(...)` mutates the array returned by `getCollection`. While harmless in the current static build context (the array is not reused), it is a subtle side-effect that can cause ordering bugs if the array is referenced again before or after the sort (e.g., if `getCollection` starts returning a cached reference in a future Astro version).

**Fix:**
```js
const sorted = [...projects].sort((a, b) => a.data.order - b.data.order);
```

The same pattern appears in `src/pages/index.astro:7` and should receive the same fix.

### IN-02: `project.slug` usage may need migration to `id` for Astro v5

**File:** `src/pages/index.astro:14`, `src/pages/projects/[slug].astro:9,71,76`

**Issue:** `entry.slug` is deprecated in Astro v5 content collections in favor of `entry.id`. If the project is on Astro v5+, the build will emit deprecation warnings and `slug` may be removed in a future minor. Verify the Astro version in `package.json` and migrate to `entry.id` if on v5.

**Fix:** Check `package.json` for the Astro version. If v5+, replace all `entry.slug` / `project.slug` references with `entry.id` / `project.id` and update `getStaticPaths` param accordingly:
```js
params: { slug: entry.id },
```

---

_Reviewed: 2026-04-16_  
_Reviewer: Claude (gsd-code-reviewer)_  
_Depth: standard_
