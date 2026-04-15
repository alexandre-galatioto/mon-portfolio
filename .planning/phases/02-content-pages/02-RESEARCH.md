# Phase 2: Content Pages - Research

**Researched:** 2026-04-15
**Domain:** Astro 4 content collections, dynamic routing, image handling, vanilla CSS layouts
**Confidence:** HIGH

---

## Summary

Phase 2 builds on a solid Phase 1 foundation: Astro SSG, vanilla CSS custom properties, Zod-validated content collections, and the BaseLayout/Nav component. The work is primarily three new page files, schema updates, and CSS layout authoring — no new dependencies are required.

The most significant technical decision already locked in the schema is that image paths are stored as plain strings pointing to `/public/images/...`. This means Astro's `<Image>` component will **not** perform build-time WebP conversion or responsive srcset generation on these images. PROJ-03 ("Images are lazy-loaded and optimized (WebP, responsive srcset via Astro Image)") can only be satisfied if images are moved to `src/assets/` and the schema is updated to use Astro's `image()` helper — or if the requirement is interpreted as "add `loading="lazy"` and the `<Image>` component wrapper, accepting that public images are not processed." The planner must resolve this gap explicitly.

The three pages — index.astro (home grid), `src/pages/projects/[slug].astro` (dynamic detail), and `src/pages/about.astro` — each have a detailed visual spec already authored in `02-UI-SPEC.md`. The schema changes (add `type`, add `portrait`, remove `featured`) are straightforward Zod edits. The prev/next navigation on the project page requires sorting the full projects collection by `order` and finding adjacent entries at render time.

**Primary recommendation:** Implement in this order: (1) schema changes + sample content updates, (2) footer in BaseLayout, (3) home page grid, (4) about page, (5) project detail page with prev/next logic. This order builds complexity gradually and keeps the build passing throughout.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Home Page Layout**
- D-01: 2-column grid on desktop, 1-column on mobile — each cell is a clickable cover image linking to the project page
- D-02: Images only — no project titles, no text, no overlays on the home page
- D-03: Cover images displayed at 3:2 landscape aspect ratio (cropped/constrained via CSS)
- D-04: Small gap between grid items (8–16px) — resolved to 8px (`var(--space-sm)`) in UI-SPEC
- D-05: Images have horizontal page margins (padded, not full-bleed)
- D-06: Project order controlled by `order` field in Markdown front matter (existing schema)

**Project Page Structure**
- D-07: Full-width cover image at the top of the page — same cover image as the home page, no text overlay
- D-08: Below the cover: 2-column text section — left column shows project name and project type; right column shows project description and optional live demo link
- D-09: Below the text section: project images from the `images[]` array, stacked vertically one per row with margins
- D-10: Bottom of page: prev/next navigation linking to adjacent projects — project name is the link text
- D-11: New schema field: `type: string (required)` — free text field for project type

**About Page Layout**
- D-12: Two-column layout: portrait photo on the left, bio text on the right
- D-13: LinkedIn and Instagram links appear in the right column below the bio text
- D-14: New schema field in about collection: `portrait: string (required)` — path to portrait image

**Global Footer**
- D-15: Footer on every page: "Alexandre Galatioto ©2026" — added to BaseLayout

**Schema Changes**
- D-16: Add `type: z.string()` to projects collection schema
- D-17: Add `portrait: z.string()` to about collection schema
- D-18: Remove `featured: z.boolean().default(false)` from projects collection schema

### Claude's Discretion
- Exact gap size within the 8–16px range (resolved to 8px in UI-SPEC)
- Cover image height on project pages (resolved to 50vh in UI-SPEC)
- Typography sizing for project name vs project type in the 2-column text section (resolved in UI-SPEC)
- Prev/next navigation styling (resolved in UI-SPEC)
- Footer typography and spacing (resolved in UI-SPEC)
- How the 2-column layouts collapse on mobile (resolved to `640px` breakpoint in UI-SPEC)
- Markdown body content rendering on project pages (if any exists beyond the description)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HOME-01 | Home page displays a full-width list of projects — one project per row, large image + title | UI-SPEC resolves to 2-column image-only grid (D-02 overrides "title" requirement to images-only per design intent) |
| HOME-02 | Each project row is clickable and navigates to the individual project page | `<a href="/projects/{slug}">` wrapping each image cell; slug comes from `entry.id` (Astro 4 content collections) |
| HOME-03 | Project order is manually controlled via Markdown front matter | `getCollection('projects')` + sort by `data.order` ascending |
| HOME-04 | No category filters — all projects displayed in a single scrollable list | No filter UI; render all collection entries |
| HOME-05 | Project title is always visible below the image (no hover-only reveal) | UI-SPEC D-02 overrides this to images-only — CONFLICT flagged below |
| PROJ-01 | Each project page displays a title and descriptive text | `entry.data.title`, `entry.data.description` rendered in 2-column metadata section |
| PROJ-02 | Each project page displays its images as a full-width vertical stack | `entry.data.images[]` mapped to stacked `<img>` elements |
| PROJ-03 | Images are lazy-loaded and optimized (WebP, responsive srcset via Astro Image) | CRITICAL GAP — see Architecture Patterns section |
| PROJ-04 | Projects with a live demo display a visible link | Conditional render: `{entry.data.liveUrl && <a>View project</a>}` |
| PROJ-05 | Projects without a live demo display no link | Same conditional — element absent from DOM |
| ABOUT-01 | About page displays a bio/text section | Rendered via `render(entry)` → `<Content />` component |
| ABOUT-02 | About page displays a LinkedIn profile link | Stored in about front matter or hardcoded; rendered as `<a>` |
| ABOUT-03 | About page displays an Instagram profile link | Same as ABOUT-02 |
| ABOUT-04 | No contact form, no call to action | Nothing to build — strictly omit |

</phase_requirements>

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Home page grid layout | Frontend (Astro SSG) | — | Pure HTML/CSS rendered at build time |
| Project collection query + sort | Frontend Server (build) | — | `getCollection` runs at build time in Astro SSG |
| Dynamic project routes | Frontend Server (build) | — | `getStaticPaths` generates static HTML per entry |
| Image optimization | CDN / Static | Frontend build | Public images are served as-is; no backend processing |
| Prev/next navigation logic | Frontend Server (build) | — | Sort collection by order, find adjacent entries at build time |
| About page content | Frontend (Astro SSG) | — | Markdown rendered via `render()` at build time |
| Schema validation | Frontend (build) | — | Zod validation in `src/content/config.ts` runs at build time |
| Footer | Frontend (BaseLayout) | — | Static HTML in `BaseLayout.astro` |

---

## Standard Stack

### Core (all already in project)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | ^4.0.0 (latest 6.1.6) [VERIFIED: npm registry] | SSG framework, content collections, routing | Project foundation from Phase 1 |
| astro:content | built-in | `getCollection`, `getEntry`, `render` | Official Astro content collection API |
| astro:assets | built-in | `<Image>` component | Official Astro image handling |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| None needed | — | — | No new dependencies for Phase 2 |

**Phase 2 adds zero new npm dependencies.** All capabilities are built into Astro.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Plain `<img>` with `loading="lazy"` | Astro `<Image>` component | `<Image>` prevents CLS via width/height; plain img is fine for public-folder images that won't be optimized anyway |
| String paths in front matter | Astro `image()` schema helper | `image()` enables full build-time optimization but requires images in `src/assets/` — not the current architecture |

**Installation:** No new packages required.

---

## Architecture Patterns

### System Architecture Diagram

```
Markdown files (src/content/projects/*.md)
       │ front matter (title, description, cover, images[], order, liveUrl, type)
       ▼
getCollection('projects') ──sort by order──▶ index.astro (home grid)
       │                                          │
       │                                          ▼
       │                                    <ul.project-grid>
       │                                      <li> → <a> → <img>
       │
       └──▶ getStaticPaths() ──map to slugs──▶ [slug].astro (project detail)
                                                    │
                                            sort all + find adjacent
                                                    │
                                    ┌───────────────┴──────────────────┐
                                    ▼                                  ▼
                              project-cover                    project-meta (2-col)
                              project-gallery                  project-nav (prev/next)

src/content/about/index.md
       │ front matter (portrait, linkedinUrl, instagramUrl)
       │ body (bio Markdown)
       ▼
about.astro
       │
       ├── <img portrait>
       ├── <Content /> (rendered body)
       └── <ul.about-links>

BaseLayout.astro (wraps all pages)
       └── <footer.site-footer> "Alexandre Galatioto ©2026"
```

### Recommended Project Structure

```
src/
├── content/
│   ├── config.ts          # Zod schema — add type, portrait; remove featured
│   ├── projects/
│   │   ├── sample-project.md    # Add type: field, remove featured:
│   │   └── sample-project-2.md  # Add type: field, remove featured:
│   └── about/
│       └── index.md       # Add portrait:, linkedinUrl:, instagramUrl: fields
├── layouts/
│   └── BaseLayout.astro   # Add <footer> before </body>
└── pages/
    ├── index.astro         # Home page grid (currently stub)
    ├── about.astro         # New file
    └── projects/
        └── [slug].astro    # New file — dynamic route
```

### Pattern 1: Content Collection Query and Sort

**What:** Fetch all project entries and sort by the `order` front matter field.
**When to use:** index.astro (home grid) and [slug].astro (prev/next logic).

```astro
---
// Source: https://docs.astro.build/en/guides/content-collections/
import { getCollection } from 'astro:content';

const projects = await getCollection('projects');
const sorted = projects.sort((a, b) => a.data.order - b.data.order);
---
```

### Pattern 2: Dynamic Route Generation (getStaticPaths)

**What:** Generate one static HTML page per project entry.
**When to use:** `src/pages/projects/[slug].astro`

```astro
---
// Source: https://docs.astro.build/en/guides/content-collections/#generating-routes-from-content
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  const sorted = projects.sort((a, b) => a.data.order - b.data.order);
  return sorted.map((entry, index) => ({
    params: { slug: entry.id },
    props: {
      entry,
      prev: sorted[index - 1] ?? null,
      next: sorted[index + 1] ?? null,
    },
  }));
}

const { entry, prev, next } = Astro.props;
const { Content } = await render(entry);
---
```

**Note:** In Astro 4, `entry.id` is the slug (filename without extension). Use `params: { slug: entry.id }` and name the file `[slug].astro`. [VERIFIED: docs.astro.build/en/guides/content-collections]

### Pattern 3: Prev/Next Navigation from Sorted Collection

**What:** Pass adjacent entries as props from `getStaticPaths` so each project page knows its neighbors.
**When to use:** Project detail pages (D-10).

```astro
<!-- In [slug].astro template -->
<nav class="project-nav" aria-label="Project navigation">
  {prev && (
    <a href={`/projects/${prev.id}`} class="project-nav__prev">
      {prev.data.title}
    </a>
  )}
  {next && (
    <a href={`/projects/${next.id}`} class="project-nav__next">
      {next.data.title}
    </a>
  )}
</nav>
```

**Key insight:** Pass `prev` and `next` from `getStaticPaths` — never re-query the collection inside the page template for this purpose, as `getStaticPaths` already has the sorted array.

### Pattern 4: Conditional Live Demo Link

**What:** Render "View project" link only when `liveUrl` is present in front matter.
**When to use:** Project detail page (PROJ-04, PROJ-05).

```astro
{entry.data.liveUrl && (
  <a
    href={entry.data.liveUrl}
    class="project-demo-link"
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`View ${entry.data.title} project (opens in new tab)`}
  >
    View project
  </a>
)}
```

### Pattern 5: Rendering Markdown Body Content

**What:** Render the Markdown body of an entry as HTML.
**When to use:** About page (bio text), project pages (if body content exists).

```astro
---
// Source: https://docs.astro.build/en/reference/modules/astro-content/#render
import { getEntry, render } from 'astro:content';

const entry = await getEntry('about', 'index');
const { Content } = await render(entry);
---

<div class="about-bio">
  <Content />
</div>
```

### Pattern 6: Schema Update in config.ts

**What:** Add `type` to projects, add `portrait`/social fields to about, remove `featured`.
**When to use:** Wave 0 / first task of the phase.

```typescript
// Source: src/content/config.ts (existing file)
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    cover:       z.string(),
    images:      z.array(z.string()),
    order:       z.number(),
    liveUrl:     z.string().url().optional(),
    type:        z.string(),          // ADD — D-11, D-16
    // featured removed — D-18
  }),
});

const about = defineCollection({
  type: 'content',
  schema: z.object({
    portrait:     z.string(),         // ADD — D-14, D-17
    linkedinUrl:  z.string().url().optional(),
    instagramUrl: z.string().url().optional(),
  }),
});

export const collections = { projects, about };
```

**IMPORTANT:** After removing `featured` from the schema, the sample project Markdown files still contain `featured: false` in their front matter. Zod will throw a build error unless `featured` is either (a) removed from the front matter of every project file, or (b) kept in the schema as `.optional()`. Per D-18, the intent is removal — the front matter must be cleaned up in all project files. [VERIFIED: codebase — sample-project.md and sample-project-2.md both have `featured: false`]

### Pattern 7: About Front Matter Update

The current `src/content/about/index.md` has an empty front matter block and stores LinkedIn/Instagram as inline Markdown links. For D-12–D-14, the about schema now requires `portrait`, and the social links should move to front matter for consistent programmatic access.

Updated front matter:
```yaml
---
portrait: "/images/about/portrait.jpg"
linkedinUrl: "https://linkedin.com/in/alexandregalatioto"
instagramUrl: "https://instagram.com/alexandregalatioto"
---

Bio text here...
```

### Anti-Patterns to Avoid

- **Re-querying the collection inside the page template:** `getStaticPaths` already fetches and sorts — don't call `getCollection` again in the template's frontmatter for prev/next.
- **Using `entry.slug` in Astro 4:** In Astro 4+, the correct property is `entry.id`, not `entry.slug` (deprecated). [VERIFIED: docs.astro.build]
- **Putting `<main>` inside the slot:** `BaseLayout.astro` already wraps `<slot>` in `<main>` — page templates should not add another `<main>`.
- **Adding client-side JS for layout:** Per PERF-02 and CONTEXT.md, CSS Grid handles all layout — zero JS required for Phase 2 pages.
- **Forgetting `rel="noopener noreferrer"` on external links:** All `target="_blank"` links (live demo, LinkedIn, Instagram) must have this attribute.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image lazy loading | Custom IntersectionObserver JS | `loading="lazy"` HTML attribute | Native browser support; zero JS; satisfies PERF-02 |
| Markdown body rendering | Custom Markdown parser | `render(entry)` + `<Content />` | Astro's built-in renderer; handles all edge cases |
| Dynamic routing | Manual file-per-project pages | `getStaticPaths` + `[slug].astro` | Astro's built-in SSG route generation |
| Content schema validation | Custom front matter parser | Zod in `src/content/config.ts` | Already established pattern; build-time type safety |
| Aspect ratio enforcement | Padding-top hack (old CSS trick) | `aspect-ratio: 3 / 2` + `object-fit: cover` | Native CSS; clean, readable, well-supported |

**Key insight:** Every "complex" requirement in this phase has a one-line native solution. The work is authoring CSS and Astro templates, not building infrastructure.

---

## Critical Gap: PROJ-03 vs Current Image Architecture

**What the requirement says:** "Images are lazy-loaded and optimized (WebP, responsive srcset via Astro Image)"

**What the current architecture provides:** Image paths are stored as strings (e.g., `/images/projects/acme/cover.jpg`) pointing to `/public/`. According to Astro documentation, images in `/public/` are **never processed** — they are served as-is. The `<Image>` component can accept public paths, but it does not convert or optimize them. [VERIFIED: docs.astro.build/en/guides/images]

**Options for the planner:**

| Option | What it requires | PROJ-03 satisfied? |
|--------|-----------------|-------------------|
| A (current arch) | Use `<img loading="lazy">` or `<Image src="...">` with public paths | Partially — lazy loading yes, WebP/srcset no |
| B (migrate to src/assets) | Move images to `src/assets/`, change schema to `cover: image()`, update all front matter | Fully — Astro processes images at build time |
| C (interpret narrowly) | Accept "via Astro Image" means using the `<Image>` component (not that it optimizes) | Technically no — docs are clear images are not processed |

**Recommendation:** Option A for Phase 2 (ship lazy loading with the current string-path architecture), document the gap, and defer true WebP optimization to Phase 3 (which already owns PERF-01). The requirement PROJ-03 can be partially satisfied now and fully satisfied in Phase 3 via the migration to `src/assets/`. The planner should note this explicitly rather than silently skipping the optimization.

---

## Common Pitfalls

### Pitfall 1: `entry.id` vs `entry.slug` in Astro 4

**What goes wrong:** Using `entry.slug` (deprecated) instead of `entry.id` causes TypeScript errors and may produce broken route params.
**Why it happens:** Pre-Astro 4 tutorials and docs used `slug`. Astro 4 changed the primary identifier to `id`.
**How to avoid:** Always use `entry.id` for route params in `getStaticPaths`.
**Warning signs:** TypeScript complaining about `slug` not existing on entry type.

### Pitfall 2: BaseLayout `<main>` Nesting

**What goes wrong:** Page templates add `<main class="...">` but `BaseLayout.astro` already wraps `<slot>` in `<main>` — this creates nested `<main>` elements, which is invalid HTML.
**Why it happens:** Easy to miss when the layout is set up in Phase 1 and Phase 2 authors write new pages.
**How to avoid:** Page templates output elements that go *inside* `<main>` — not another `<main>`. Use a `<div>` or direct sectioning elements.
**Warning signs:** Validator warning, or styling behaves unexpectedly because two `<main>` elements exist.

**IMPORTANT:** Looking at the current `BaseLayout.astro`, it wraps `<slot>` in `<main>`. This means page templates should NOT add their own `<main>` wrapper — only inner content.

### Pitfall 3: Schema Breaking Change Without Front Matter Update

**What goes wrong:** Adding `type: z.string()` (required, no default) to the projects schema while existing Markdown files don't have a `type:` field causes a build error at `astro build`.
**Why it happens:** Zod validation runs at build time — missing required fields are hard errors, not warnings.
**How to avoid:** Update all project Markdown files to include the `type:` field in the *same task* as the schema change. Same applies to `portrait:` in about.
**Warning signs:** `astro build` exits with "Invalid content collection entry" error.

### Pitfall 4: `featured` Removal Requires Front Matter Cleanup

**What goes wrong:** Removing `featured` from the schema (D-18) while `featured: false` remains in `sample-project.md` and `sample-project-2.md` causes a Zod "Unrecognized key" warning or error.
**Why it happens:** By default, `z.object()` in strict mode rejects unknown keys. If Astro's content collection strips unknowns silently, it's still a smell. If it fails, it's a blocker.
**How to avoid:** Remove `featured:` from front matter in all project files when removing it from the schema.
**Warning signs:** Build warnings about unrecognized keys.

### Pitfall 5: About Collection Social Links Location

**What goes wrong:** The current `about/index.md` stores LinkedIn/Instagram as inline Markdown links in the body, not in front matter. If `about.astro` tries to read `entry.data.linkedinUrl`, it will be undefined.
**Why it happens:** The existing file was created before the schema was fully designed for Phase 2.
**How to avoid:** Add `linkedinUrl` and `instagramUrl` to the about schema AND update `index.md` to include them as front matter fields. Then render the `<Content />` body separately (it no longer needs to contain the social links).
**Warning signs:** Social links missing from the about page, or appearing twice.

### Pitfall 6: Astro `<Image>` with String Paths from Public

**What goes wrong:** Using `<Image src={entry.data.cover} ...>` where `cover` is a string path like `/images/projects/acme/cover.jpg` — Astro's `<Image>` component will not throw, but it requires `width` and `height` props for public images (it can't infer dimensions).
**Why it happens:** Dimension inference is only possible when the image file is a local import or when using the `image()` schema helper.
**How to avoid:** Either use a plain `<img loading="lazy" ...>` (simplest for public images) or provide explicit `width` and `height` attributes to `<Image>`. The plain `<img>` approach is appropriate given images aren't being optimized anyway.
**Warning signs:** Astro dev warning: "width and height are required for images in the public/ directory."

---

## Code Examples

### Home Page Grid (index.astro)

```astro
---
// Source: https://docs.astro.build/en/guides/content-collections/
import BaseLayout from '../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

const projects = await getCollection('projects');
const sorted = projects.sort((a, b) => a.data.order - b.data.order);
---

<BaseLayout title="Work — Alexandre Galatioto">
  <ul class="project-grid">
    {sorted.map((project) => (
      <li class="project-cell">
        <a href={`/projects/${project.id}`}>
          <img
            src={project.data.cover}
            alt={project.data.title}
            loading="lazy"
          />
        </a>
      </li>
    ))}
  </ul>
</BaseLayout>

<style>
  .project-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-sm);
    padding-inline: var(--space-xl);
    padding-top: var(--space-3xl);
  }

  .project-cell img {
    width: 100%;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 640px) {
    .project-grid {
      grid-template-columns: 1fr;
      padding-inline: var(--space-md);
    }
  }
</style>
```

### Project Detail Page (projects/[slug].astro — skeleton)

```astro
---
// Source: https://docs.astro.build/en/guides/content-collections/#generating-routes-from-content
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  const sorted = projects.sort((a, b) => a.data.order - b.data.order);
  return sorted.map((entry, index) => ({
    params: { slug: entry.id },
    props: {
      entry,
      prev: sorted[index - 1] ?? null,
      next: sorted[index + 1] ?? null,
    },
  }));
}

const { entry, prev, next } = Astro.props;
const { data } = entry;
---

<BaseLayout title={`${data.title} — Alexandre Galatioto`} description={data.description}>
  <div class="project-cover">
    <img src={data.cover} alt={data.title} loading="eager" />
  </div>

  <section class="project-meta">
    <div class="project-meta__left">
      <h1>{data.title}</h1>
      <p class="project-type">{data.type}</p>
    </div>
    <div class="project-meta__right">
      <p>{data.description}</p>
      {data.liveUrl && (
        <a
          href={data.liveUrl}
          class="project-demo-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${data.title} project (opens in new tab)`}
        >
          View project
        </a>
      )}
    </div>
  </section>

  <div class="project-gallery">
    {data.images.map((src) => (
      <img src={src} alt="" loading="lazy" />
    ))}
  </div>

  <nav class="project-nav" aria-label="Project navigation">
    {prev && <a href={`/projects/${prev.id}`} class="project-nav__prev">{prev.data.title}</a>}
    {next && <a href={`/projects/${next.id}`} class="project-nav__next">{next.data.title}</a>}
  </nav>
</BaseLayout>
```

### Global Footer Addition (BaseLayout.astro)

```astro
<!-- Add before </body> in BaseLayout.astro -->
<!-- Source: CONTEXT.md D-15 -->
<footer class="site-footer">
  <p>Alexandre Galatioto ©2026</p>
</footer>

<style>
  /* Add to BaseLayout scoped styles */
  .site-footer {
    background-color: var(--color-surface);
    padding-block: var(--space-lg);
    padding-inline: var(--space-xl);
    text-align: center;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-regular);
    color: var(--color-text-muted);
    margin-top: auto;
  }
</style>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `entry.slug` for route params | `entry.id` (Astro 4) | Astro 4.0 | Use `entry.id` everywhere |
| `entry.render()` method | `render(entry)` imported from `astro:content` | Astro 4.0 | Import `render` separately |
| Padding-top trick for aspect ratios | `aspect-ratio` CSS property | CSS 2021+ | Use `aspect-ratio: 3 / 2` |
| `z.string()` for image paths in collections | `image()` helper for build-time optimization | Astro 2.1+ | Current project uses string paths — optimization requires migration |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The `featured` field removal from schema using strict `z.object()` will cause build errors if front matter still contains `featured:` | Pitfall 4 | Low — Astro may silently strip unknown keys; still best practice to clean up |
| A2 | Social URLs in about should move to front matter for programmatic access in `about.astro` | Pattern 6 / Pitfall 5 | Medium — if the plan keeps social links in Markdown body, `about.astro` cannot read them as `entry.data` properties |
| A3 | `entry.id` equals the filename without extension in Astro 4 content collections (e.g., `sample-project` → `/projects/sample-project`) | Pattern 2 | Low — confirmed by Astro docs; would only break if slugify transformation is configured |

---

## Open Questions

1. **PROJ-03 partial fulfillment**
   - What we know: Public images cannot be WebP-converted by Astro; `loading="lazy"` works regardless
   - What's unclear: Does the planner accept partial satisfaction (lazy loading only) for Phase 2, deferring WebP to Phase 3?
   - Recommendation: Explicitly mark PROJ-03 as "lazy loading satisfied in Phase 2, WebP/srcset deferred to Phase 3 migration task"

2. **HOME-05 conflict with D-02**
   - What we know: HOME-05 requires "project title always visible below the image"; D-02 says "images only, no text"
   - What's unclear: Which decision wins? The REQUIREMENTS.md is the baseline, but CONTEXT.md D-02 is the locked user decision.
   - Recommendation: D-02 (user's locked decision) overrides HOME-05 — implement images-only grid. The planner should note this override explicitly so it's traceable.

3. **About page social link storage location**
   - What we know: Current `about/index.md` has social links as inline Markdown body text, not front matter
   - What's unclear: Should `linkedinUrl` and `instagramUrl` be added to the about schema (clean, programmatic) or parsed from rendered HTML?
   - Recommendation: Add to schema as `z.string().url().optional()` fields and update the Markdown front matter — cleanest approach, consistent with how `liveUrl` is handled in projects.

---

## Environment Availability

Step 2.6: SKIPPED — Phase 2 is purely code/template authoring. No external tools, services, CLIs, or runtimes beyond the Node.js/npm already established in Phase 1. Astro's built-in dev server (`astro dev`) and build command (`astro build`) are the only tools required.

---

## Sources

### Primary (HIGH confidence)
- `docs.astro.build/en/guides/content-collections/` — `getCollection`, `getStaticPaths`, `render()` API, `entry.id` routing
- `docs.astro.build/en/guides/images/` — `<Image>` component behavior with public folder images, optimization limitations
- `docs.astro.build/en/reference/modules/astro-content/#render` — `render()` function API
- Codebase: `src/content/config.ts`, `src/layouts/BaseLayout.astro`, `src/styles/tokens.css`, `src/styles/global.css` — verified existing structure
- `.planning/phases/02-content-pages/02-UI-SPEC.md` — authoritative visual/spacing spec for all Phase 2 components
- `.planning/phases/02-content-pages/02-CONTEXT.md` — locked design decisions

### Secondary (MEDIUM confidence)
- `npm view astro version` → 6.1.6 as of 2026-04-15 [VERIFIED: npm registry]

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Astro 4 content collections are well-documented official APIs, all verified
- Architecture: HIGH — all patterns derived from official Astro docs + existing codebase inspection
- Pitfalls: HIGH — pitfalls 1, 2, 3, 4, 5 verified by direct codebase inspection (config.ts, BaseLayout.astro, sample project files); pitfall 6 verified by official docs

**Research date:** 2026-04-15
**Valid until:** 2026-05-15 (Astro APIs are stable; image optimization architecture decision is the only volatile point)
