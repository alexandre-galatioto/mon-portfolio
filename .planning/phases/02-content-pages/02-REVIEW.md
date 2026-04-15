---
phase: 02-content-pages
reviewed: 2026-04-15T00:00:00Z
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
  critical: 1
  warning: 2
  info: 3
  total: 6
status: issues_found
---

# Phase 02: Code Review Report

**Reviewed:** 2026-04-15T00:00:00Z
**Depth:** standard
**Files Reviewed:** 10
**Status:** issues_found

## Summary

Reviewed all 10 source files for the content-pages phase: two Astro page files, one dynamic route, one layout, the content collection config, two content markdown files, and two CSS files. The foundation (design tokens, global resets, schema definitions) is clean and consistent. The main concerns are a runtime crash risk on the About page when the content entry is absent, and a likely Astro version incompatibility with the deprecated `.slug` property used across two page files that will silently produce broken routes.

---

## Critical Issues

### CR-01: `getEntry` result used without null guard on About page

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

**File:** `src/pages/index.astro:13` and `src/pages/projects/[slug].astro:9, 56, 61`
**Issue:** `entry.slug` is deprecated in Astro v3+ content collections. The property that carries the file-based identifier is now `entry.id` (which for a file at `src/content/projects/sample-project.md` yields `"sample-project"`). In Astro v5, `.slug` may be `undefined`, causing all project links to render as `/projects/undefined` and all `getStaticPaths` routes to be generated under that path. This is a silent failure — no build error, just broken navigation.
**Fix:**
```astro
// In index.astro — replace .slug with .id (strip collection prefix if present)
<a href={`/projects/${project.id}`}>

// In [slug].astro — getStaticPaths
return sorted.map((entry, index) => ({
  params: { slug: entry.id },
  props: { entry, prev: sorted[index - 1] ?? null, next: sorted[index + 1] ?? null },
}));

// In [slug].astro — nav links
<a href={`/projects/${prev.id}`} class="project-nav__prev">
<a href={`/projects/${next.id}`} class="project-nav__next">
```
Note: If the Astro version in use is v2 (where `.slug` is still the canonical property), this warning does not apply — but the Astro version should be verified in `package.json`.

### WR-02: In-place mutation of `getCollection` result array

**File:** `src/pages/index.astro:6` and `src/pages/projects/[slug].astro:7`
**Issue:** `Array.prototype.sort()` mutates the source array. Both files call `projects.sort(...)` directly on the array returned by `getCollection`. While Astro currently returns a new array per `getCollection` call, mutating a shared data structure is a fragile pattern that can cause non-deterministic ordering if the array is ever cached or reused in a future Astro version.
**Fix:**
```astro
// Use spread or .toSorted() (ES2023) to avoid mutation
const sorted = [...projects].sort((a, b) => a.data.order - b.data.order);
// or
const sorted = projects.toSorted((a, b) => a.data.order - b.data.order);
```

---

## Info

### IN-01: Portrait image missing explicit `loading` attribute

**File:** `src/pages/about.astro:13`
**Issue:** The portrait `<img>` element has no `loading` attribute. The project grid images consistently use `loading="lazy"` and the project cover uses `loading="eager"`. The about portrait is above the fold and should use `loading="eager"` (or omit the attribute, which defaults to eager) for consistent, intentional behavior and alignment with the pattern established elsewhere.
**Fix:**
```astro
<img src={data.portrait} alt="Alexandre Galatioto" loading="eager" />
```

### IN-02: Gallery images use empty `alt` without `role="presentation"`

**File:** `src/pages/projects/[slug].astro:50`
**Issue:** `alt=""` is correct for decorative images, but the WCAG convention for decorative images that are not purely presentational artifacts is to also add `role="presentation"` to make the intent explicit to assistive technology authors reading the source.
**Fix:**
```astro
<img src={src} alt="" role="presentation" loading="lazy" />
```

### IN-03: Hardcoded copyright year in layout footer

**File:** `src/layouts/BaseLayout.astro:27`
**Issue:** The year `©2026` is hardcoded as a string literal. It will become stale without a code change.
**Fix:**
```astro
<p>Alexandre Galatioto &copy;{new Date().getFullYear()}</p>
```

---

_Reviewed: 2026-04-15T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
