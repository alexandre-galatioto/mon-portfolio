---
phase: 01-foundation
reviewed: 2026-04-15T00:00:00Z
depth: standard
files_reviewed: 13
files_reviewed_list:
  - .gitignore
  - astro.config.mjs
  - package.json
  - src/components/Nav.astro
  - src/content/about/index.md
  - src/content/config.ts
  - src/content/projects/sample-project-2.md
  - src/content/projects/sample-project.md
  - src/env.d.ts
  - src/layouts/BaseLayout.astro
  - src/pages/index.astro
  - src/styles/global.css
  - src/styles/tokens.css
findings:
  critical: 0
  warning: 4
  info: 5
  total: 9
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-04-15
**Depth:** standard
**Files Reviewed:** 13
**Status:** issues_found

## Summary

This is the foundation phase for an Astro 4 static portfolio site. The codebase is clean, minimal, and well-structured for its stage. No critical security issues were found. The main concerns are: a missing keyboard escape-key handler for the mobile nav overlay (accessibility/usability bug), a nav scroll-hide script that does not guard against a null `nav` reference on pages where `#site-nav` might not exist, placeholder links in the about content, and a missing `package-lock.json` / lockfile in `.gitignore` tracking. Several informational items cover placeholder content and minor conventions.

---

## Warnings

### WR-01: Mobile overlay has no Escape-key close handler

**File:** `src/components/Nav.astro:219-225`
**Issue:** The mobile menu overlay can be opened via the hamburger button, but there is no `keydown` listener for the `Escape` key. Users who open the overlay with keyboard navigation have no keyboard path to dismiss it without clicking the close button. This is an accessibility gap (WCAG 2.1 SC 2.1.2 — no keyboard trap) and also affects users who expect `Escape` to dismiss modal-style overlays.
**Fix:**
```js
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});
```
Add this alongside the existing `hamburger?.addEventListener` calls.

---

### WR-02: Nav scroll handler does not guard against null `nav` — `classList` call can throw

**File:** `src/components/Nav.astro:186-197`
**Issue:** `nav` is assigned via `document.getElementById('site-nav')` (line 182) and is typed `HTMLElement | null`. The optional-chaining `nav?.classList` on lines 190, 192, and 194 is correct, but on line 197 `lastScrollY = currentScrollY` is always executed unconditionally. That is fine by itself, but if `Nav.astro` is ever rendered in an environment where the element is absent (e.g., a test harness or a future page that opts out of the nav), the scroll listener remains attached with `nav === null` and silently no-ops on every scroll event for the lifetime of the page — wasting event budget. A more important concern: the `nav` variable is captured in the closure from module scope. In Astro's default MPA mode each page navigation tears down and re-creates the DOM, so this is low-risk today, but if the project ever adopts View Transitions (`<ViewTransitions />`), the `scroll` listener is re-registered on every navigation without the old one being removed, causing listener accumulation.
**Fix:** Guard the entire scroll block so it only attaches when the element exists, and use a named function so it can be removed on `astro:before-swap` if View Transitions are added later:
```js
const nav = document.getElementById('site-nav');
if (nav) {
  let lastScrollY = window.scrollY;
  const SCROLL_THRESHOLD = 80;
  window.addEventListener('scroll', () => { /* ... */ }, { passive: true });
}
```

---

### WR-03: `about/index.md` contains placeholder social links

**File:** `src/content/about/index.md:6`
**Issue:** The LinkedIn and Instagram URLs use literal `/username` slugs:
```
[LinkedIn](https://linkedin.com/in/username) · [Instagram](https://instagram.com/username)
```
If rendered to production without replacement these become live but invalid links pointing to potentially unintended third-party profiles (or a real profile named "username"). This is a content bug with a minor reputational / correctness risk.
**Fix:** Replace `username` with the actual profile handle before the site goes live, or add a TODO comment in the frontmatter to make the placeholder intent explicit and prevent it being overlooked.

---

### WR-04: `package.json` has no lockfile committed — dependency resolution is non-deterministic

**File:** `package.json:9-11`
**Issue:** `astro: "^4.0.0"` is a wide semver range. The `.gitignore` does not exclude `package-lock.json` (so it would be committed), but no lockfile appears in the file list provided to this review. Without a lockfile, `npm install` on a fresh clone resolves to whatever the latest `4.x` release is at install time. Astro has had breaking minor/patch changes (e.g., content collections API tweaks between 4.0 and 4.x). CI or a new contributor's machine may silently build against a different version.
**Fix:** Commit `package-lock.json` (run `npm install` if it has not been generated yet) and pin a baseline. The `.gitignore` currently does not exclude it, so there is no blocker — just ensure it is generated and committed.

---

## Info

### IN-01: `index.astro` title is misleading — says "Work" not "Home"

**File:** `src/pages/index.astro:5`
**Issue:** The root page (`/`) passes `title="Work — Alexandre Galatioto"` to `BaseLayout`. The home page and the work listing are the same route for now, but the `<title>` tag will appear in browser tabs and search engine results as "Work" for visitors arriving at `/`. If the home page is later differentiated from a `/work` page, this will be incorrect from the start.
**Fix:** Use `title="Alexandre Galatioto — Art Director"` (or similar) for the home route, and reserve the "Work" title for a dedicated `/work` page.

---

### IN-02: `src/env.d.ts` is minimal — no Astro client type augmentation

**File:** `src/env.d.ts:1`
**Issue:** The file contains only the generated types triple-slash reference. This is correct for a new project, but there is no `/// <reference types="astro/client" />` directive. Astro's own scaffold includes both. Without it, TypeScript will not automatically include Astro's client-side globals (`import.meta.env`, etc.) in `.ts` files outside of `.astro` components.
**Fix:**
```ts
/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />
```

---

### IN-03: `tokens.css` — `--color-accent` equals `--color-text` (both `#111111`)

**File:** `src/styles/tokens.css:24-25`
**Issue:** `--color-accent` and `--color-text` are set to the same value (`#111111`). This means the active-link underline in `Nav.astro` (line 76, `border-bottom: 2px solid var(--color-accent)`) is visually indistinguishable from the link text colour. If `--color-accent` is intentionally monochromatic for this design, document this in a comment so future contributors do not wonder whether it is an oversight.
**Fix:** Add a comment, or differentiate the values if a distinct accent colour is intended:
```css
/* Intentionally matches --color-text for monochromatic design */
--color-accent: #111111;
```

---

### IN-04: Sample project content files are placeholder-only

**File:** `src/content/projects/sample-project.md:14`, `src/content/projects/sample-project-2.md:12`
**Issue:** Both files end with a note that content "will be rendered on the project detail page in Phase 2." These are clearly intentional placeholders. No action needed for Phase 1, but ensure they are replaced or removed before a production build ships, as they reference fictional clients ("Acme Corp") and will appear in any collection query.

---

### IN-05: `BaseLayout.astro` does not include an Open Graph / social meta block

**File:** `src/layouts/BaseLayout.astro:15-19`
**Issue:** The `<head>` includes only `charset`, `viewport`, `description`, and `title`. There are no `og:title`, `og:description`, `og:image`, or `twitter:card` tags. For a portfolio site shared on social media, missing OG tags means link previews show no image or structured title. This is an info-level omission for Phase 1, but worth building into the layout early to avoid retrofitting later.
**Fix:** Add an optional `ogImage` prop and a minimal OG block:
```astro
---
interface Props {
  title: string;
  description?: string;
  ogImage?: string;
}
---
<meta property="og:title" content={title} />
<meta property="og:description" content={description ?? 'Art director portfolio'} />
<meta property="og:type" content="website" />
{ogImage && <meta property="og:image" content={ogImage} />}
```

---

_Reviewed: 2026-04-15_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
