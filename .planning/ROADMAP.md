# Roadmap: Art Director Portfolio

## Overview

Three phases deliver a live, production-quality portfolio site. Phase 1 establishes the Astro project with its content model, navigation shell, and design system so Phase 2 can focus entirely on building the three content pages with full imagery. Phase 3 validates responsive behavior, performance, and deploys the site. By the end, recruiters encounter a fast, minimal portfolio that makes professional caliber immediately legible.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Astro scaffold, content model, navigation shell, and design system
- [ ] **Phase 2: Content Pages** - Home, project, and about pages fully built with images
- [ ] **Phase 3: Responsive, Performance & Deploy** - Cross-device polish, load validation, and live deployment

## Phase Details

### Phase 1: Foundation
**Goal**: A navigable Astro project skeleton exists with the content model, nav component, and design system in place — ready to receive pages
**Depends on**: Nothing (first phase)
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04, CONT-01, CONT-02, CONT-03, CONT-04, DSGN-01, DSGN-04, PERF-02, PERF-03
**Success Criteria** (what must be TRUE):
  1. Running `npm run dev` starts the Astro site locally with zero errors
  2. A navigation bar renders on every page with name/logo left, Work/About links right — and hides on scroll down, reappears on scroll up
  3. On mobile, the navigation collapses into a hamburger menu
  4. Adding a new Markdown file in the projects collection makes a new project available without any code changes
  5. The Astro build outputs static HTML/CSS only — no client-side JS bundle, no analytics scripts
**Plans**: 2 plans
Plans:
- [x] 01-01-PLAN.md — Astro scaffold, content collections, design tokens, global CSS
- [ ] 01-02-PLAN.md — BaseLayout, Nav component (scroll hide/show + mobile hamburger), index stub
**UI hint**: yes

### Phase 2: Content Pages
**Goal**: All three content pages (home, project, about) are fully built with correct layout, imagery, and linking
**Depends on**: Phase 1
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, PROJ-01, PROJ-02, PROJ-03, PROJ-04, PROJ-05, ABOUT-01, ABOUT-02, ABOUT-03, ABOUT-04
**Success Criteria** (what must be TRUE):
  1. The home page displays a full-width list of projects, one per row with large image and visible title below, in the manually controlled order set by front matter
  2. Clicking a project row navigates to that project's page, which shows title, description, and a full-width vertical stack of images
  3. Images on project pages are served as WebP with responsive srcset and load lazily
  4. Projects with a live demo URL display a visible link; projects without one display nothing
  5. The about page displays bio text plus LinkedIn and Instagram links, with no contact form or call to action
**Plans**: TBD
**UI hint**: yes

### Phase 3: Responsive, Performance & Deploy
**Goal**: The site passes responsive, performance, and privacy checks and is live on Netlify or Vercel
**Depends on**: Phase 2
**Requirements**: DSGN-02, DSGN-03, PERF-01, PERF-04
**Success Criteria** (what must be TRUE):
  1. Every page renders correctly on mobile, tablet, and desktop — images fill their container at all widths
  2. Pages load in under 2 seconds on a standard connection (verified via Lighthouse or WebPageTest)
  3. A git push to the main branch triggers an automatic deployment and the live URL serves the updated site
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/2 | Not started | - |
| 2. Content Pages | 0/TBD | Not started | - |
| 3. Responsive, Performance & Deploy | 0/TBD | Not started | - |
