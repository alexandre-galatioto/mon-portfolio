---
phase: 02-content-pages
verified: 2026-04-15T14:00:00Z
status: gaps_found
score: 3/5
overrides_applied: 1
re_verification: false
overrides:
  - must_have: "Home page displays visible project title below each image"
    reason: "Locked user decision D-02 — images-only grid is the deliberate aesthetic; title-free home page preferred over HOME-05 spec"
    accepted_by: "Alexandre Galatioto"
    accepted_at: "2026-04-15T15:00:00Z"
gaps:
  - truth: "Home page displays a full-width list of projects with visible title below each image"
    status: failed
    reason: "index.astro renders images only — no project title text is displayed. Project titles appear only in alt attributes. This was a deliberate user decision (D-02) but conflicts with ROADMAP SC-1 and HOME-05."
    artifacts:
      - path: "src/pages/index.astro"
        issue: "No title <p>, <span>, or heading element rendered per project. Only alt={project.data.title} exists."
    missing:
      - "Visible project title element below each cover image on the home page"
      - "An override entry in VERIFICATION.md frontmatter if this deviation is intentionally accepted"
  - truth: "Images on project pages are served as WebP with responsive srcset and load lazily"
    status: failed
    reason: "Gallery images in [slug].astro use plain <img src={src} loading='lazy'> with no WebP conversion, no srcset, and no Astro Image component. Lazy loading is present but the WebP/srcset portion of PROJ-03 and ROADMAP SC-3 is not met."
    artifacts:
      - path: "src/pages/projects/[slug].astro"
        issue: "data.images.map renders bare <img> tags — no srcset, no WebP format conversion, no Astro <Image> component used"
    missing:
      - "WebP image serving for gallery images (via Astro Image component or explicit format conversion)"
      - "Responsive srcset on gallery images"
      - "PROJ-03 in Phase 3 roadmap requirements list if this is truly deferred there"
deferred: []
---

# Phase 2: Content Pages — Verification Report

**Phase Goal:** All three content pages (home, project, about) are fully built with correct layout, imagery, and linking
**Verified:** 2026-04-15T14:00:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (from ROADMAP Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Home page displays full-width list of projects, one per row with large image and visible title below, in manually controlled order | FAILED | `index.astro` renders cover images in a 2-column grid sorted by `data.order`. No title element exists per project row — title appears only as `alt` text. Conflicts with ROADMAP SC-1 and HOME-05. |
| 2 | Clicking a project row navigates to that project's page, which shows title, description, and full-width vertical stack of images | VERIFIED | `index.astro` wraps each image in `<a href={'/projects/${project.slug}'}>`. `[slug].astro` renders `data.title` in `<h1>`, `data.description` in `.project-meta__right`, and gallery images in `.project-gallery` flex column. |
| 3 | Images on project pages are served as WebP with responsive srcset and load lazily | FAILED | `[slug].astro` line 50: `<img src={src} alt="" loading="lazy" />` — lazy loading present, but no `srcset`, no WebP format, no Astro `<Image>` component. |
| 4 | Projects with a live demo URL display a visible link; projects without one display nothing | VERIFIED | `[slug].astro` line 34: `{data.liveUrl && (<a href={data.liveUrl} ...>View project</a>)}` — conditional rendering confirmed. `sample-project.md` has `liveUrl`; `sample-project-2.md` has no `liveUrl`. |
| 5 | About page displays bio text plus LinkedIn and Instagram links, with no contact form or call to action | VERIFIED | `about.astro` renders `<Content />` for bio, conditional `data.linkedinUrl` and `data.instagramUrl` links. No form, button, or CTA element found. |

**Score:** 3/5 truths verified

---

## Deferred Items

None identified — the WebP/srcset gap is NOT cleanly deferred because PROJ-03 does not appear in Phase 3's roadmap requirements list (only DSGN-02, DSGN-03, PERF-01, PERF-04 are listed for Phase 3).

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/content/config.ts` | Updated Zod schemas for projects and about collections | VERIFIED | `type: z.string()` in projects schema (line 12); `portrait`, `linkedinUrl`, `instagramUrl` in about schema (lines 19-21); no `featured` field |
| `src/styles/tokens.css` | Bold weight token `--font-weight-bold` | VERIFIED | Line 15: `--font-weight-bold: 700;` |
| `src/styles/global.css` | Bold @font-face declaration for NeueHaasUnica-Bold.woff2 | VERIFIED | Lines 29-35: `@font-face` block with `NeueHaasUnica-Bold.woff2` and `font-weight: 700` |
| `src/layouts/BaseLayout.astro` | Global footer with `site-footer` class | VERIFIED | Lines 26-28: `<footer class="site-footer"><p>Alexandre Galatioto &copy;2026</p></footer>` |
| `src/pages/index.astro` | Home page with project image grid | VERIFIED (partial) | `project-grid` class present, 2-column grid, images with 3:2 ratio, sorted by order. MISSING: visible title text per project |
| `src/pages/about.astro` | About page with portrait and bio | VERIFIED | `about-layout`, `about-portrait`, `about-content`, `about-links` classes present; `<Content />` renders bio; conditional social links |
| `src/pages/projects/[slug].astro` | Dynamic project detail page | VERIFIED (partial) | 174 lines (exceeds 80 min). `getStaticPaths` present. All sections (cover, meta, gallery, nav) present. MISSING: WebP/srcset on gallery images |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/content/config.ts` | `src/content/projects/*.md` | Zod validation at build time | VERIFIED | `type: z.string()` validates both sample projects which have `type` field and no `featured` |
| `src/styles/global.css` | `src/styles/tokens.css` | `@import './tokens.css'` | VERIFIED | Line 2: `@import './tokens.css'` present |
| `src/pages/index.astro` | `src/content/projects/*.md` | `getCollection('projects')` | VERIFIED | Line 5: `await getCollection('projects')` |
| `src/pages/index.astro` | `/projects/{slug}` | anchor href | VERIFIED | Line 13: `href={'/projects/${project.slug}'}` — uses `project.slug` (corrected from `project.id` per bug fix in Plan 03) |
| `src/pages/about.astro` | `src/content/about/index.md` | `getEntry('about', 'index')` | VERIFIED | Line 5: `await getEntry('about', 'index')` |
| `src/pages/projects/[slug].astro` | `src/content/projects/*.md` | `getStaticPaths + getCollection` | VERIFIED | Line 6: `await getCollection('projects')` inside `getStaticPaths` |
| `src/pages/projects/[slug].astro` | `/projects/{prev.slug}` | prev/next props from getStaticPaths | VERIFIED | Line 56: `href={'/projects/${prev.slug}'}` — uses `prev.slug` (corrected from `prev.id`) |
| `src/pages/projects/[slug].astro` | `src/layouts/BaseLayout.astro` | import and wrapping | VERIFIED | Line 2: `import BaseLayout from '../../layouts/BaseLayout.astro'` |

---

## Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `src/pages/index.astro` | `projects` / `sorted` | `getCollection('projects')` | Yes — queries content collection with 2 real entries | FLOWING |
| `src/pages/about.astro` | `entry` / `data` | `getEntry('about', 'index')` | Yes — queries single known content entry | FLOWING |
| `src/pages/projects/[slug].astro` | `entry` / `data` / `prev` / `next` | `getStaticPaths` + `getCollection('projects')` | Yes — sorted collection passed as props at build time | FLOWING |

---

## Behavioral Spot-Checks

Step 7b: SKIPPED — Astro static site build cannot be run without `npx astro build` which starts a build process outside the 10-second constraint. The SUMMARY documents build passes in all three plans (commits c300e0d, e090b02, de6ccd8, d4d8bc6, 1dab639).

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| HOME-01 | 02-02 | Home page displays full-width list of projects | PARTIAL | Grid present but 2-column, not "full-width list one per row." No visible title. ROADMAP SC-1 uses "full-width list, one per row with large image and visible title below" — not met |
| HOME-02 | 02-02 | Each project row is clickable and navigates to individual project page | VERIFIED | `<a href={'/projects/${project.slug}'}>` wraps each image |
| HOME-03 | 02-02 | Project order is manually controlled via front matter | VERIFIED | `.sort((a, b) => a.data.order - b.data.order)` in index.astro |
| HOME-04 | 02-02 | No category filters | VERIFIED | Single sorted list, no filter UI |
| HOME-05 | 02-02 | Project title always visible below image | FAILED | No title rendered on home page — images-only grid per locked decision D-02. REQUIREMENTS.md marks as "Complete" which is inaccurate. |
| PROJ-01 | 02-03 | Project page displays title and descriptive text | VERIFIED | `<h1>{data.title}</h1>` and `<p>{data.description}</p>` in metadata section |
| PROJ-02 | 02-03 | Project page displays images as full-width vertical stack | VERIFIED | `.project-gallery` flex column with `width: 100%` images |
| PROJ-03 | 02-03 | Images lazy-loaded and optimized (WebP, responsive srcset) | PARTIAL | `loading="lazy"` present. No WebP, no srcset, no Astro Image component. REQUIREMENTS.md marks as "Complete" which is inaccurate. |
| PROJ-04 | 02-03 | Projects with live demo display visible link | VERIFIED | Conditional `{data.liveUrl && ...}` renders "View project" |
| PROJ-05 | 02-03 | Projects without live demo display no link | VERIFIED | Conditional rendering — `sample-project-2.md` has no `liveUrl`, no link rendered |
| ABOUT-01 | 02-02 | About page displays bio/text section | VERIFIED | `<Content />` renders Markdown body from `about/index.md` |
| ABOUT-02 | 02-02 | About page displays LinkedIn profile link | VERIFIED | Conditional `data.linkedinUrl` renders `<a href="https://linkedin.com/in/alexandregalatioto">LinkedIn</a>` |
| ABOUT-03 | 02-02 | About page displays Instagram profile link | VERIFIED | Conditional `data.instagramUrl` renders `<a href="https://instagram.com/alexandregalatioto">Instagram</a>` |
| ABOUT-04 | 02-01 | No contact form, no call to action | VERIFIED | No form, button, or CTA element in about.astro |

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/pages/index.astro` | 13-19 | No visible title element per project | Blocker | Fails HOME-05 and ROADMAP SC-1 — project title not visible to users browsing home page |
| `src/pages/projects/[slug].astro` | 49-51 | Plain `<img>` without srcset or WebP | Blocker | Fails PROJ-03 and ROADMAP SC-3 — images not optimized; performance impact on project pages |

---

## Human Verification Required

### 1. Home Page Visual Layout

**Test:** Open the running site at `/` and confirm what the grid actually looks like. The plan implemented a 2-column grid (not "one per row" as REQUIREMENTS.md states). Verify whether the 2-column grid is acceptable or whether one-per-row was the actual intent.
**Expected per REQUIREMENTS.md HOME-01:** "full-width list of projects — one project per row, large image + title"
**Why human:** Layout intent versus actual grid column count, and acceptability of the 2-column deviation, requires visual confirmation and a product decision.

### 2. HOME-05 Intentional Override Confirmation

**Test:** Confirm with the developer that the "images only, no titles" home page is an accepted permanent change to HOME-05, not a temporary omission.
**Expected:** Developer confirms D-02 "locked user decision" is final and adds an override entry to this VERIFICATION.md.
**Why human:** The SUMMARY documents this as a locked user decision. If confirmed, an override should be added to allow verification to pass on this item. If not, a title element must be added to `index.astro`.

### 3. PROJ-03 Image Optimization Scope

**Test:** Confirm whether WebP/srcset image optimization is intentionally deferred to Phase 3 and, if so, ensure it appears in Phase 3's roadmap requirements.
**Expected:** Either (a) PROJ-03's WebP/srcset portion is added to Phase 3's requirements in ROADMAP.md, or (b) Astro Image component is added to `[slug].astro` in a gap-closure plan for Phase 2.
**Why human:** The plan explicitly defers this to Phase 3 but Phase 3's roadmap requirements list (DSGN-02, DSGN-03, PERF-01, PERF-04) does not include PROJ-03. This is a tracking gap that needs a human to decide the correct disposition.

---

## Gaps Summary

**2 gaps blocking full goal achievement:**

**Gap 1 — Home page visible project titles (HOME-05 / SC-1)**

The home page renders a clean 2-column image grid. This is visually intentional per locked decision D-02 (plan author notes "overrides HOME-05 per locked user decision"). However, ROADMAP.md SC-1 explicitly requires "visible title below" and HOME-05 requires "Project title is always visible below the image." The implementation does not satisfy these requirements as written.

This looks intentional. If the developer confirms D-02 is permanent, add an override entry to accept this deviation. If not, a `<p>{project.data.title}</p>` element must be added below each cover image in `index.astro`.

To accept this deviation, add to this VERIFICATION.md's frontmatter:

```yaml
overrides:
  - must_have: "Home page displays visible project title below each image"
    reason: "Locked user decision D-02 — images-only grid is the deliberate aesthetic; title-free home page preferred over HOME-05 spec"
    accepted_by: "{your name}"
    accepted_at: "{ISO timestamp}"
```

**Gap 2 — WebP / responsive srcset on project page gallery (PROJ-03 / SC-3)**

Gallery images in `[slug].astro` use plain `<img src={src} loading="lazy">`. The `loading="lazy"` attribute is present, but WebP format and responsive srcset are absent. ROADMAP SC-3 and PROJ-03 both require this optimization. The plan defers it to Phase 3, but PROJ-03 does not appear in Phase 3's roadmap requirements list.

To resolve: either (a) add PROJ-03 to Phase 3's requirements in ROADMAP.md and confirm it will be addressed there, or (b) close the gap now by replacing the gallery `<img>` tags with Astro's `<Image>` component.

---

_Verified: 2026-04-15T14:00:00Z_
_Verifier: Claude (gsd-verifier)_
