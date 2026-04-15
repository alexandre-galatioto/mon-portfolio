# Requirements: Art Director Portfolio

**Defined:** 2026-04-15
**Core Value:** Make recruiters immediately understand they are looking at a seasoned, serious professional — through the quality of the work, not through marketing copy.

## v1 Requirements

### Navigation

- [ ] **NAV-01**: Site displays a minimal top navigation bar with name/logo on the left and page links (Work, About) on the right
- [ ] **NAV-02**: Navigation bar disappears on scroll down and reappears on scroll up
- [ ] **NAV-03**: On mobile, navigation collapses into a hamburger menu
- [ ] **NAV-04**: Navigation is accessible on all pages

### Home Page

- [ ] **HOME-01**: Home page displays a full-width list of projects — one project per row, large image + title
- [ ] **HOME-02**: Each project row is clickable and navigates to the individual project page
- [ ] **HOME-03**: Project order is manually controlled via Markdown front matter (curated order)
- [ ] **HOME-04**: No category filters — all projects displayed in a single scrollable list
- [ ] **HOME-05**: Project title is always visible below the image (no hover-only reveal)

### Project Pages

- [ ] **PROJ-01**: Each project page displays a title and descriptive text
- [ ] **PROJ-02**: Each project page displays its images as a full-width vertical stack (one image per row)
- [ ] **PROJ-03**: Images are lazy-loaded and optimized (WebP, responsive srcset via Astro Image)
- [ ] **PROJ-04**: Projects that have a live demo display a visible link to the external URL
- [ ] **PROJ-05**: Projects without a live demo display no link (optional field in Markdown)

### About Page

- [ ] **ABOUT-01**: About page displays a bio/text section
- [ ] **ABOUT-02**: About page displays a LinkedIn profile link
- [ ] **ABOUT-03**: About page displays an Instagram profile link
- [ ] **ABOUT-04**: No contact form, no call to action

### Content Management

- [ ] **CONT-01**: Each project is defined by a Markdown file with front matter (title, description, images, live demo URL, order)
- [ ] **CONT-02**: Adding a new project requires only creating a new Markdown file — no code changes
- [ ] **CONT-03**: Project order on the home page is controlled by a `order` field in front matter
- [ ] **CONT-04**: About page text is editable via a Markdown file

### Design & Accessibility

- [ ] **DSGN-01**: Visual design is white/minimal — generous whitespace, no decorative elements, typography-led
- [ ] **DSGN-02**: Site is fully responsive on mobile, tablet, and desktop
- [ ] **DSGN-03**: Images fill the container width on all screen sizes
- [ ] **DSGN-04**: No animations beyond nav hide/show behavior

### Performance & Privacy

- [ ] **PERF-01**: Pages load in under 2 seconds on a standard connection
- [ ] **PERF-02**: Astro outputs `static` mode — pure HTML/CSS, zero client-side JS by default
- [ ] **PERF-03**: No analytics scripts, no tracking pixels, no third-party monitoring
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
| NAV-01 | — | Pending |
| NAV-02 | — | Pending |
| NAV-03 | — | Pending |
| NAV-04 | — | Pending |
| HOME-01 | — | Pending |
| HOME-02 | — | Pending |
| HOME-03 | — | Pending |
| HOME-04 | — | Pending |
| HOME-05 | — | Pending |
| PROJ-01 | — | Pending |
| PROJ-02 | — | Pending |
| PROJ-03 | — | Pending |
| PROJ-04 | — | Pending |
| PROJ-05 | — | Pending |
| ABOUT-01 | — | Pending |
| ABOUT-02 | — | Pending |
| ABOUT-03 | — | Pending |
| ABOUT-04 | — | Pending |
| CONT-01 | — | Pending |
| CONT-02 | — | Pending |
| CONT-03 | — | Pending |
| CONT-04 | — | Pending |
| DSGN-01 | — | Pending |
| DSGN-02 | — | Pending |
| DSGN-03 | — | Pending |
| DSGN-04 | — | Pending |
| PERF-01 | — | Pending |
| PERF-02 | — | Pending |
| PERF-03 | — | Pending |
| PERF-04 | — | Pending |

**Coverage:**
- v1 requirements: 30 total
- Mapped to phases: 0 (traceability filled by roadmap)
- Unmapped: 30 ⚠️ (will be resolved during roadmap creation)

---
*Requirements defined: 2026-04-15*
*Last updated: 2026-04-15 after initial definition*
