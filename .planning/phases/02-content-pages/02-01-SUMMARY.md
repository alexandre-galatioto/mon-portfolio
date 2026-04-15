---
phase: 02-content-pages
plan: 01
subsystem: ui
tags: [astro, content-collections, zod, css-tokens, typography]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Design tokens, global CSS, BaseLayout, content collections scaffold
provides:
  - Updated Zod schemas for projects (type field, no featured) and about (portrait, social URLs)
  - Sample content files conforming to new schemas
  - Bold 700 @font-face declaration and --font-weight-bold CSS token
  - Global footer in BaseLayout with exact copyright text
affects:
  - 02-02 (home page)
  - 02-03 (project detail page)
  - 02-04 (about page)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Zod schema as source of truth for content collection field requirements"
    - "Social links in front matter not Markdown body for structured data access"
    - "Global footer via BaseLayout.astro scoped styles"

key-files:
  created: []
  modified:
    - src/content/config.ts
    - src/content/projects/sample-project.md
    - src/content/projects/sample-project-2.md
    - src/content/about/index.md
    - src/styles/tokens.css
    - src/styles/global.css
    - src/layouts/BaseLayout.astro

key-decisions:
  - "type replaces featured in projects schema — typed category string more flexible than boolean flag (D-16, D-18)"
  - "Social URLs moved to about front matter for programmatic access in Wave 2 pages (D-14)"
  - "Footer placed in BaseLayout for universal coverage across all pages (D-15)"

patterns-established:
  - "Schema-first content: Zod validates at build time, invalid front matter fails the build"
  - "Front matter for structured data, body for prose only"

requirements-completed: [ABOUT-04]

# Metrics
duration: 4min
completed: 2026-04-15
---

# Phase 2 Plan 01: Foundation Updates Summary

**Zod schemas updated with type/portrait/social URL fields, Bold 700 @font-face and token added, and global footer with copyright text wired into BaseLayout**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-15T13:23:00Z
- **Completed:** 2026-04-15T13:27:14Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Updated projects Zod schema: replaced `featured: boolean` with `type: string`, both sample project files updated and validated
- Updated about Zod schema: added `portrait`, `linkedinUrl`, `instagramUrl` fields; about/index.md updated with real URLs in front matter
- Added `--font-weight-bold: 700` CSS custom property to tokens.css and matching @font-face block for NeueHaasUnica-Bold.woff2
- Added global `<footer class="site-footer">` to BaseLayout with exact text "Alexandre Galatioto (c)2026" using surface/muted design tokens
- Astro build passes cleanly with all schema changes — zero warnings

## Task Commits

Each task was committed atomically:

1. **Task 1: Update schemas and sample content** - `c300e0d` (feat)
2. **Task 2: Add Bold font token and global footer** - `e090b02` (feat)

**Plan metadata:** _(to be recorded after final docs commit)_

## Files Created/Modified
- `src/content/config.ts` - Updated Zod schemas: projects has type string, about has portrait + social URLs
- `src/content/projects/sample-project.md` - Added `type: "Brand Identity"`, removed `featured`
- `src/content/projects/sample-project-2.md` - Added `type: "Editorial Design"`, removed `featured`
- `src/content/about/index.md` - Added portrait, linkedinUrl, instagramUrl to front matter; social links removed from body
- `src/styles/tokens.css` - Added `--font-weight-bold: 700` after medium token
- `src/styles/global.css` - Added NeueHaasUnica-Bold.woff2 @font-face block at 700 weight
- `src/layouts/BaseLayout.astro` - Added site-footer element and scoped styles

## Decisions Made
- Used `type: z.string()` over an enum — allows flexible category values without schema changes for new project types
- Moved social links from Markdown body inline links to front matter fields — enables programmatic access without Markdown parsing
- Footer appended after `</html>` as scoped `<style>` block per Astro convention for component-level styles

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None - Astro build passed on first attempt, all Zod validations passed with updated content files.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All Wave 2 plans (home page, project detail, about) can now proceed in parallel
- Projects schema provides `type` field for any category filtering or display on home page
- About schema has `portrait` and social URL fields ready for page construction
- Bold weight available as `var(--font-weight-bold)` for headings
- Footer renders universally via BaseLayout — no per-page footer work needed

---
*Phase: 02-content-pages*
*Completed: 2026-04-15*
