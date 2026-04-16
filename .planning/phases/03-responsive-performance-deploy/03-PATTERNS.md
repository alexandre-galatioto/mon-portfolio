# Phase 3: Responsive, Performance & Deploy - Pattern Map

**Mapped:** 2026-04-16
**Files analyzed:** 8 files (6 modified, 1 new config file, 1 new directory structure)
**Analogs found:** 7 / 8

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/content/config.ts` | config | transform | `src/content/config.ts` (current) | self — in-place migration |
| `src/layouts/BaseLayout.astro` | layout | request-response | `src/layouts/BaseLayout.astro` (current) | self — additive change |
| `src/pages/index.astro` | page | request-response | `src/pages/projects/[slug].astro` | role-match — both use Image component pattern |
| `src/pages/about.astro` | page | request-response | `src/pages/projects/[slug].astro` | role-match — both render single content entry |
| `src/pages/projects/[slug].astro` | page | request-response | `src/pages/projects/[slug].astro` (current) | self — in-place updates |
| `src/content/projects/*.md` | content | transform | `src/content/projects/sample-project.md` (current) | self — front matter path update only |
| `src/content/about/index.md` | content | transform | `src/content/about/index.md` (current) | self — front matter path update only |
| `netlify.toml` | config | — | none | no analog — new file type |

---

## Pattern Assignments

### `src/content/config.ts` (config, transform)

**Analog:** `src/content/config.ts` (current state — lines 1–25 are the full file)
**Change type:** In-place migration — replace `z.string()` with `image()` schema helper.

**Current state** (`src/content/config.ts` lines 1–25):
```typescript
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    cover:       z.string(),         // <-- migrate to image()
    images:      z.array(z.string()), // <-- migrate to z.array(image())
    order:       z.number(),
    liveUrl:     z.string().url().optional(),
    type:        z.string(),
  }),
});

const about = defineCollection({
  type: 'content',
  schema: z.object({
    portrait:     z.string(),        // <-- migrate to image()
    linkedinUrl:  z.string().url().optional(),
    instagramUrl: z.string().url().optional(),
  }),
});

export const collections = { projects, about };
```

**Target pattern** (copy from RESEARCH.md Pattern 1):
```typescript
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const projects = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({   // schema becomes a function receiving image helper
    title:       z.string(),
    description: z.string(),
    cover:       image(),              // was z.string()
    images:      z.array(image()),    // was z.array(z.string())
    order:       z.number(),
    liveUrl:     z.string().url().optional(),
    type:        z.string(),
  }),
});

const about = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    portrait:     image(),             // was z.string()
    linkedinUrl:  z.string().url().optional(),
    instagramUrl: z.string().url().optional(),
  }),
});

export const collections = { projects, about };
```

**Key structural change:** `schema: z.object({...})` becomes `schema: ({ image }) => z.object({...})` — the schema must become a function that receives the `image` helper as a named parameter.

---

### `src/layouts/BaseLayout.astro` (layout, request-response)

**Analog:** `src/layouts/BaseLayout.astro` (current — lines 1–43 are the full file)
**Change type:** Additive — insert one `<link rel="preload">` tag into `<head>` before any CSS import.

**Current `<head>` block** (`src/layouts/BaseLayout.astro` lines 13–20):
```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content={description} />
  <title>{title}</title>
</head>
```

**Target pattern** — insert preload after `<head>` opening, before `<title>`:
```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content={description} />
  <link
    rel="preload"
    href="/fonts/NeueHaasUnica-Regular.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />
  <title>{title}</title>
</head>
```

**Critical:** `crossorigin` attribute is mandatory even for same-origin fonts with `rel="preload"` — omitting it causes a double download. Font filename confirmed at `/Users/lemondebrule/Downloads/_Claude/public/fonts/NeueHaasUnica-Regular.woff2`.

**Do not add preload for:** Medium, Bold, or Italic weights — those load on demand per D-06.

---

### `src/pages/index.astro` (page, request-response)

**Analog:** `src/pages/projects/[slug].astro` lines 1–76 — both are Astro pages that consume content collection data and render `<Image>` components.
**Change type:** Update image rendering + add max-width container cap.

**Current import block** (`src/pages/index.astro` lines 1–7):
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

const projects = await getCollection('projects');
const sorted = projects.sort((a, b) => a.data.order - b.data.order);
---
```

**Target import block** — add `Image` import:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { Image } from 'astro:assets';
import { getCollection } from 'astro:content';

const projects = await getCollection('projects');
const sorted = projects.sort((a, b) => a.data.order - b.data.order);
---
```

**Current image rendering** (`src/pages/index.astro` lines 11–20):
```astro
{sorted.map((project) => (
  <li class="project-cell">
    <a href={`/projects/${project.slug}`}>
      <img
        src={project.data.cover}
        alt={project.data.title}
        loading="lazy"
      />
    </a>
  </li>
))}
```

**Target image rendering** — swap `<img>` for `<Image>`, add index for eager/lazy, add `widths`/`sizes`/`format`:
```astro
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

**Max-width cap pattern** (add to existing `.project-grid` CSS, `src/pages/index.astro` lines 26–31):
```css
.project-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-sm);
  padding-inline: var(--space-xl);
  padding-top: var(--space-3xl);
  max-width: 1280px;         /* add — ultrawide cap (D-09) */
  margin-inline: auto;       /* add — center on wide screens */
}
```

**Do not apply max-width to `.project-cell img`** — it must go on the grid container so the browser's srcset sizes calculation uses the layout width of the container correctly.

**Existing mobile breakpoint** (`src/pages/index.astro` lines 45–50) — no changes needed:
```css
@media (max-width: 640px) {
  .project-grid {
    grid-template-columns: 1fr;
    padding-inline: var(--space-md);
  }
}
```

---

### `src/pages/about.astro` (page, request-response)

**Analog:** `src/pages/about.astro` (current — lines 1–81 are the full file) plus `src/pages/projects/[slug].astro` for `<Image>` component usage pattern.
**Change type:** Replace `<img>` with `<Image>`, add max-width cap.

**Current import block** (`src/pages/about.astro` lines 1–7):
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getEntry, render } from 'astro:content';

const entry = await getEntry('about', 'index');
const { Content } = await render(entry);
const { data } = entry;
---
```

**Target import block** — add `Image` import:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { Image } from 'astro:assets';
import { getEntry, render } from 'astro:content';

const entry = await getEntry('about', 'index');
const { Content } = await render(entry);
const { data } = entry;
---
```

**Current portrait rendering** (`src/pages/about.astro` line 13):
```astro
<img src={data.portrait} alt="Alexandre Galatioto" />
```

**Target portrait rendering** — use `<Image>` for automatic `width`/`height` injection (prevents CLS):
```astro
<Image
  src={data.portrait}
  alt="Alexandre Galatioto"
  widths={[640, 960, 1280]}
  sizes="(max-width: 640px) 100vw, 50vw"
  format="webp"
  loading="eager"
/>
```

**Max-width cap pattern** (add to existing `.about-layout` CSS, `src/pages/about.astro` lines 35–43):
```css
.about-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl);
  padding-inline: var(--space-xl);
  padding-top: var(--space-3xl);
  padding-bottom: var(--space-2xl);
  max-width: 1280px;         /* add — ultrawide cap (D-09) */
  margin-inline: auto;       /* add — center on wide screens */
}
```

**Portrait CSS fix** (`src/pages/about.astro` lines 45–49) — ensure no height constraint that would crop the image (D-08):
```css
.about-portrait img {
  width: 100%;
  display: block;
  /* object-fit: cover; — REMOVE if present; portrait should fill naturally */
}
```

**Existing mobile breakpoint** (`src/pages/about.astro` lines 75–80) — no changes needed:
```css
@media (max-width: 640px) {
  .about-layout {
    grid-template-columns: 1fr;
    padding-inline: var(--space-md);
  }
}
```

---

### `src/pages/projects/[slug].astro` (page, request-response)

**Analog:** `src/pages/projects/[slug].astro` (current — self-update)
**Change type:** Three targeted updates: (1) switch cover from `<img>` to `<Image>`, (2) update gallery `<Image>` to pass object instead of string (after schema migration), (3) add max-width caps, (4) remove fixed height from cover.

**Current import block** (`src/pages/projects/[slug].astro` lines 1–4) — `Image` already imported, no change:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { Image } from 'astro:assets';
import { getCollection } from 'astro:content';
```

**Current cover rendering** (`src/pages/projects/[slug].astro` line 25):
```astro
<img src={data.cover} alt={data.title} loading="eager" />
```

**Target cover rendering** — use `<Image>` with no fixed height (D-08: preserve aspect ratio on project pages):
```astro
<Image
  src={data.cover}
  alt={data.title}
  widths={[640, 960, 1280, 1600]}
  sizes="(max-width: 640px) calc(100vw - 32px), min(calc(100vw - 64px), 1280px)"
  format="webp"
  loading="eager"
/>
```

**Current gallery rendering** (`src/pages/projects/[slug].astro` lines 50–60) — `<Image>` already used but receives string `src` from old schema:
```astro
{data.images.map((src) => (
  <Image
    src={src}
    alt=""
    width={1600}
    height={1200}
    format="webp"
    widths={[640, 960, 1280, 1600]}
    sizes="(max-width: 640px) calc(100vw - 32px), calc(100vw - 64px)"
    loading="lazy"
  />
))}
```

**Target gallery rendering** — after schema migration, `src` is now an `ImageMetadata` object; remove explicit `width`/`height` (Astro infers from the object); update `sizes` with max cap:
```astro
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
```

**Cover CSS fix** — remove fixed `height: 50vh` that forces cropping (`src/pages/projects/[slug].astro` lines 84–89). D-08 says no cropping on project pages:
```css
/* Current (lines 79–89): */
.project-cover {
  margin-inline: var(--space-xl);
  margin-top: var(--space-3xl);
}
.project-cover img {
  width: 100%;
  height: 50vh;        /* REMOVE — forces crop */
  object-fit: cover;   /* REMOVE — only needed with fixed height */
  display: block;
}

/* Target: */
.project-cover {
  margin-inline: var(--space-xl);
  margin-top: var(--space-3xl);
  max-width: 1280px;   /* add — ultrawide cap */
  margin-inline: auto; /* add — center; overrides the space-xl value at very wide screens */
}
.project-cover img {
  width: 100%;
  display: block;
  /* height: auto is the browser default — no declaration needed */
}
```

**Gallery max-width cap** (add to `.project-gallery` CSS, `src/pages/projects/[slug].astro` lines 131–137):
```css
.project-gallery {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  margin-inline: var(--space-xl);
  margin-top: var(--space-lg);
  max-width: 1280px;   /* add — ultrawide cap */
  margin-inline: auto; /* add — center at wide screens */
}
```

**Gallery image CSS** (`src/pages/projects/[slug].astro` lines 139–142) — verify no `height` rule exists here (already clean):
```css
.project-gallery img {
  width: 100%;
  display: block;
  /* no height rule — correct, preserves natural proportions (D-08) */
}
```

**Existing mobile breakpoints** (`src/pages/projects/[slug].astro` lines 166–183) — no changes needed:
```css
@media (max-width: 640px) {
  .project-cover { margin-inline: var(--space-md); }
  .project-meta { grid-template-columns: 1fr; padding-inline: var(--space-md); }
  .project-gallery { margin-inline: var(--space-md); }
  .project-nav { padding-inline: var(--space-md); }
}
```

---

### `src/content/projects/*.md` (content, transform)

**Analog:** `src/content/projects/sample-project.md` (current — lines 1–14)
**Change type:** Front matter path values only — no structural change.

**Current front matter pattern** (`src/content/projects/sample-project.md` lines 1–12):
```yaml
---
title: "Brand Identity for Acme Corp"
description: "..."
cover: "/images/projects/acme/cover.jpg"      # absolute public/ path — no optimization
images:
  - "/images/projects/acme/01.jpg"
  - "/images/projects/acme/02.jpg"
  - "/images/projects/acme/03.jpg"
order: 1
liveUrl: "https://example.com/acme"
type: "Brand Identity"
---
```

**Target front matter pattern** — relative path from `.md` file to `src/assets/`:
```yaml
---
title: "Brand Identity for Acme Corp"
description: "..."
cover: "../../assets/images/projects/acme/cover.jpg"
images:
  - "../../assets/images/projects/acme/01.jpg"
  - "../../assets/images/projects/acme/02.jpg"
  - "../../assets/images/projects/acme/03.jpg"
order: 1
liveUrl: "https://example.com/acme"
type: "Brand Identity"
---
```

**Path resolution note:** Markdown files live at `src/content/projects/sample-project.md`. Relative path to `src/assets/` is `../../assets/`. This must be a relative path — absolute paths starting with `/` will fail with the `image()` schema helper.

**Apply same pattern to:** `src/content/projects/sample-project-2.md` (flux project, `../../assets/images/projects/flux/...`).

---

### `src/content/about/index.md` (content, transform)

**Analog:** `src/content/about/index.md` (current — lines 1–7)
**Change type:** Front matter path value only.

**Current front matter** (`src/content/about/index.md` lines 1–5):
```yaml
---
portrait: "/images/about/portrait.jpg"         # absolute public/ path — no optimization
linkedinUrl: "https://linkedin.com/in/alexandregalatioto"
instagramUrl: "https://instagram.com/alexandregalatioto"
---
```

**Target front matter** — relative path from `src/content/about/index.md` to `src/assets/`:
```yaml
---
portrait: "../../assets/images/about/portrait.jpg"
linkedinUrl: "https://linkedin.com/in/alexandregalatioto"
instagramUrl: "https://instagram.com/alexandregalatioto"
---
```

**Path resolution note:** File lives at `src/content/about/index.md`. Relative path to `src/assets/` is `../../assets/`.

---

### `netlify.toml` (config, —)

**Analog:** None — no Netlify config file exists in the project. Pattern comes from RESEARCH.md Pattern 6 and official Astro/Netlify documentation.

**Target file content** — place at project root alongside `astro.config.mjs`:
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

**No `[context]` or environment blocks needed** — static site, single environment.
**No adapter required** — `astro.config.mjs` already has `output: 'static'`; do not add `@astrojs/netlify`.

---

## Shared Patterns

### Image Component Usage
**Source:** `src/pages/projects/[slug].astro` lines 3, 50–60
**Apply to:** `src/pages/index.astro`, `src/pages/about.astro`, `src/pages/projects/[slug].astro`

Import statement (already present in `[slug].astro`, add to the other two):
```astro
import { Image } from 'astro:assets';
```

All image fields from content collections become `ImageMetadata` objects after schema migration — pass them directly as `src={data.cover}` or `src={img}`, not as `src={data.cover.src}`.

### Max-Width Container Cap
**Source:** No existing analog — new pattern for this phase (D-09)
**Apply to:** `.project-grid` in `index.astro`, `.about-layout` in `about.astro`, `.project-cover` and `.project-gallery` in `[slug].astro`
**Pattern:**
```css
.container-element {
  max-width: 1280px;
  margin-inline: auto;
}
```
Apply to the **outer container**, not to `img` elements. Mobile `padding-inline` from existing media queries continues to work unaffected — at mobile widths the viewport is narrower than 1280px so max-width has no effect.

### Scoped CSS in Astro Files
**Source:** All three page files — `src/pages/index.astro` lines 25–51, `src/pages/about.astro` lines 35–81, `src/pages/projects/[slug].astro` lines 78–184
**Apply to:** All CSS changes in this phase

Project pattern: CSS lives in a `<style>` block at the bottom of the `.astro` file, after all markup. No external CSS file for page-specific styles. CSS custom properties from `tokens.css` are available via the global chain.

### Front Matter Image Path Convention
**Source:** `src/content/projects/sample-project.md`, `src/content/about/index.md`
**Apply to:** All `.md` files with image fields

Paths must be **relative** from the `.md` file's location. The depth from `src/content/[collection]/file.md` to `src/assets/` is always `../../assets/`. Never use absolute paths (starting with `/`) for `image()` schema fields.

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `netlify.toml` | config | — | No deployment config exists in the project yet |
| `src/assets/` (directory) | — | — | No `src/assets/` directory exists yet; must be created |

---

## Migration Sequencing Note

The three workstreams have a dependency order that the planner must respect:

1. **Schema + front matter first** (`config.ts` + all `.md` files updated together in one step) — these must be in sync or the build fails with validation errors
2. **Page component updates second** (`index.astro`, `about.astro`, `[slug].astro`) — depend on schema producing `ImageMetadata` objects
3. **Netlify config independent** — can be created at any point; does not affect local dev

Font preload (`BaseLayout.astro`) is also independent and can be done in any step.

Real image files (`src/assets/images/...`) must be added by the user — schema and code changes can be implemented without them, but Astro will throw a content render error if a page tries to render a missing image file. The planner should note that verification steps require actual image files to be present.

---

## Metadata

**Analog search scope:** `/Users/lemondebrule/Downloads/_Claude/src/` — all pages, layouts, components, content, styles
**Files scanned:** 12 source files read in full
**Pattern extraction date:** 2026-04-16
