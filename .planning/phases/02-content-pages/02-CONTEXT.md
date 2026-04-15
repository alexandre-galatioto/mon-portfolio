# Phase 2: Content Pages - Context

**Gathered:** 2026-04-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Build all three content pages — home, project detail, and about — with full layout, imagery, and linking. This phase also adds a global footer and a `type` field to the project content schema. Responsive polish and performance optimization are Phase 3.

</domain>

<decisions>
## Implementation Decisions

### Home Page Layout
- **D-01:** 2-column grid on desktop, 1-column on mobile — each cell is a clickable cover image linking to the project page
- **D-02:** Images only — no project titles, no text, no overlays on the home page
- **D-03:** Cover images displayed at 3:2 landscape aspect ratio (cropped/constrained via CSS)
- **D-04:** Small gap between grid items (8–16px)
- **D-05:** Images have horizontal page margins (padded, not full-bleed)
- **D-06:** Project order controlled by `order` field in Markdown front matter (existing schema)

### Project Page Structure
- **D-07:** Full-width cover image at the top of the page — same cover image as the home page, no text overlay
- **D-08:** Below the cover: 2-column text section — left column shows project name and project type; right column shows project description and optional live demo link
- **D-09:** Below the text section: project images from the `images[]` array, stacked vertically one per row with margins
- **D-10:** Bottom of page: prev/next navigation linking to adjacent projects — project name is the link text
- **D-11:** New schema field: `type: string (required)` — free text field for project type (e.g., "Web Design", "Illustration", "App UI")

### About Page Layout
- **D-12:** Two-column layout: portrait photo on the left, bio text on the right
- **D-13:** LinkedIn and Instagram links appear in the right column below the bio text
- **D-14:** New schema field in about collection: `portrait: string (required)` — path to portrait image, editable in Markdown front matter

### Global Footer
- **D-15:** Footer on every page: "Alexandre Galatioto ©2026" — added to BaseLayout

### Schema Changes
- **D-16:** Add `type: z.string()` to the projects collection schema in `src/content/config.ts`
- **D-17:** Add `portrait: z.string()` to the about collection schema in `src/content/config.ts`
- **D-18:** Remove `featured: z.boolean().default(false)` from the projects collection schema — no longer needed

### Claude's Discretion
- Exact gap size within the 8–16px range
- Cover image height on project pages (viewport percentage or fixed)
- Typography sizing for project name vs project type in the 2-column text section
- Prev/next navigation styling
- Footer typography and spacing
- How the 2-column layouts collapse on mobile (about page, project text section)
- Markdown body content rendering on project pages (if any exists beyond the description)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — Phase 2 requirements: HOME-01 through HOME-05, PROJ-01 through PROJ-05, ABOUT-01 through ABOUT-04
- `.planning/ROADMAP.md` § Phase 2 — Success criteria and phase boundary

### Phase 1 Context
- `.planning/phases/01-foundation/01-CONTEXT.md` — Foundation decisions: typography, CSS approach, content model schema, nav component

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/layouts/BaseLayout.astro` — Root layout with Nav, `<main>` slot; footer will be added here
- `src/components/Nav.astro` — Navigation component with scroll hide/show and mobile hamburger
- `src/styles/tokens.css` — Design tokens (colors, spacing, typography) — use existing variables
- `src/styles/global.css` — Global resets and base styles
- `src/content/config.ts` — Zod schema for projects and about collections; needs `type` added to projects, `portrait` added to about, `featured` removed from projects

### Established Patterns
- Vanilla CSS with CSS custom properties in scoped Astro `<style>` blocks
- Astro content collections with Zod validation
- No client-side JS beyond inline `<script>` for nav behavior (PERF-02)

### Integration Points
- `src/pages/index.astro` — Currently a stub with placeholder comment; will become the home page
- New file needed: `src/pages/projects/[slug].astro` — Dynamic route for project detail pages
- New file needed: `src/pages/about.astro` — About page
- Sample project Markdown files need `type` field added to front matter
- About Markdown needs `portrait` field added to front matter

</code_context>

<specifics>
## Specific Ideas

- Home page is a visual grid — no text at all, just images. The work speaks for itself.
- Project page follows a clear hierarchy: cover image → metadata text → gallery images → navigation
- Prev/next links use the project name as link text — maintains the editorial, intentional feel
- Footer text is exactly: "Alexandre Galatioto ©2026"

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-content-pages*
*Context gathered: 2026-04-15*
