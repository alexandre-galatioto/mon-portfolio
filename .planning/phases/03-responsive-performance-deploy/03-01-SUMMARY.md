---
phase: 03-responsive-performance-deploy
plan: "01"
subsystem: content-schema-performance
tags: [astro, image-optimization, content-collections, font-preload, performance]
dependency_graph:
  requires: []
  provides: [image-schema-migration, font-preload]
  affects: [src/content/config.ts, src/content/projects, src/content/about, src/layouts/BaseLayout.astro]
tech_stack:
  added: [astro/zod image() helper]
  patterns: [Astro image() schema callback, font preload with crossorigin]
key_files:
  created:
    - src/assets/images/projects/acme/.gitkeep
    - src/assets/images/projects/flux/.gitkeep
    - src/assets/images/about/.gitkeep
  modified:
    - src/content/config.ts
    - src/content/projects/sample-project.md
    - src/content/projects/sample-project-2.md
    - src/content/about/index.md
    - src/layouts/BaseLayout.astro
decisions:
  - "image() helper imported via schema callback ({ image }) => z.object() for both collections — required Astro 4 pattern"
  - "z imported from astro/zod not astro:content — required when using image() callback form"
  - "Regular weight font preloaded only (400) — Medium/Bold/Italic load on demand per D-06"
  - "crossorigin attribute mandatory on font preload — prevents double-fetch for same-origin fonts"
metrics:
  duration_seconds: 240
  completed_date: "2026-04-16"
  tasks_completed: 2
  files_changed: 8
---

# Phase 03 Plan 01: Image Schema Migration and Font Preload Summary

Activated Astro's build-time image optimization pipeline by migrating content schema from string-based paths to the image() helper, updated all Markdown front matter to use relative src/assets/ paths, created the directory structure for optimized images, and added font preload to BaseLayout.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Migrate content schema to image() helper and update all front matter paths | efdfcc4 | src/content/config.ts, sample-project.md, sample-project-2.md, about/index.md, 3x .gitkeep |
| 2 | Add font preload link to BaseLayout head | 34609f6 | src/layouts/BaseLayout.astro |

## What Was Done

**Task 1 — Schema migration:**
- `src/content/config.ts` rewritten to use `image()` helper for `cover`, `images`, and `portrait` fields
- Schema callback form `schema: ({ image }) => z.object({...})` applied to both `projects` and `about` collections
- Import updated: `z` now sourced from `astro/zod` (required when using the callback form)
- All three Markdown files updated with relative paths resolving to `src/assets/images/`
- Directory tree `src/assets/images/{projects/acme,projects/flux,about}/` created with `.gitkeep` files

**Task 2 — Font preload:**
- `<link rel="preload">` tag inserted in BaseLayout head after viewport meta, before `<title>`
- Points to `/fonts/NeueHaasUnica-Regular.woff2` (confirmed present in `public/fonts/`)
- `crossorigin` attribute included — mandatory even for same-origin to prevent the browser fetching the font twice
- Only Regular (400) weight preloaded; Medium (500), Bold (700), and Italic (400i) load on demand

## Decisions Made

1. `image()` callback form requires `z` from `astro/zod` — not `astro:content`. This is an Astro 4 API constraint.
2. Font preload scoped to Regular weight only per D-06 — other weights do not appear in the critical render path.
3. `crossorigin` attribute is mandatory on `<link rel="preload" as="font">` regardless of origin — omitting causes a second network request (browser treats preloaded font and CSS-requested font as different resources).

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

The image directories (`src/assets/images/`) contain only `.gitkeep` placeholder files. Actual project images (cover.jpg, 01.jpg, etc.) must be placed in the correct directories by the site owner before the Astro image optimization pipeline can generate WebP/srcset output. The schema change is complete; the pipeline activates automatically once real images are added.

This is an intentional stub documented in the plan — it is the expected state at this phase.

## Threat Flags

None — no new network endpoints, auth paths, or trust boundary changes introduced. Schema validation is build-time only. Font preload is a public asset performance hint.

## Self-Check: PASSED

- src/content/config.ts: FOUND
- src/content/projects/sample-project.md: FOUND
- src/content/projects/sample-project-2.md: FOUND
- src/content/about/index.md: FOUND
- src/assets/images/projects/acme/.gitkeep: FOUND
- src/assets/images/projects/flux/.gitkeep: FOUND
- src/assets/images/about/.gitkeep: FOUND
- src/layouts/BaseLayout.astro: FOUND
- Commit efdfcc4: FOUND
- Commit 34609f6: FOUND
