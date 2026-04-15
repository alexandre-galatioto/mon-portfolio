---
phase: 02-content-pages
plan: 02
subsystem: ui
tags: [astro, content-collections, css-grid, responsive, portfolio]

# Dependency graph
requires:
  - phase: 02-content-pages
    plan: 01
    provides: Updated Zod schemas (projects type field, about portrait + social URLs), design tokens, BaseLayout with footer
provides:
  - Home page with 2-column project image grid (desktop) / 1-column (mobile)
  - About page with portrait + bio + LinkedIn/Instagram links
affects:
  - 02-03 (project detail page — shares project content collection)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "getCollection for multi-entry content (projects list)"
    - "getEntry + render() for single known content entry (about page)"
    - "CSS grid with responsive breakpoint via @media (max-width: 640px)"
    - "Conditional rendering for optional front matter fields (social links)"

key-files:
  created:
    - src/pages/about.astro
  modified:
    - src/pages/index.astro

key-decisions:
  - "Images-only home page (no text overlays) — locked user decision D-02, overrides HOME-05"
  - "project.id used over project.slug — Astro 4 convention per RESEARCH.md"
  - "getEntry('about', 'index') not getCollection — single known entry, no list needed"
  - "render(entry) imported from astro:content — Astro 4 API (not entry.render())"
  - "rel=noopener noreferrer on all target=_blank links — mitigates T-02-03 reverse tabnabbing"

# Metrics
duration: 2min
completed: 2026-04-15
---

# Phase 2 Plan 02: Home Page and About Page Summary

**2-column project image grid on home page and two-column portrait+bio layout on about page, both fully responsive with design tokens and a clean Astro build**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-15T13:30:25Z
- **Completed:** 2026-04-15T13:31:25Z
- **Tasks:** 2
- **Files modified:** 2 (1 replaced, 1 created)

## Accomplishments

- Home page (`index.astro`) replaced placeholder with a working 2-column project image grid: images sorted by `data.order`, each linked to `/projects/{project.id}`, 3:2 aspect ratio with `object-fit: cover`, no text overlays, `loading="lazy"`, responsive 1-column at ≤640px
- About page (`about.astro`) created: portrait image on left, bio text (`<Content />`) and social links on right, conditional rendering for optional LinkedIn/Instagram URLs, `rel="noopener noreferrer"` on external links, responsive single-column stack at ≤640px
- `npx astro build` passes cleanly in 561ms — 2 pages generated (`/index.html`, `/about/index.html`)

## Task Commits

Each task was committed atomically:

1. **Task 1: Build home page grid** - `de6ccd8` (feat)
2. **Task 2: Build about page** - `d4d8bc6` (feat)

## Files Created/Modified

- `src/pages/index.astro` — Replaced placeholder with full project image grid implementation
- `src/pages/about.astro` — Created new about page with portrait, bio, and social links

## Decisions Made

- Images-only grid on home page (no project title text) — locked decision D-02, overrides HOME-05 requirement per user direction
- `project.id` (not `project.slug`) — Astro 4 convention documented in RESEARCH.md
- Used `render(entry)` imported from `astro:content` — Astro 4 API; not deprecated `entry.render()`
- All `target="_blank"` links include `rel="noopener noreferrer"` to prevent reverse tabnabbing (T-02-03 mitigation)

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

- Portrait image at `/images/about/portrait.jpg` — path set in `src/content/about/index.md` front matter; actual image file must be placed in `public/images/about/portrait.jpg` by the site owner before deployment
- Project cover images referenced in sample project front matter (`/images/projects/...`) must likewise be placed in `public/` by the site owner

These are content placeholders, not code stubs. The rendering logic is fully wired; only the image files are missing.

## Threat Flags

No new threat surface introduced beyond what the threat model anticipates.

- T-02-03 (reverse tabnabbing on external links): mitigated — `rel="noopener noreferrer"` applied to all `target="_blank"` anchor elements in `about.astro`
- T-02-04 (project title in img alt text): accepted — public portfolio content, intentional

## Issues Encountered

None — build passed on first attempt, all Astro content collection queries resolved correctly.

## User Setup Required

Place actual image files in `public/`:
- `public/images/about/portrait.jpg` (about page portrait)
- `public/images/projects/{slug}-cover.jpg` (one per project)

## Next Phase Readiness

- Wave 2 Plan 03 (project detail page) can proceed — projects content collection is unchanged
- Both pages consume design tokens correctly via CSS custom properties
- Footer renders on both pages via BaseLayout — no per-page work needed

---
*Phase: 02-content-pages*
*Completed: 2026-04-15*
