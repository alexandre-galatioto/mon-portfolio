---
phase: 02-content-pages
plan: 03
subsystem: ui
tags: [astro, dynamic-routing, content-collections, css-grid, responsive, portfolio]

# Dependency graph
requires:
  - phase: 02-content-pages
    plan: 01
    provides: Updated Zod schemas (projects type field), design tokens including --font-weight-bold, BaseLayout with footer
  - phase: 02-content-pages
    plan: 02
    provides: Home page referencing /projects/{slug} — now routes correctly with slug fix
provides:
  - Dynamic project detail page at /projects/{slug} with cover, 2-column metadata, gallery, prev/next nav
  - getStaticPaths generating one static page per project entry sorted by order field
  - Prev/next navigation computed from sorted collection passed via getStaticPaths props
affects:
  - home page (index.astro) — fixed project.id -> project.slug links for correct routing

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "getStaticPaths with prev/next props — passes adjacent entries at build time, avoids re-querying collection in template"
    - "entry.slug (not entry.id) for clean route params — Astro 4.16 entry.id includes .md extension"
    - "Conditional JSX rendering for optional liveUrl — {data.liveUrl && (...)}"
    - "Gallery images with alt='' — decorative images per UI-SPEC accessibility contract"

key-files:
  created:
    - src/pages/projects/[slug].astro
  modified:
    - src/pages/index.astro

key-decisions:
  - "entry.slug used over entry.id for route params — Astro 4.16 entry.id includes .md extension causing /projects/sample-project.md/ URLs; entry.slug produces clean /projects/sample-project/ (D-auto, Rule 1 fix)"
  - "index.astro links updated to use project.slug — same bug, same fix for link consistency"
  - "rel=noopener noreferrer on liveUrl link — mitigates T-02-05 reverse tabnabbing"

# Metrics
duration: 3min
completed: 2026-04-15
---

# Phase 2 Plan 03: Project Detail Page Summary

**Dynamic project detail page with cover image, 2-column metadata, lazy-loaded gallery, and prev/next navigation — plus a bug fix for entry.id producing .md-suffixed URLs in Astro 4.16**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-04-15T13:33:00Z
- **Completed:** 2026-04-15T13:35:46Z
- **Tasks:** 1
- **Files modified:** 2 (1 created, 1 modified)

## Accomplishments

- Created `src/pages/projects/[slug].astro` with `getStaticPaths` generating one static page per project from the sorted collection
- Full-width cover image at 50vh height with `object-fit: cover` and `loading="eager"` (above the fold)
- 2-column metadata section: left has `h1` title + type in `--color-text-muted`; right has description + conditional "View project" link
- Vertical gallery stack with `loading="lazy"`, `alt=""` (decorative), `var(--space-xl)` gap
- Prev/next navigation in `<nav aria-label="Project navigation">` — project name as link text, flex space-between
- Responsive at 640px: metadata collapses to single column, margins shrink to `--space-md`
- T-02-05 mitigated: `rel="noopener noreferrer"` on `target="_blank"` live demo link
- Fixed `index.astro` links from `project.id` to `project.slug` for correct routing
- `npx astro build` passes cleanly — 4 pages generated including `/projects/sample-project/` and `/projects/sample-project-2/`

## Task Commits

Each task was committed atomically:

1. **Task 1: Create project detail page with dynamic routing** - `1dab639` (feat)

## Files Created/Modified

- `src/pages/projects/[slug].astro` — Created: dynamic project detail page (175 lines)
- `src/pages/index.astro` — Modified: `project.id` -> `project.slug` for correct link routing

## Decisions Made

- Used `entry.slug` (not `entry.id`) for `params.slug` in `getStaticPaths` — Astro 4.16 generates `entry.id = "sample-project.md"` (includes extension), which produced `/projects/sample-project.md/` URLs. `entry.slug = "sample-project"` produces clean URLs. This also required updating `index.astro` links.
- Prev/next props passed from `getStaticPaths` — never re-queried the collection in the template (anti-pattern per RESEARCH.md)
- Gallery images use `alt=""` — these are decorative project images; project title is in the heading above per UI-SPEC accessibility contract
- `loading="eager"` on cover image (above the fold), `loading="lazy"` on gallery images (below the fold)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed entry.id producing .md-suffixed URLs**
- **Found during:** Task 1 verification
- **Issue:** RESEARCH.md stated "In Astro 4, `entry.id` is the slug (filename without extension)" — this is incorrect for Astro 4.16. The generated `.astro/astro/content.d.ts` shows `id: "sample-project.md"` and `slug: "sample-project"`. Using `entry.id` produced `/projects/sample-project.md/` URLs failing the acceptance criteria.
- **Fix:** Changed `params: { slug: entry.id }` to `params: { slug: entry.slug }` in `getStaticPaths`. Changed prev/next href from `prev.id`/`next.id` to `prev.slug`/`next.slug`. Also fixed `index.astro` links from `project.id` to `project.slug` for consistency.
- **Files modified:** `src/pages/projects/[slug].astro`, `src/pages/index.astro`
- **Commit:** `1dab639` (included in task commit)

## Known Stubs

- Project cover and gallery images are referenced by path (e.g., `/images/projects/acme/cover.jpg`) but the actual files must be placed in `public/images/...` by the site owner. The rendering logic is fully wired; only image files are missing.

## Threat Flags

No new threat surface beyond what the threat model anticipates.

- T-02-05 (reverse tabnabbing on liveUrl): mitigated — `rel="noopener noreferrer"` on `target="_blank"` live demo link
- T-02-06 (route params): accepted — static site, routes computed at build time
- T-02-07 (project data disclosure): accepted — all content is intentionally public portfolio material

## Issues Encountered

- Astro 4.16 `entry.id` includes file extension (`.md`), contradicting RESEARCH.md note. Fixed using `entry.slug` which produces clean slugs. `entry.slug` is available (not yet removed) in Astro 4.16 per generated types.

## User Setup Required

Place actual image files in `public/`:
- `public/images/projects/{slug}/cover.jpg` (cover image per project)
- `public/images/projects/{slug}/*.jpg` (gallery images per project)

## Next Phase Readiness

- All Phase 2 plans complete — portfolio has home grid, project detail pages, and about page
- Dynamic routing works correctly for all current and future project entries
- Prev/next navigation correct for 2-entry collection; scales automatically as projects are added

---
*Phase: 02-content-pages*
*Completed: 2026-04-15*
