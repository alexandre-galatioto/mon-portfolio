---
phase: 03-responsive-performance-deploy
plan: "02"
subsystem: image-optimization-pages
tags: [astro, image-component, responsive, max-width, performance, lcp]
dependency_graph:
  requires: [image-schema-migration]
  provides: [image-component-pages, max-width-caps, cover-aspect-ratio-fix]
  affects:
    - src/pages/index.astro
    - src/pages/about.astro
    - src/pages/projects/[slug].astro
tech_stack:
  added: []
  patterns:
    - Astro Image component with widths/sizes/format props
    - eager loading for LCP-critical first image
    - max-width + margin-inline: auto centering pattern
    - padding-inline for inner spacing with centered containers
decisions:
  - "Gallery map param renamed src->img to avoid shadowing the Image src prop"
  - "Cover container uses padding-inline (not margin-inline) for spacing so margin-inline: auto centering works"
  - "Home page 3:2 cover crop preserved per D-08 (only project gallery pages remove cropping)"
  - "About portrait keeps object-fit: cover per existing design"
key_files:
  created: []
  modified:
    - src/pages/index.astro
    - src/pages/about.astro
    - src/pages/projects/[slug].astro
metrics:
  duration_seconds: 149
  completed_date: "2026-04-16"
  tasks_completed: 2
  files_changed: 3
---

# Phase 03 Plan 02: Image Component Pages and Max-Width Caps Summary

Switched all three page components from raw img tags to Astro's Image component consuming ImageMetadata objects from the migrated schema, added 1280px max-width caps to all content containers, fixed project cover to display at natural aspect ratio without cropping, and optimized LCP by eagerly loading the first home page image.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Update home page and about page with Image component and max-width caps | 6daf830 | src/pages/index.astro, src/pages/about.astro |
| 2 | Update project page — cover aspect ratio fix, gallery Image updates, max-width caps | 88e7cf4 | src/pages/projects/[slug].astro |

## What Was Done

**Task 1 — index.astro and about.astro:**
- Added `import { Image } from 'astro:assets'` to both pages
- `index.astro`: replaced `<img>` with `<Image>` using `widths={[640, 960, 1280, 1600]}`, `sizes="(max-width: 640px) 100vw, 50vw"`, `format="webp"`, and conditional `loading={i === 0 ? 'eager' : 'lazy'}` for LCP optimization
- `about.astro`: replaced portrait `<img>` with `<Image>` using `widths={[640, 960, 1280]}`, `loading="eager"` (portrait is above the fold)
- Both pages: `.project-grid` and `.about-layout` gained `max-width: 1280px` and `margin-inline: auto` for ultrawide screen capping
- Mobile media queries and home page 3:2 cover crop CSS preserved unchanged

**Task 2 — [slug].astro:**
- Cover: replaced `<img src={data.cover}>` with `<Image>` component including widths, sizes with `min(calc(100vw - 64px), 1280px)`, format, eager loading
- Gallery: renamed map param from `src` to `img` (prevents prop shadowing), removed explicit `width={1600} height={1200}` (Astro infers from ImageMetadata), updated sizes attribute
- Cover CSS fix (D-08): removed `height: 50vh` and `object-fit: cover` — cover now shows at natural aspect ratio
- `.project-cover`: changed from `margin-inline: var(--space-xl)` to `max-width: 1280px; margin-inline: auto; padding-inline: var(--space-xl)` — centering + inner spacing
- `.project-gallery`: same pattern — `max-width: 1280px; margin-inline: auto; padding-inline: var(--space-xl)`
- `.project-meta` and `.project-nav`: added `max-width: 1280px; margin-inline: auto`
- Mobile breakpoint: cover and gallery now override `padding-inline` (not `margin-inline`) correctly

## Decisions Made

1. Gallery map param `src` renamed to `img` — `src` would shadow the Image component's own `src` prop name in JSX/Astro template scope.
2. Container spacing pattern: `max-width + margin-inline: auto + padding-inline` — `margin-inline: auto` handles centering, `padding-inline` handles the inner gutter. Using `margin-inline` for both centering and spacing is impossible simultaneously.
3. Home page 3:2 cover crop (`.project-cell img`) kept per D-08: only project *gallery* pages remove aspect ratio constraints. The home page grid intentionally crops to uniform 3:2 thumbnails.
4. About portrait keeps `object-fit: cover` — portrait is a design-cropped image per existing design intent.

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

The Image component pipeline will only generate WebP srcset variants once real images are placed in `src/assets/images/`. The component code is complete; the optimization activates automatically when actual image files are present. This was documented as an intentional stub in Plan 01 and carries forward.

## Threat Flags

None — no new network endpoints, auth paths, file access patterns, or schema changes introduced. All changes are build-time template rendering. Image src attributes come exclusively from validated content collection ImageMetadata objects.

## Self-Check: PASSED

- src/pages/index.astro: FOUND
- src/pages/about.astro: FOUND
- src/pages/projects/[slug].astro: FOUND
- Commit 6daf830: FOUND
- Commit 88e7cf4: FOUND
