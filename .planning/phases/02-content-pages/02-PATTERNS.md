# Phase 2: Content Pages - Pattern Map

**Mapped:** 2026-04-15
**Files analyzed:** 8 new/modified files
**Analogs found:** 7 / 8

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/pages/index.astro` | page (collection consumer) | request-response (SSG) | `src/pages/index.astro` (current stub) + `src/layouts/BaseLayout.astro` | role-match (stub expanded) |
| `src/pages/projects/[slug].astro` | page (dynamic route) | request-response (SSG) | `src/pages/index.astro` + `src/layouts/BaseLayout.astro` | partial-match (no existing dynamic route) |
| `src/pages/about.astro` | page (collection consumer) | request-response (SSG) | `src/pages/index.astro` stub + `src/layouts/BaseLayout.astro` | role-match |
| `src/layouts/BaseLayout.astro` | layout | request-response | `src/layouts/BaseLayout.astro` (self — modification) | exact (additive change only) |
| `src/content/config.ts` | config/schema | transform | `src/content/config.ts` (self — modification) | exact (additive change only) |
| `src/content/projects/sample-project.md` | content (data) | — | `src/content/projects/sample-project-2.md` | exact |
| `src/content/projects/sample-project-2.md` | content (data) | — | `src/content/projects/sample-project.md` | exact |
| `src/content/about/index.md` | content (data) | — | `src/content/projects/sample-project.md` (front matter pattern) | role-match |

---

## Pattern Assignments

### `src/pages/index.astro` (page, SSG collection consumer)

**Analog:** `src/pages/index.astro` (current stub) + `src/layouts/BaseLayout.astro` (lines 1–27)

**Imports pattern** — copy the stub's import line and extend it (current stub lines 1–3):
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';
---
```

**Core pattern — collection query + grid render:**
```astro
---
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
```
- Use `project.id` (not `project.slug`) — Astro 4 convention confirmed in codebase via RESEARCH.md
- No titles, no overlays — D-02 overrides HOME-05 (images only)

**CSS layout pattern** (scoped `<style>` block, same file):
```css
<style>
  .project-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-sm);
    padding-inline: var(--space-xl);
    padding-top: var(--space-3xl);
    list-style: none;
    margin: 0;
    padding-block-start: var(--space-3xl);
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
- Tokens to use: `--space-sm` (8px gap), `--space-xl` (32px inline padding desktop), `--space-md` (16px inline padding mobile), `--space-3xl` (64px top padding) — all verified in `src/styles/tokens.css` lines 28–36
- `aspect-ratio: 3 / 2` + `object-fit: cover` — native CSS, no padding-top trick
- `list-style: none` and `margin: 0` already handled globally in `src/styles/global.css` line 63–65 (`ul { list-style: none; }`)

**No error handling needed** — Astro build-time; missing required fields are Zod build errors, not runtime errors.

---

### `src/pages/projects/[slug].astro` (page, dynamic SSG route)

**Analog:** `src/layouts/BaseLayout.astro` (lines 1–27) for layout wrapping pattern; `src/pages/index.astro` stub for frontmatter structure; no existing dynamic route in codebase.

**Imports + getStaticPaths pattern** (lines 1–end of frontmatter fence):
```astro
---
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
```
- `entry.id` used for `params.slug` — confirmed Astro 4 convention
- `render` imported from `astro:content` (not `entry.render()`) — Astro 4 API
- `prev`/`next` passed through props from `getStaticPaths` — never re-query in template

**Core template pattern:**
```astro
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
- Cover image uses `loading="eager"` (above the fold); gallery uses `loading="lazy"`
- Conditional link pattern: `{data.liveUrl && (<a ...>)}` — same conditional idiom as used throughout Astro
- Gallery `alt=""` on non-cover images — decorative, per UI-SPEC copywriting contract
- `rel="noopener noreferrer"` on all `target="_blank"` links — enforced in Nav.astro scroll script pattern

**CSS layout pattern** (scoped `<style>` block):
```css
<style>
  /* Cover — full content width, 50vh tall */
  .project-cover {
    margin-inline: var(--space-xl);
    margin-top: var(--space-3xl);
  }
  .project-cover img {
    width: 100%;
    height: 50vh;
    object-fit: cover;
    display: block;
  }

  /* Metadata — 2-column grid */
  .project-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-xl);
    padding-inline: var(--space-xl);
    padding-block: var(--space-2xl);
  }
  .project-meta h1 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-heading);
  }
  .project-type {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-regular);
    color: var(--color-text-muted);
    margin-top: var(--space-xs);
  }
  .project-demo-link {
    display: inline-block;
    margin-top: var(--space-md);
    font-size: var(--font-size-sm);
    text-decoration: none;
  }
  .project-demo-link:hover {
    text-decoration: underline;
  }

  /* Gallery — stacked images */
  .project-gallery {
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
    margin-inline: var(--space-xl);
    margin-top: var(--space-lg);
  }
  .project-gallery img {
    width: 100%;
    display: block;
  }

  /* Prev/next navigation */
  .project-nav {
    display: flex;
    justify-content: space-between;
    padding-block: var(--space-2xl);
    padding-inline: var(--space-xl);
  }
  .project-nav a {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-regular);
    color: var(--color-text);
    text-decoration: none;
  }
  .project-nav a:hover {
    text-decoration: underline;
  }
  .project-nav__next {
    margin-left: auto;
  }

  /* Mobile collapse at 640px */
  @media (max-width: 640px) {
    .project-cover,
    .project-gallery,
    .project-nav {
      margin-inline: var(--space-md);
      padding-inline: 0;
    }
    .project-meta {
      grid-template-columns: 1fr;
      padding-inline: var(--space-md);
    }
  }
</style>
```
- `--font-weight-bold` (700) is a new token — must be added to `tokens.css` in the same task wave
- All spacing tokens verified against `src/styles/tokens.css` lines 28–36

---

### `src/pages/about.astro` (page, SSG collection consumer)

**Analog:** `src/pages/index.astro` stub for import/layout wrapping pattern; `src/layouts/BaseLayout.astro` lines 1–27 for `<BaseLayout>` usage.

**Imports + data fetch pattern:**
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getEntry, render } from 'astro:content';

const entry = await getEntry('about', 'index');
const { Content } = await render(entry);
const { data } = entry;
---
```
- `getEntry` (not `getCollection`) — single known entry
- `render(entry)` imported from `astro:content` — same Astro 4 pattern as project pages

**Core template pattern:**
```astro
<BaseLayout title="About — Alexandre Galatioto">
  <div class="about-layout">
    <div class="about-portrait">
      <img src={data.portrait} alt="Alexandre Galatioto" />
    </div>
    <div class="about-content">
      <div class="about-bio">
        <Content />
      </div>
      <ul class="about-links">
        {data.linkedinUrl && (
          <li>
            <a href={data.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </li>
        )}
        {data.instagramUrl && (
          <li>
            <a href={data.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a>
          </li>
        )}
      </ul>
    </div>
  </div>
</BaseLayout>
```
- `<Content />` renders the Markdown body — same pattern as RESEARCH.md Pattern 5
- Social links read from `entry.data` (front matter) — not from rendered body (Pitfall 5)
- No `<main>` wrapper — `BaseLayout.astro` already wraps slot in `<main>` (line 23)
- Conditional social links for robustness (schema has them as `.optional()`)

**CSS layout pattern** (scoped `<style>` block):
```css
<style>
  .about-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-xl);
    padding-inline: var(--space-xl);
    padding-top: var(--space-3xl);
    padding-bottom: var(--space-2xl);
  }
  .about-portrait img {
    width: 100%;
    display: block;
    object-fit: cover;
  }
  .about-bio {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-body);
  }
  .about-links {
    margin-top: var(--space-lg);
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }
  .about-links a {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-regular);
    color: var(--color-text);
    text-decoration: none;
  }
  .about-links a:hover {
    text-decoration: underline;
  }

  @media (max-width: 640px) {
    .about-layout {
      grid-template-columns: 1fr;
      padding-inline: var(--space-md);
    }
  }
</style>
```

---

### `src/layouts/BaseLayout.astro` (layout — additive modification)

**Analog:** Self — `src/layouts/BaseLayout.astro` (lines 1–27, the complete current file)

**Existing pattern to preserve** (lines 1–27 — do not change):
```astro
---
import Nav from '../components/Nav.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Art director portfolio' } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
  </head>
  <body>
    <Nav />
    <main>
      <slot />
    </main>
  </body>
</html>
```

**Addition — insert footer before `</body>`:**
```astro
    <footer class="site-footer">
      <p>Alexandre Galatioto ©2026</p>
    </footer>
  </body>
```

**Addition — append to existing or new `<style>` block:**
```css
<style>
  .site-footer {
    background-color: var(--color-surface);
    padding-block: var(--space-lg);
    padding-inline: var(--space-xl);
    text-align: center;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-regular);
    color: var(--color-text-muted);
  }
</style>
```
- `--color-surface` (#F5F5F5) for background — verified in `src/styles/tokens.css` line 21
- `--color-text-muted` (#999999) for text — verified in `src/styles/tokens.css` line 24
- No `margin-top: auto` needed unless `body` becomes a flex column — keep simple

---

### `src/content/config.ts` (config/schema — modification)

**Analog:** Self — `src/content/config.ts` (lines 1–21, complete current file)

**Current pattern to replace** (full file, lines 1–21):
```typescript
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
    featured:    z.boolean().default(false),  // REMOVE — D-18
  }),
});

const about = defineCollection({
  type: 'content',
  schema: z.object({}),  // REPLACE — D-17
});

export const collections = { projects, about };
```

**Target pattern** (full replacement):
```typescript
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
    type:        z.string(),                  // ADD — D-11, D-16
    // featured removed — D-18
  }),
});

const about = defineCollection({
  type: 'content',
  schema: z.object({
    portrait:     z.string(),                 // ADD — D-14, D-17
    linkedinUrl:  z.string().url().optional(),
    instagramUrl: z.string().url().optional(),
  }),
});

export const collections = { projects, about };
```
- `type` is required (no `.optional()`, no `.default()`) — matches D-11/D-16 intent
- `portrait` is required (no `.optional()`) — matches D-14/D-17 intent
- `featured` field removed entirely — front matter files must also be cleaned up in same task (Pitfall 4)

---

### `src/content/projects/sample-project.md` (content — modification)

**Analog:** `src/content/projects/sample-project-2.md` (lines 1–10) — exact peer file

**Current front matter** (lines 1–12):
```yaml
---
title: "Brand Identity for Acme Corp"
description: "A comprehensive brand identity project..."
cover: "/images/projects/acme/cover.jpg"
images:
  - "/images/projects/acme/01.jpg"
  - "/images/projects/acme/02.jpg"
  - "/images/projects/acme/03.jpg"
order: 1
liveUrl: "https://example.com/acme"
featured: false
---
```

**Target front matter** (add `type`, remove `featured`):
```yaml
---
title: "Brand Identity for Acme Corp"
description: "A comprehensive brand identity project covering logo design, typography system, and brand guidelines for a tech startup."
cover: "/images/projects/acme/cover.jpg"
images:
  - "/images/projects/acme/01.jpg"
  - "/images/projects/acme/02.jpg"
  - "/images/projects/acme/03.jpg"
order: 1
liveUrl: "https://example.com/acme"
type: "Brand Identity"
---
```
- `featured: false` line removed — D-18
- `type` field added with a representative value

---

### `src/content/projects/sample-project-2.md` (content — modification)

**Analog:** `src/content/projects/sample-project.md` — exact peer file

**Current front matter** (lines 1–10):
```yaml
---
title: "Editorial Design for Flux Magazine"
description: "Art direction and layout design for a quarterly print magazine..."
cover: "/images/projects/flux/cover.jpg"
images:
  - "/images/projects/flux/01.jpg"
  - "/images/projects/flux/02.jpg"
order: 2
featured: false
---
```

**Target front matter** (add `type`, remove `featured`):
```yaml
---
title: "Editorial Design for Flux Magazine"
description: "Art direction and layout design for a quarterly print magazine exploring contemporary culture."
cover: "/images/projects/flux/cover.jpg"
images:
  - "/images/projects/flux/01.jpg"
  - "/images/projects/flux/02.jpg"
order: 2
type: "Editorial Design"
---
```
- `featured: false` removed — D-18
- `type` field added
- No `liveUrl` — this project has no live demo (correct — PROJ-05 conditional)

---

### `src/content/about/index.md` (content — modification)

**Analog:** `src/content/projects/sample-project.md` for front matter structure pattern

**Current state** (lines 1–7 — empty front matter, social links in body):
```markdown
---
---

Alexandre Galatioto is an art director...

[LinkedIn](https://linkedin.com/in/username) · [Instagram](https://instagram.com/username)
```

**Target state** (social links moved to front matter, portrait added, body cleaned):
```markdown
---
portrait: "/images/about/portrait.jpg"
linkedinUrl: "https://linkedin.com/in/alexandregalatioto"
instagramUrl: "https://instagram.com/alexandregalatioto"
---

Alexandre Galatioto is an art director with 10+ years of experience across brand, editorial, and digital projects.
```
- Social links removed from body — `about.astro` reads them from `entry.data` (Pitfall 5)
- `portrait` path uses the same `/images/...` convention as project cover/image paths
- Body retains the bio text only — `<Content />` will render it

---

## Shared Patterns

### Layout Wrapping
**Source:** `src/layouts/BaseLayout.astro` lines 4–27
**Apply to:** All three page files (`index.astro`, `[slug].astro`, `about.astro`)

Every page imports and wraps content in `<BaseLayout title="...">`. The layout already provides `<main>` (line 23) — page templates must NOT add another `<main>`. Slots go directly inside `<BaseLayout>` as direct children, which become contents of `<main>`.

```astro
<BaseLayout title="Page Title — Alexandre Galatioto">
  <!-- direct content here — no <main> wrapper -->
</BaseLayout>
```

### CSS Custom Property Usage
**Source:** `src/styles/tokens.css` lines 7–38; `src/components/Nav.astro` lines 31–178
**Apply to:** All scoped `<style>` blocks in new page files and BaseLayout modification

Always reference design tokens by CSS custom property name, never raw values:
- Spacing: `var(--space-xs)` through `var(--space-3xl)`
- Typography: `var(--font-size-sm)`, `var(--font-size-base)`, `var(--font-size-lg)`, `var(--font-weight-regular)`, `var(--font-weight-bold)` (new in Phase 2)
- Color: `var(--color-bg)`, `var(--color-surface)`, `var(--color-text)`, `var(--color-text-muted)`, `var(--color-accent)`

Pattern from `Nav.astro` line 35: `padding: 0 var(--space-lg);` — inline tokens, never magic numbers.

### External Link Safety
**Source:** `src/content/projects/sample-project.md` + RESEARCH.md Pattern 4
**Apply to:** Live demo link (`[slug].astro`), LinkedIn and Instagram links (`about.astro`)

All `target="_blank"` links must include `rel="noopener noreferrer"` and an `aria-label` when the link text alone is insufficient:
```astro
<a
  href={url}
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Descriptive label (opens in new tab)"
>
  Link text
</a>
```

### Mobile Breakpoint
**Source:** `src/components/Nav.astro` line 169 (`@media (max-width: 768px)`)
**Apply to:** All layout CSS in Phase 2 pages

Phase 2 uses `640px` as the two-column collapse breakpoint (resolved by UI-SPEC). Nav uses `768px` for its own breakpoint — these coexist independently. All Phase 2 page layouts collapse at:
```css
@media (max-width: 640px) {
  /* grid-template-columns: 1fr */
  /* padding-inline: var(--space-md) */
}
```

### Collection Data Access
**Source:** `src/content/config.ts` lines 1–21 (schema defines the shape)
**Apply to:** All files reading from `getCollection('projects')` or `getEntry('about', 'index')`

Access front matter via `entry.data.*` (typed by Zod schema). After Phase 2 schema changes:
- Projects: `entry.data.title`, `entry.data.description`, `entry.data.cover`, `entry.data.images`, `entry.data.order`, `entry.data.liveUrl` (optional), `entry.data.type`
- About: `entry.data.portrait`, `entry.data.linkedinUrl` (optional), `entry.data.instagramUrl` (optional)

---

## Token Addition Required

Before any page CSS can use `var(--font-weight-bold)`, these two changes must be made:

**`src/styles/tokens.css`** — add after line 15 (`--font-weight-medium`):
```css
--font-weight-bold:      700;
```

**`src/styles/global.css`** — add after line 27 (after existing `@font-face` blocks):
```css
@font-face {
  font-family: 'Neue Haas Unica';
  src: url('/fonts/NeueHaasUnica-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

These are blockers for `[slug].astro` heading styles — must land in the same task wave as schema changes.

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `src/pages/projects/[slug].astro` | page (dynamic route) | request-response (SSG) | No existing dynamic route (`getStaticPaths`) in the codebase. Pattern sourced entirely from RESEARCH.md Pattern 2 + Astro official docs. The `index.astro` stub and `BaseLayout.astro` provide the layout wrapping pattern, but the `getStaticPaths` + prev/next logic has no codebase analog. |

---

## Metadata

**Analog search scope:** `src/pages/`, `src/layouts/`, `src/components/`, `src/content/`, `src/styles/`
**Files scanned:** 10 source files (all files in `src/`)
**Pattern extraction date:** 2026-04-15
