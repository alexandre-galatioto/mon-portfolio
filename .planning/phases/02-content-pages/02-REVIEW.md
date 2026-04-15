---
phase: 02-content-pages
reviewed: 2026-04-15T14:30:00Z
depth: standard
files_reviewed: 10
files_reviewed_list:
  - src/content/about/index.md
  - src/content/config.ts
  - src/content/projects/sample-project-2.md
  - src/content/projects/sample-project.md
  - src/layouts/BaseLayout.astro
  - src/pages/about.astro
  - src/pages/index.astro
  - src/pages/projects/[slug].astro
  - src/styles/global.css
  - src/styles/tokens.css
findings:
  critical: 2
  warning: 2
  info: 3
  total: 7
status: issues_found
---

# Phase 02: Code Review Report

**Reviewed:** 2026-04-15T14:30:00Z
**Depth:** standard
**Files Reviewed:** 10
**Status:** issues_found

## Summary

Reviewed all 10 source files for the content-pages phase: three Astro page/route files, one layout, the content collection config, two content markdown files, and two CSS files. The design tokens, global resets, and schema definitions are clean and consistent. Two critical issues were found: the `<Image>` component in the project detail page is used with string paths that will cause a build failure in Astro v4, and the About page has no null guard on its content entry lookup. Two warnings address deprecated `.slug` usage and in-place array mutation.

---

## Critical Issues

### CR-01: `<Image>` component will fail with string paths from public directory

**File:** `src/pages/projects/[slug].astro:50-60`
**Issue:** The `<Image>` component imported from `astro:assets` (line 3) is used with string `src` values from content frontmatter (e.g., `"/images/projects/acme/01.jpg"`). In Astro v4 (`"astro": "^4.0.0"` in package.json), the `<Image>` component requires either an ESM-imported image object or a full remote URL. Passing a string path to a public directory file will throw a build error: "Local images must be imported." This affects every project detail page and will prevent the site from building.
**Fix:** Replace `<Image>` with a standard `<img>` tag for public directory images, or restructure images to use ESM imports via content collection image schema:

Option A -- Use `<img>` tag (simplest, matches the pattern used elsewhere in the codebase):
```astro
// Remove the Image import on line 3
// import { Image } from 'astro:assets';  // DELETE

// Replace the gallery Image component (lines 50-60) with:
{data.images.map((src) => (
  <img
    src={src}
    alt=""
    width="1600"
    height="1200"
    loading="lazy"
  />
))}
```

Option B -- Use content collection `image()` schema helper (requires moving images into `src/` and updating frontmatter paths):
```ts
// In config.ts, change:
images: z.array(z.string()),
// to:
images: z.array(image()),
```
This is a larger refactor but enables Astro's built-in image optimization.

### CR-02: `getEntry` result used without null guard on About page

**File:** `src/pages/about.astro:5-7`
**Issue:** `getEntry('about', 'index')` returns `undefined` when no matching entry exists (e.g., file renamed, collection misconfigured, or during a build without the file present). Calling `render(entry)` and destructuring `entry.data` on an undefined value throws a runtime error that crashes the build with no meaningful message.
**Fix:**
```astro
const entry = await getEntry('about', 'index');
if (!entry) {
  throw new Error('About content entry not found. Expected src/content/about/index.md');
}
const { Content } = await render(entry);
const { data } = entry;
```

---

## Warnings

### WR-01: Deprecated `.slug` property used for route generation

**File:** `src/pages/index.astro:13` and `src/pages/projects/[slug].astro:9, 66, 71`
**Issue:** In Astro v4 content collections, `entry.slug` is deprecated in favor of `entry.id`. While `.slug` still works in Astro v4, it is removed in Astro v5. Since `package.json` uses `"^4.0.0"`, a future minor/patch update could surface this as a warning, and a major version bump to v5 would break all project links silently (rendering as `/projects/undefined`).
**Fix:**
```astro
// In index.astro line 13 -- replace .slug with .id
<a href={`/projects/${project.id}`}>

// In [slug].astro getStaticPaths -- line 9
params: { slug: entry.id },

// In [slug].astro nav links -- lines 66, 71
<a href={`/projects/${prev.id}`} class="project-nav__prev">
<a href={`/projects/${next.id}`} class="project-nav__next">
```
Note: Verify the Astro version actually installed in `node_modules` -- if it is v3.x or earlier, `.slug` is still the canonical property.

### WR-02: In-place mutation of `getCollection` result array

**File:** `src/pages/index.astro:6` and `src/pages/projects/[slug].astro:8`
**Issue:** `Array.prototype.sort()` mutates the source array in place. Both files call `projects.sort(...)` directly on the array returned by `getCollection`. While Astro currently returns a new array per call, mutating returned data is a fragile pattern that can cause non-deterministic ordering if the result is ever cached.
**Fix:**
```astro
const sorted = [...projects].sort((a, b) => a.data.order - b.data.order);
```

---

## Info

### IN-01: Hardcoded copyright year in layout footer

**File:** `src/layouts/BaseLayout.astro:27`
**Issue:** The year `2026` is hardcoded as a string literal. It will become stale without a code change.
**Fix:**
```astro
<p>Alexandre Galatioto &copy;{new Date().getFullYear()}</p>
```

### IN-02: Portrait image missing explicit `loading` attribute

**File:** `src/pages/about.astro:13`
**Issue:** The portrait `<img>` has no `loading` attribute. The project grid uses `loading="lazy"` and the project cover uses `loading="eager"`. For consistency and explicit intent, the above-the-fold portrait should specify `loading="eager"`.
**Fix:**
```astro
<img src={data.portrait} alt="Alexandre Galatioto" loading="eager" />
```

### IN-03: Gallery images use empty `alt` without `role="presentation"`

**File:** `src/pages/projects/[slug].astro:50`
**Issue:** Gallery images use `alt=""` which is correct for decorative images, but adding `role="presentation"` makes the intent more explicit for accessibility audits.
**Fix:**
```astro
<img src={src} alt="" role="presentation" loading="lazy" />
```

---

_Reviewed: 2026-04-15T14:30:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
