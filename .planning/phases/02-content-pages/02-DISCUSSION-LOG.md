# Phase 2: Content Pages - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-15
**Phase:** 02-content-pages
**Areas discussed:** Home page layout, Project page structure, About page layout, Featured flag behavior

---

## Home Page Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Full-bleed image, title below | Image spans edge to edge, title beneath | |
| Padded image, title below | Image with horizontal margins, title beneath | Modified ✓ |
| Image with overlaid title | Title on top of image with semi-transparent background | |

**User's choice:** Padded images with margins, BUT modified to 2-column grid on desktop / 1-column on mobile, and no titles at all — images only.

| Option | Description | Selected |
|--------|-------------|----------|
| Landscape 16:9 | Wide cinematic feel | |
| Landscape 3:2 | Classic photo ratio | ✓ |
| Natural aspect ratio | Each cover at native ratio | |

**User's choice:** 3:2 landscape aspect ratio

| Option | Description | Selected |
|--------|-------------|----------|
| Image + title only | Minimal — just cover and project name | |
| Image + title + short description | Adds description text for more context | |
| Image + title + category tag | Adds type tag, needs new schema field | |

**User's choice:** None of the above — images only, no title, no text whatsoever.

| Option | Description | Selected |
|--------|-------------|----------|
| No gap | Dense mosaic, edge to edge | |
| Small gap (8–16px) | Subtle breathing room | ✓ |
| Large gap (24–48px) | Generous whitespace | |

**User's choice:** Small gap (8–16px)

---

## Project Page Structure

**User's choice:** Provided full layout specification directly:
1. Full-width cover image at top (no text)
2. 2-column text section: left = project name + project type, right = project description
3. Project images stacked vertically, one per row, with margins
4. Prev/next navigation at bottom with project names as links
5. Footer: "Alexandre Galatioto ©2026"

| Option | Description | Selected |
|--------|-------------|----------|
| Free text field | Type whatever per project | ✓ |
| Fixed list of categories | Predefined set of types | |

**User's choice:** Free text field for project type (new schema field)

| Option | Description | Selected |
|--------|-------------|----------|
| In the right column, after description | Natural reading flow | ✓ |
| In the left column, under project type | Grouped with metadata | |

**User's choice:** Live demo link in the right column, after description

| Option | Description | Selected |
|--------|-------------|----------|
| Every page | Global footer in BaseLayout | ✓ |
| Project pages only | Only on project detail pages | |

**User's choice:** Footer on every page

---

## About Page Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Single centered column | Narrow centered bio text with links below | |
| Two columns: photo + text | Portrait photo left, bio text right | ✓ |
| Full-width text, links as icons | Wide bio text, icon links | |

**User's choice:** Two columns with portrait photo

| Option | Description | Selected |
|--------|-------------|----------|
| Markdown front matter field | `portrait` field in about schema | ✓ |
| Hardcoded path | Fixed path like /images/about/portrait.jpg | |

**User's choice:** Portrait path via Markdown front matter field

---

## Featured Flag Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Featured spans full width | Featured projects break the 2-column grid | |
| Ignore it for now | Keep field but don't render difference | |
| Remove the field entirely | Drop `featured` from schema | ✓ |

**User's choice:** Remove the `featured` field entirely — not needed with the images-only grid approach.

---

## Claude's Discretion

- Exact gap size within 8–16px range
- Cover image height on project pages
- Typography sizing for project metadata
- Prev/next navigation styling
- Footer typography and spacing
- Mobile collapse behavior for 2-column layouts

## Deferred Ideas

None — discussion stayed within phase scope
