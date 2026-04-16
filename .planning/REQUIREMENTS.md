# Requirements: Art Director Portfolio

**Defined:** 2026-04-15
**Core Value:** Make recruiters immediately understand they are looking at a seasoned, serious professional — through the quality of the work, not through marketing copy.

## v1 Requirements

### Navigation

- [x] **NAV-01**: Site displays a minimal top navigation bar with name/logo on the left and page links (Work, About) on the right
- [x] **NAV-02**: Navigation bar disappears on scroll down and reappears on scroll up
- [x] **NAV-03**: On mobile, navigation collapses into a hamburger menu
- [x] **NAV-04**: Navigation is accessible on all pages

### Home Page

- [x] **HOME-01**: Home page displays a full-width list of projects — one project per row, large image + title
- [x] **HOME-02**: Each project row is clickable and navigates to the individual project page
- [x] **HOME-03**: Project order is manually controlled via Markdown front matter (curated order)
- [x] **HOME-04**: No category filters — all projects displayed in a single scrollable list
- [x] **HOME-05**: Project title is always visible below the image (no hover-only reveal)

### Project Pages

- [x] **PROJ-01**: Each project page displays a title and descriptive text
- [x] **PROJ-02**: Each project page displays its images as a full-width vertical stack (one image per row)
- [x] **PROJ-03**: Images are lazy-loaded and optimized (WebP, responsive srcset via Astro Image)
- [x] **PROJ-04**: Projects that have a live demo display a visible link to the external URL
- [x] **PROJ-05**: Projects without a live demo display no link (optional field in Markdown)

### About Page

- [x] **ABOUT-01**: About page displays a bio/text section
- [x] **ABOUT-02**: About page displays a LinkedIn profile link
- [x] **ABOUT-03**: About page displays an Instagram profile link
- [x] **ABOUT-04**: No contact form, no call to action

### Content Management

- [x] **CONT-01**: Each project is defined by a Markdown file with front matter (title, description, images, live demo URL, order)
- [x] **CONT-02**: Adding a new project requires only creating a new Markdown file — no code changes
- [x] **CONT-03**: Project order on the home page is controlled by a `order` field in front matter
- [x] **CONT-04**: About page text is editable via a Markdown file

### Design & Accessibility

- [x] **DSGN-01**: Visual design is white/minimal — generous whitespace, no decorative elements, typography-led
- [x] **DSGN-02**: Site is fully responsive on mobile, tablet, and desktop
- [x] **DSGN-03**: Images fill the container width on all screen sizes
- [x] **DSGN-04**: No animations beyond nav hide/show behavior

### Performance & Privacy

- [x] **PERF-01**: Pages load in under 2 seconds on a standard connection
- [x] **PERF-02**: Astro outputs `static` mode — pure HTML/CSS, zero client-side JS by default
- [x] **PERF-03**: No analytics scripts, no tracking pixels, no third-party monitoring
- [ ] **PERF-04**: Site is deployable to Netlify or Vercel via git push

## v2 Requirements

### Enhancements (deferred)

- **V2-01**: Dark mode toggle
- **V2-02**: Project category filter / tag system
- **V2-03**: Password-protected case study pages (for NDA clients)
- **V2-04**: Subtle page transition animations
- **V2-05**: Open Graph / social sharing meta tags per project

## Out of Scope

| Feature | Reason |
|---------|--------|
| Contact form | No backend needed; recruiters email directly; no CTAs policy |
| Analytics / tracking | Explicit client requirement — privacy first |
| CMS or admin UI | Markdown files are the content layer |
| Dark mode | White/minimal is the deliberate aesthetic for v1 |
| Category filters | Single editorial list is intentional for v1 |
| Blog / editorial section | Not relevant to portfolio goal |
| Multi-language | Single language site |
| Comments / social features | Portfolio is read-only |
| Search | Project count doesn't warrant it |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| NAV-01 | Phase 1 | Complete |
| NAV-02 | Phase 1 | Complete |
| NAV-03 | Phase 1 | Complete |
| NAV-04 | Phase 1 | Complete |
| HOME-01 | Phase 2 | Complete |
| HOME-02 | Phase 2 | Complete |
| HOME-03 | Phase 2 | Complete |
| HOME-04 | Phase 2 | Complete |
| HOME-05 | Phase 2 | Complete |
| PROJ-01 | Phase 2 | Complete |
| PROJ-02 | Phase 2 | Complete |
| PROJ-03 | Phase 2 | Complete |
| PROJ-04 | Phase 2 | Complete |
| PROJ-05 | Phase 2 | Complete |
| ABOUT-01 | Phase 2 | Complete |
| ABOUT-02 | Phase 2 | Complete |
| ABOUT-03 | Phase 2 | Complete |
| ABOUT-04 | Phase 2 | Complete |
| CONT-01 | Phase 1 | Complete |
| CONT-02 | Phase 1 | Complete |
| CONT-03 | Phase 1 | Complete |
| CONT-04 | Phase 1 | Complete |
| DSGN-01 | Phase 1 | Complete |
| DSGN-02 | Phase 3 | Complete |
| DSGN-03 | Phase 3 | Complete |
| DSGN-04 | Phase 1 | Complete |
| PERF-01 | Phase 3 | Complete |
| PERF-02 | Phase 1 | Complete |
| PERF-03 | Phase 1 | Complete |
| PERF-04 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 30 total
- Mapped to phases: 30
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-15*
*Last updated: 2026-04-15 after roadmap creation*
