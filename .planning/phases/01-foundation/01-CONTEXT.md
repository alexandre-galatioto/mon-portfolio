# Phase 1: Foundation - Context

**Gathered:** 2026-04-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Astro project skeleton with content model, nav component, and design system in place — ready to receive pages. This phase does NOT build any content pages (home, project, about) — those are Phase 2. Scope: project scaffold, Astro content collections schema, navigation component (desktop + mobile), and design tokens (typography + CSS custom properties).

</domain>

<decisions>
## Implementation Decisions

### Typography
- **D-01:** Self-hosted fonts using Neue Haas Unica family — files placed in `public/fonts/`, declared via `@font-face` in a global CSS file
- **D-02:** Font role mapping:
  - `NeueHaasUnica-Regular.woff2` → body text, descriptions
  - `NeueHaasUnica-Medium.woff2` → nav links, labels, captions
  - `NeueHaasUnica-Bold.woff2` → page headings, project titles
  - `NeueHaasUnica-Italic.woff2` → emphasis, pull quotes
- **D-03:** Single typeface family throughout — no secondary font

### CSS Approach
- **D-04:** Vanilla CSS with CSS custom properties — no Tailwind, no CSS Modules
- **D-05:** Component styles written in Astro `<style>` blocks (scoped by default)
- **D-06:** A global `src/styles/tokens.css` file defines CSS custom properties for colors, spacing, typography scale, and font-family variables
- **D-07:** Global resets and base styles in `src/styles/global.css`, imported in the root layout

### Content Model Schema
- **D-08:** Astro content collections for projects — each project is a `.md` file in `src/content/projects/`
- **D-09:** Front matter schema (defined via Zod in `src/content/config.ts`):
  ```
  title: string (required)
  description: string (required)
  cover: string (required) — path to cover image used on home page
  images: string[] (required) — array of image paths for project page gallery
  order: number (required) — controls display order on home page (lower = first)
  liveUrl: string (optional) — external demo URL; omit if no demo
  featured: boolean (optional, default false) — for future use in Phase 2
  ```
- **D-10:** Cover image and images array are separate fields — cover is the single thumbnail for the home page; images array is the full gallery for the project page
- **D-11:** An About page uses a separate Markdown file (`src/content/about/index.md` or similar) to keep bio text editable without code changes

### Navigation Component
- **D-12:** Nav layout: name/logo left, Work and About links right — minimal top bar
- **D-13:** Scroll behavior: nav hides on scroll down, reappears on scroll up — implemented via an inline `<script>` block inside the nav `.astro` component (not a bundled JS file, compliant with PERF-02)
- **D-14:** Mobile breakpoint: hamburger menu collapses nav on mobile — a hamburger icon replaces the link list
- **D-15:** Mobile nav opens as a full-screen overlay covering the full viewport, showing nav links centered — implemented via inline `<script>` toggle + CSS
- **D-16:** No animations beyond nav hide/show — per DSGN-04; overlay open/close may use a simple opacity/visibility transition but no decorative motion

### Claude's Discretion
- Exact CSS custom property naming conventions (e.g. `--color-bg`, `--font-size-base`)
- Spacing scale values
- Nav bar height and padding
- Hamburger icon design (lines vs X)
- Scroll threshold before nav hides (e.g. 80px)
- Placeholder project sample file content

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in decisions above and in:

### Requirements
- `.planning/REQUIREMENTS.md` — Full requirements list; Phase 1 requirements: NAV-01, NAV-02, NAV-03, NAV-04, CONT-01, CONT-02, CONT-03, CONT-04, DSGN-01, DSGN-04, PERF-02, PERF-03
- `.planning/ROADMAP.md` § Phase 1 — Success criteria and phase boundary

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, no existing code

### Established Patterns
- None — this phase establishes the patterns

### Integration Points
- Phase 2 will consume: Astro content collections schema (CONT-01–04), layout component, nav component, and CSS tokens defined here
- All subsequent components will import tokens from `src/styles/tokens.css`

</code_context>

<specifics>
## Specific Ideas

- Font family: Neue Haas Unica — the user owns the font files and will place them in `public/fonts/`
- Expected file names: `NeueHaasUnica-Regular.woff2`, `NeueHaasUnica-Medium.woff2`, `NeueHaasUnica-Bold.woff2`, `NeueHaasUnica-Italic.woff2`

</specifics>

<deferred>
## Deferred Ideas

- `featured` flag is defined in the content schema but rendering logic (e.g. highlighted row on home page) is deferred to Phase 2
- None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-04-15*
