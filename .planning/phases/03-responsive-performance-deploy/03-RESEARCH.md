# Phase 3: Responsive, Performance & Deploy — Research

**Researched:** 2026-04-16
**Domain:** Astro 4 image optimization, responsive CSS, Netlify static deployment
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Deploy on Netlify — user already has an account, will connect the repo manually
- **D-02:** Build config included in the project (netlify.toml) — build command: `npm run build`, publish directory: `dist/`
- **D-03:** Custom domain will be configured — plan includes DNS setup guidance
- **D-04:** Auto-deploy triggered on git push to main branch
- **D-05:** Move project images from `public/` to `src/assets/` so Astro's Image component auto-generates optimized WebP with responsive srcset at build time — update image paths in Markdown front matter accordingly
- **D-06:** Font loading: preload the Regular (400) weight in `<head>` with `font-display: swap`; other weights (Medium, Bold, Italic) load on demand
- **D-07:** Target: pages load in under 2 seconds AND Lighthouse performance score 90+
- **D-08:** Images preserve their original aspect ratio and fill the container width — height adjusts naturally. No cropping on project gallery pages. Home page keeps its existing 3:2 cover crop.
- **D-09:** Max-width cap (~1200–1400px) on image containers — images stop growing on very wide screens and center on the page. Prevents stretched/oversized images on ultrawide monitors.
- **D-10:** Existing breakpoints (640px in pages, 768px in nav) remain as-is — no unification needed since they serve different purposes (content layout vs navigation collapse)
- **D-11:** Ensure all 2-column layouts (home grid, project text section, about page) collapse gracefully to single column on mobile

### Claude's Discretion

- Exact max-width value within the 1200–1400px range
- Specific Netlify build settings beyond the basics
- Whether to add `netlify.toml` vs configure in Netlify dashboard
- Font preload tag placement details
- Any additional Lighthouse optimizations (CLS, accessibility tweaks) to reach 90+
- Tablet-specific layout adjustments if needed between mobile and desktop

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DSGN-02 | Site is fully responsive on mobile, tablet, and desktop | Responsive contract documented in UI-SPEC; CSS audit of existing breakpoints confirms 640px/768px coverage; no new breakpoints needed |
| DSGN-03 | Images fill the container width on all screen sizes | `width: 100%` pattern already in codebase; max-width 1280px cap from UI-SPEC; gallery images need fixed-height removal |
| PERF-01 | Pages load in under 2 seconds on a standard connection | Image migration to src/assets activates Astro WebP+srcset pipeline; font preload eliminates FOUT; eager LCP image prevents Lighthouse penalty |
| PERF-04 | Site is deployable to Netlify or Vercel via git push | netlify.toml with [build] + cache headers; no adapter required for static output |
</phase_requirements>

---

## Summary

Phase 3 is a polish-and-ship phase. No new pages or visual components are added. The work falls into three independent workstreams: (1) image migration that unlocks Astro's optimization pipeline, (2) responsive CSS verification and the max-width cap, and (3) Netlify deployment configuration.

The most consequential finding from research is that Astro's `<Image>` component does NOT generate WebP or responsive srcset for images referenced as public-folder string paths. The current `[slug].astro` and `index.astro` both use string paths (`"/images/projects/..."`) — the `widths` attribute in the existing code is silently ignored, producing a plain `<img>` tag. Migration to `src/assets/` with the `image()` schema helper is required to activate the optimization pipeline. [VERIFIED: docs.astro.build/en/guides/images/]

The content images (project photos, about portrait) do not yet physically exist in the repo — only placeholder paths are in the Markdown front matter. This means the image migration workstream is: (a) create the `src/assets/` directory structure, (b) update the schema in `config.ts` to use the `image()` helper, (c) update front matter in each `.md` file to use relative paths, and (d) update page components to pass the imported image object. The real image files will be added by the user before or during this phase. The planner should structure tasks so schema/code changes can be done without the actual files present (Astro builds gracefully handle missing images at dev time if content is not rendered).

Netlify deployment for a static Astro site requires no adapter. The `netlify.toml` with `[build]` settings plus font cache headers is all that is needed. Connecting the repo via Netlify dashboard triggers auto-deploy on push to main. [VERIFIED: docs.astro.build/en/guides/deploy/netlify/]

**Primary recommendation:** Execute workstreams in order — image migration first (unblocks optimization), then responsive CSS verification + max-width cap, then Netlify config — to allow Lighthouse testing against the optimized build before declaring phase complete.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Image optimization (WebP, srcset) | Frontend Server (Astro SSG build) | — | Astro processes images at build time, not at runtime |
| Responsive layout CSS | Browser / Client | — | Pure CSS media queries, no JS or server logic |
| Font preload | Frontend Server (Astro SSG) | Browser | `<link rel="preload">` rendered in BaseLayout, executed by browser |
| Netlify deployment config | CDN / Static | — | netlify.toml governs build pipeline and CDN cache headers |
| Lighthouse / performance validation | Developer tooling | — | Run locally and against live URL, not an architectural tier |
| Content schema (image() helper) | Frontend Server (Astro SSG build) | — | config.ts schema validated at build time |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | 4.16.19 (installed) | SSG framework, image optimization pipeline | Already the project's framework; no additions needed |
| astro:assets `<Image>` | built-in (Astro 4+) | WebP generation, responsive srcset at build time | Official Astro solution; zero extra dependencies |
| netlify.toml | config file (no package) | Codify build command, publish dir, cache headers | Standard Netlify practice; prevents dashboard drift |

[VERIFIED: npm registry — Astro 4.16.19 confirmed installed at `/Users/lemondebrule/Downloads/_Claude/node_modules/astro/package.json`]

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @astrojs/netlify | NOT needed | Netlify adapter | Only for SSR/on-demand rendering — skip for static output |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `image()` schema helper | Keep `z.string()` and use `<img>` tags | Simpler schema, but loses all WebP/srcset optimization — defeats D-05 |
| netlify.toml | Netlify dashboard manual config | Works but is not version-controlled; prefer file |

**Installation:**
No new packages required. Astro 4's image optimization is built in.

---

## Architecture Patterns

### System Architecture Diagram

```
Markdown front matter (src/content/projects/*.md)
  │ relative image paths (e.g., "./images/cover.jpg")
  ▼
Astro build pipeline
  │ config.ts schema: image() helper resolves paths → ImageMetadata objects
  │ <Image> component: generates WebP variants at widths [640, 960, 1280, 1600]
  │ outputs srcset + sizes attributes in HTML
  ▼
dist/ (static HTML + optimized image files)
  │
  ▼
Netlify CDN
  │ netlify.toml: build command, publish dir, cache headers
  │ /fonts/* → Cache-Control: immutable 1 year
  │ /*.html → Cache-Control: must-revalidate
  ▼
Browser
  │ Downloads smallest image matching viewport via srcset
  │ Renders with CSS: width 100%, max-width 1280px, margin-inline auto
  │ No JS, no runtime optimization
```

### Recommended Project Structure

```
src/
├── assets/
│   ├── images/
│   │   ├── projects/
│   │   │   ├── acme/
│   │   │   │   ├── cover.jpg     # replaces public/images/projects/acme/cover.jpg
│   │   │   │   ├── 01.jpg
│   │   │   │   └── ...
│   │   │   └── flux/
│   │   │       └── ...
│   │   └── about/
│   │       └── portrait.jpg
├── content/
│   ├── config.ts          # updated: image() helper for cover, images, portrait
│   ├── projects/*.md      # updated: relative paths (e.g., ../assets/images/...)
│   └── about/index.md     # updated: relative path for portrait
├── layouts/
│   └── BaseLayout.astro   # updated: add font preload <link>
└── pages/
    ├── index.astro         # updated: max-width cap, eager first image, <Image>
    ├── about.astro         # updated: max-width cap, <Image>
    └── projects/[slug].astro  # updated: max-width cap, sizes, image() objects
netlify.toml               # new
```

### Pattern 1: Image Schema Migration (config.ts)

**What:** Replace `z.string()` with the `image()` helper so Astro can resolve, validate, and optimize local images from front matter.
**When to use:** Any content collection field that references a local image file intended for optimization.

```typescript
// Source: docs.astro.build/en/guides/images/
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const projects = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title:       z.string(),
    description: z.string(),
    cover:       image(),                  // was z.string()
    images:      z.array(image()),         // was z.array(z.string())
    order:       z.number(),
    liveUrl:     z.string().url().optional(),
    type:        z.string(),
  }),
});

const about = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    portrait:     image(),                 // was z.string()
    linkedinUrl:  z.string().url().optional(),
    instagramUrl: z.string().url().optional(),
  }),
});
```

[VERIFIED: docs.astro.build/en/guides/images/ — image() helper pattern]
[VERIFIED: WebSearch cross-reference — z.array(image()) is the correct pattern for image arrays]

### Pattern 2: Front Matter Path Update

**What:** Change front matter image values from absolute public-folder strings to paths relative to the Markdown file.
**When to use:** After schema is updated to use image(); paths must be relative, not absolute.

```yaml
# Before (public/ string — no optimization):
cover: "/images/projects/acme/cover.jpg"
images:
  - "/images/projects/acme/01.jpg"

# After (relative path from .md file location — optimization active):
cover: "../../assets/images/projects/acme/cover.jpg"
images:
  - "../../assets/images/projects/acme/01.jpg"
```

Note: Path is relative from `src/content/projects/sample-project.md` to `src/assets/`. [VERIFIED: docs.astro.build/en/guides/images/]

### Pattern 3: Component Image Usage

**What:** Pass the resolved ImageMetadata object (not a string) to `<Image src={...}>`.
**When to use:** After schema migration, `data.cover` is now an ImageMetadata object, not a string.

```astro
<!-- Source: docs.astro.build/en/guides/images/ -->
<!-- [slug].astro — gallery images -->
{data.images.map((img) => (
  <Image
    src={img}
    alt=""
    widths={[640, 960, 1280, 1600]}
    sizes="(max-width: 640px) calc(100vw - 32px), min(calc(100vw - 64px), 1280px)"
    format="webp"
    loading="lazy"
  />
))}

<!-- index.astro — home cover (first image eager for LCP) -->
{sorted.map((project, i) => (
  <li class="project-cell">
    <a href={`/projects/${project.slug}`}>
      <Image
        src={project.data.cover}
        alt={project.data.title}
        widths={[640, 960, 1280, 1600]}
        sizes="(max-width: 640px) 100vw, 50vw"
        format="webp"
        loading={i === 0 ? 'eager' : 'lazy'}
      />
    </a>
  </li>
))}
```

[VERIFIED: docs.astro.build/en/reference/modules/astro-assets/ — widths + sizes props confirmed]

### Pattern 4: Max-Width Container Cap

**What:** Prevent images from growing beyond 1280px on ultrawide screens while keeping existing margin-inline padding tokens.
**When to use:** Applied to `.project-grid`, `.project-cover`, `.project-gallery`, `.about-portrait` containers.

```css
/* Applied to container elements, not individual images */
/* Source: UI-SPEC D-09; Claude's discretion (1280px value) */
.project-gallery {
  max-width: 1280px;
  margin-inline: auto;
  /* existing padding-inline tokens remain on inner elements */
}
```

[ASSUMED: The correct CSS selector structure — verified the containers exist by reading page files, but exact implementation requires testing at wide viewports]

### Pattern 5: Font Preload in BaseLayout

**What:** Add `<link rel="preload">` for the Regular weight font before any stylesheet link.
**When to use:** Add once to `BaseLayout.astro` `<head>`, above the CSS imports.

```html
<!-- Source: UI-SPEC D-06; web.dev/font-display -->
<link
  rel="preload"
  href="/fonts/NeueHaasUnica-Regular.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

`crossorigin` attribute is required even for same-origin fonts when using `rel="preload"` — omitting it causes the browser to fetch the font twice. [CITED: web.dev/articles/preload-critical-assets]

### Pattern 6: netlify.toml

**What:** Codify build settings and cache headers for deployment.

```toml
# Source: docs.astro.build/en/guides/deploy/netlify/
[build]
  command = "npm run build"
  publish = "dist/"

[[headers]]
  for = "/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

[VERIFIED: docs.astro.build/en/guides/deploy/netlify/ — build config confirmed; no adapter needed for static output]

### Anti-Patterns to Avoid

- **Using `z.string()` for image fields with optimization intent:** The `<Image>` component silently falls back to a plain `<img>` tag for public-folder string paths. No error is thrown. `widths` and `format` props are ignored.
- **Applying `max-width` to the `<img>` element instead of the container:** This breaks the responsive srcset calculation because the browser computes sizes against the layout width of the parent, not the `<img>` itself.
- **Using `loading="lazy"` on the first visible home page image:** Forces the browser to defer the LCP image, hurting Lighthouse score. The first project cover should use `loading="eager"`.
- **Omitting `crossorigin` on font preload:** Causes double font download, wasting bandwidth and defeating the preload purpose.
- **Adding `@astrojs/netlify` adapter for a static site:** Unnecessary and changes the output mode. Keep `output: 'static'` in `astro.config.mjs`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| WebP conversion + srcset | Custom image processing script | Astro `<Image>` + `image()` schema helper | Astro handles format conversion, dimension inference, cache-busting hashes |
| Font loading strategy | Custom JS font loader | CSS `font-display: swap` + `<link rel="preload">` | Browser-native, zero JS, works with SSG |
| Responsive image sizing hints | Manual srcset strings | Astro `widths` + `sizes` props | Astro generates the srcset attribute from `widths` array |
| Deployment cache headers | Netlify function or meta tags | `netlify.toml` `[[headers]]` blocks | CDN-level headers, zero runtime cost |

---

## Common Pitfalls

### Pitfall 1: Image Optimization Silently Not Working

**What goes wrong:** `<Image>` component is used, but images still deliver the original format at full size. No build error. Lighthouse still reports unoptimized images.
**Why it happens:** The `src` prop receives a string path (from `public/` or remote URL) instead of an imported `ImageMetadata` object. Astro cannot transform images it does not own at build time.
**How to avoid:** Always use the `image()` schema helper in `config.ts` and ensure front matter paths are relative (not absolute strings starting with `/`). Verify the build output in `dist/` — optimized images appear as hashed filenames like `cover.abc123.webp`.
**Warning signs:** Build output images have the same filename as the source; no `.webp` files in `dist/`; `sizes` attribute absent from rendered HTML.

### Pitfall 2: Front Matter Relative Paths Breaking

**What goes wrong:** After updating config.ts to use `image()`, Astro throws a content collection validation error: `"Expected type "image", received type "string"`.
**Why it happens:** The front matter still contains the old absolute string paths (`"/images/projects/..."`) instead of relative paths. The `image()` helper requires paths relative to the Markdown file's location.
**How to avoid:** Update both config.ts and all `.md` front matter files in the same step. Paths must be relative: from `src/content/projects/sample-project.md` to `src/assets/images/projects/acme/cover.jpg`, the correct relative path is `../../assets/images/projects/acme/cover.jpg`.
**Warning signs:** `astro build` fails with schema validation errors on content collections.

### Pitfall 3: Gallery Images Showing with Wrong Height

**What goes wrong:** Gallery images appear cropped or with a fixed height instead of displaying at their natural proportions.
**Why it happens:** CSS has a `height` constraint (fixed pixels or `object-fit: cover`) on `.project-gallery img`. The Astro `<Image>` component injects `width` and `height` HTML attributes (for CLS prevention) that browsers may interpret as aspect-ratio hints — combined with `height: auto` in CSS, this is correct, but a conflicting CSS `height` rule overrides it.
**How to avoid:** Verify `.project-gallery img` has no `height` CSS rule. The rendered `<img>` should have `width` and `height` attributes for CLS but CSS must allow `height: auto` (or omit height). See UI-SPEC D-08.
**Warning signs:** Project gallery images appear cropped to a consistent height regardless of image proportions.

### Pitfall 4: Max-Width Cap Breaking Mobile Margins

**What goes wrong:** After adding `max-width: 1280px; margin-inline: auto` to containers, mobile layout loses its `padding-inline: var(--space-md)` margin and images touch the screen edge.
**Why it happens:** The max-width was applied to the wrong element, or `margin-inline: auto` overrode the existing `padding-inline` token on the wrong selector.
**How to avoid:** The `max-width` + `margin-inline: auto` goes on the outer container (`.project-gallery`, `.project-grid`, etc.). The `padding-inline` tokens remain on the same container or inner elements. At mobile widths, the viewport is narrower than 1280px so max-width has no effect — the existing `padding-inline: var(--space-md)` media query continues to apply.
**Warning signs:** Mobile layout shows images flush to screen edges; no visible padding on sides.

### Pitfall 5: Lighthouse CLS from Missing Image Dimensions

**What goes wrong:** Lighthouse reports CLS (Cumulative Layout Shift) > 0.1 from images.
**Why it happens:** Images without explicit `width` and `height` attributes cause the browser to not reserve space during page load, causing content to jump when images load.
**How to avoid:** Astro's `<Image>` component automatically adds `width` and `height` to the rendered `<img>` when using the `image()` schema helper (dimensions are inferred at build time from the actual file). The about page's `<img>` tag (currently using `<img src={data.portrait}>`) should be migrated to `<Image>` for the same benefit.
**Warning signs:** Lighthouse CLS score > 0.1; visual content jumps during page load.

---

## Code Examples

### Home Page: Complete Updated Image Block

```astro
<!-- Source: derived from docs.astro.build/en/guides/images/ + existing index.astro pattern -->
<!-- index.astro — sorted is the ordered projects array -->
{sorted.map((project, i) => (
  <li class="project-cell">
    <a href={`/projects/${project.slug}`}>
      <Image
        src={project.data.cover}
        alt={project.data.title}
        widths={[640, 960, 1280, 1600]}
        sizes="(max-width: 640px) 100vw, 50vw"
        format="webp"
        loading={i === 0 ? 'eager' : 'lazy'}
      />
    </a>
  </li>
))}
```

### Sizes Attribute Values

```
Home grid images (2-col desktop, 1-col mobile):
  sizes="(max-width: 640px) 100vw, 50vw"

Gallery + cover images (full-width, 1280px max):
  sizes="(max-width: 640px) calc(100vw - 32px), min(calc(100vw - 64px), 1280px)"
```

[CITED: docs.astro.build/en/reference/modules/astro-assets/ — sizes pairs with widths]
[CITED: UI-SPEC — specific sizes values documented]

### netlify.toml (complete)

```toml
[build]
  command = "npm run build"
  publish = "dist/"

[[headers]]
  for = "/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

[VERIFIED: docs.astro.build/en/guides/deploy/netlify/]

---

## Runtime State Inventory

Step 2.5: SKIPPED — This is not a rename/refactor/migration phase. No stored data, live service config, OS-registered state, secrets, or build artifacts reference a renamed entity.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Astro build | ✓ | v24.14.1 | — |
| npm | Package management | ✓ | 11.11.0 | — |
| Astro | Framework | ✓ | 4.16.19 | — |
| netlify CLI | Deploy (optional) | ✗ | — | Deploy via Netlify dashboard (manual git connect) |
| Lighthouse | Performance audit | [ASSUMED] available via Chrome DevTools | — | WebPageTest.org as fallback |

**Missing dependencies with no fallback:**
- None that block execution.

**Missing dependencies with fallback:**
- `netlify` CLI: Not installed. The user connects the repo via Netlify dashboard (D-01 states manual connection). No CLI required for this deployment method.
- Lighthouse CLI: Not verified as installed. Chrome DevTools Lighthouse panel serves as the primary audit tool. WebPageTest.org works as a fallback for 2-second load time check.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `z.string()` for image paths, manual `<img src>` | `image()` schema helper + `<Image>` component | Astro 3+ (stable in Astro 4) | Automatic WebP, srcset, CLS prevention |
| `@astrojs/image` integration (deprecated) | `astro:assets` built-in | Astro 3.0 (2023) | No separate package needed |
| Manual `widths` on `public/` path images | `image()` helper on `src/` images | Astro 3+ | `widths` is ignored for public/ paths — must use `image()` |
| Netlify adapter for all deployments | Adapter only for SSR; static needs none | Astro 2+ | Simpler config, smaller bundle for static sites |

**Deprecated/outdated:**
- `@astrojs/image`: Replaced by `astro:assets` built-in. Do not install.
- `experimental.assets` flag: Was required in Astro 2; removed in Astro 3+. Not needed.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Max-width on container elements (not `<img>`) is the correct CSS pattern without breaking srcset sizes calculation | Architecture Patterns — Pattern 4 | Layout mismatch; may need to adjust `sizes` attribute |
| A2 | Lighthouse DevTools panel is available (Chrome installed) for Lighthouse audits | Environment Availability | Use WebPageTest.org fallback; does not block implementation |
| A3 | Real project images will be provided by the user before or during phase execution | Common Pitfalls / image migration | Without real images, optimization cannot be verified end-to-end; schema/code changes can be made speculatively |

---

## Open Questions

1. **Do real project images exist yet?**
   - What we know: `public/` directory contains only font files. Front matter references `/images/projects/acme/...` and `/images/projects/flux/...` which do not exist on disk.
   - What's unclear: When will the actual image files be provided? Will they be added to `src/assets/` directly, or to `public/` first?
   - Recommendation: Plan the image migration workstream so schema/code changes come first (Wave 1), and a verification step at the end confirms optimization is working once real images are added. Document image file placement instructions clearly for the user.

2. **Custom domain DNS configuration**
   - What we know: D-03 locks in custom domain setup; plan should include DNS guidance.
   - What's unclear: The specific domain name and registrar are unknown; DNS steps vary by registrar.
   - Recommendation: Include generic Netlify DNS setup steps (add CNAME/A record, enable HTTPS via Netlify's Let's Encrypt), note that exact steps depend on registrar.

---

## Security Domain

This is a static site with no authentication, no user input, no server-side code, and no third-party scripts (PERF-03). The attack surface is minimal. ASVS categories V2, V3, V4, V6 do not apply. V5 input validation is not applicable (no forms, no user-submitted data).

The only security-relevant configuration is the `netlify.toml` cache headers, which correctly distinguish mutable HTML (no-cache) from immutable font assets (1-year cache). This is standard practice and requires no library. [ASSUMED: standard web security guidance]

---

## Sources

### Primary (HIGH confidence)
- [docs.astro.build/en/guides/images/](https://docs.astro.build/en/guides/images/) — image() helper, src/ vs public/ behavior, migration pattern
- [docs.astro.build/en/reference/modules/astro-assets/](https://docs.astro.build/en/reference/modules/astro-assets/) — Image component props: widths, sizes, format, loading
- [docs.astro.build/en/guides/deploy/netlify/](https://docs.astro.build/en/guides/deploy/netlify/) — no adapter needed for static, netlify.toml config
- Codebase inspection — confirmed Astro 4.16.19 installed, existing CSS breakpoints, page structure, schema definition

### Secondary (MEDIUM confidence)
- [WebSearch cross-reference] — `z.array(image())` pattern confirmed across multiple community sources
- [UI-SPEC 03-UI-SPEC.md] — sizes attribute values, 1280px max-width, font preload tag (verified against docs)

### Tertiary (LOW confidence)
- Lighthouse audit guidance — based on training knowledge of Core Web Vitals; verify against current web.dev documentation if scores differ from expectations

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Astro 4.16.19 confirmed installed; no new packages needed; docs verified
- Architecture: HIGH — Image optimization behavior verified against official Astro docs
- Pitfalls: HIGH for image optimization pitfalls (verified via docs + GitHub issue); MEDIUM for CSS max-width pitfall (logic-derived)
- Deployment: HIGH — Netlify static deploy verified against official docs

**Research date:** 2026-04-16
**Valid until:** 2026-10-16 (Astro docs are stable for this version; Netlify deploy process is stable)
