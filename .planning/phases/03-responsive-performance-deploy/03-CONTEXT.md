# Phase 3: Responsive, Performance & Deploy - Context

**Gathered:** 2026-04-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Cross-device responsive polish, performance validation (page load < 2s, Lighthouse 90+), and live deployment on Netlify. This phase does NOT add new pages or features — it validates and optimizes what Phases 1 and 2 built, then ships it.

</domain>

<decisions>
## Implementation Decisions

### Deployment Platform
- **D-01:** Deploy on Netlify — user already has an account, will connect the repo manually
- **D-02:** Build config included in the project (netlify.toml or equivalent) — build command: `npm run build`, publish directory: `dist/`
- **D-03:** Custom domain will be configured — plan includes DNS setup guidance
- **D-04:** Auto-deploy triggered on git push to main branch

### Performance Optimization
- **D-05:** Move project images from `public/` to `src/assets/` so Astro's Image component auto-generates optimized WebP with responsive srcset at build time — update image paths in Markdown front matter accordingly
- **D-06:** Font loading: preload the Regular (400) weight in `<head>` with `font-display: swap`; other weights (Medium, Bold, Italic) load on demand
- **D-07:** Target: pages load in under 2 seconds AND Lighthouse performance score 90+

### Image Fill Behavior
- **D-08:** Images preserve their original aspect ratio and fill the container width — height adjusts naturally. No cropping on project gallery pages. Home page keeps its existing 3:2 cover crop.
- **D-09:** Max-width cap (~1200–1400px) on image containers — images stop growing on very wide screens and center on the page. Prevents stretched/oversized images on ultrawide monitors.

### Responsive Strategy
- **D-10:** Existing breakpoints (640px in pages, 768px in nav) remain as-is — no unification needed since they serve different purposes (content layout vs navigation collapse)
- **D-11:** Ensure all 2-column layouts (home grid, project text section, about page) collapse gracefully to single column on mobile

### Claude's Discretion
- Exact max-width value within the 1200–1400px range
- Specific Netlify build settings beyond the basics
- Whether to add `netlify.toml` vs configure in Netlify dashboard
- Font preload tag placement details
- Any additional Lighthouse optimizations (CLS, accessibility tweaks) to reach 90+
- Tablet-specific layout adjustments if needed between mobile and desktop

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — Phase 3 requirements: DSGN-02, DSGN-03, PERF-01, PERF-04
- `.planning/ROADMAP.md` § Phase 3 — Success criteria and phase boundary

### Prior Phase Context
- `.planning/phases/01-foundation/01-CONTEXT.md` — Foundation decisions: typography, CSS approach, content model schema, nav component
- `.planning/phases/02-content-pages/02-CONTEXT.md` — Content page decisions: home grid layout, project page structure, about page layout, schema changes

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/styles/tokens.css` — Design tokens with spacing, typography, and color variables
- `src/styles/global.css` — Global resets and base styles
- `src/layouts/BaseLayout.astro` — Root layout wrapping all pages
- `src/components/Nav.astro` — Navigation with scroll hide/show and mobile hamburger (768px breakpoint)
- Astro `<Image>` component already used in `src/pages/projects/[slug].astro` with `sizes` attribute

### Established Patterns
- Vanilla CSS with custom properties in scoped Astro `<style>` blocks
- Media queries at 640px for page layouts, 768px for nav collapse
- No client-side JS beyond inline `<script>` for nav behavior (PERF-02 constraint)
- Astro `output: 'static'` in config — pure static HTML/CSS output

### Integration Points
- `astro.config.mjs` — May need Netlify adapter or build config adjustments
- `src/content/projects/*.md` — Front matter image paths need updating from `public/` to `src/assets/` references
- `src/pages/index.astro`, `src/pages/projects/[slug].astro`, `src/pages/about.astro` — All need responsive verification and image component updates
- `package.json` — May need `@astrojs/netlify` or image optimization dependencies

</code_context>

<specifics>
## Specific Ideas

- Portfolio site for an art director — image quality and presentation are paramount. Responsive behavior must preserve the editorial feel.
- Font-display: swap specifically for the Regular weight to ensure text is always visible during load.
- Images should never appear stretched or distorted — preserve the original composition the art director chose.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-responsive-performance-deploy*
*Context gathered: 2026-04-15*
