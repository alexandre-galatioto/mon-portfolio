# Art Director Portfolio

## What This Is

A static portfolio website for an art director with 15 years of experience, built with Astro SSG and deployed on Netlify/Vercel. It showcases web, app, illustration, and publishing projects for big brands and agencies. The audience is recruiters who need to quickly assess skills, experience, and professional caliber.

## Core Value

Make recruiters immediately understand they are looking at a seasoned, serious professional — through the quality of the work, not through marketing copy.

## Requirements

### Validated

- [x] Disappear-on-scroll navigation (reappears on scroll up), minimal top bar — Validated in Phase 1: Foundation
- [x] Projects managed via Markdown files (content editable without touching code) — Validated in Phase 1: Foundation
- [x] Astro SSG output (`output: 'static'`) — pure HTML/CSS, no runtime — Validated in Phase 1: Foundation
- [x] No analytics, no tracking — Validated in Phase 1: Foundation
- [x] White / minimal visual design — images do the talking — Validated in Phase 1: Foundation (design tokens + global CSS)

### Active

- [ ] Fully responsive across all devices (mobile, tablet, desktop)
- [ ] Page load under 2 seconds
- [ ] No calls to action

### Validated in Phase 2: Content Pages

- [x] Home page with full-width project list (images-only grid per D-02 decision) — Validated in Phase 2: Content Pages
- [x] Individual project pages with title, description text, and images — Validated in Phase 2: Content Pages
- [x] Some project pages include a link to a live demo — Validated in Phase 2: Content Pages
- [x] About page with bio text and contact links (LinkedIn + Instagram) — Validated in Phase 2: Content Pages
- [x] Built-in image optimization (WebP, responsive srcset, lazy loading via Astro's Image component) — Validated in Phase 2: Content Pages (scaffolded with Image component; full optimization activates with src/assets/ images)

### Out of Scope

- Analytics or tracking of any kind — explicitly excluded by client
- Contact form — no backend needed, direct email + social links sufficient for recruiter audience
- CMS or admin UI — Markdown files are the content layer
- Dark mode — white/minimal is the deliberate aesthetic
- Blog or editorial section — not relevant to the portfolio's goal
- Multi-language — single language site

## Context

- Owner: Art director, 15 years of experience
- Project types: websites and apps for big brands/agencies, illustration projects, comic book publishing
- Every project has images; some have live demo URLs
- Target audience: recruiters evaluating seniority, range, and client quality
- Contact: LinkedIn + Instagram (no email form, no CTA)
- Hosting: Netlify or Vercel (CDN-delivered static files)
- Content updates: owner edits Markdown files directly — no CMS, no build complexity

## Constraints

- **Tech stack**: Astro (SSG mode) — locked in for Markdown content collections and zero-JS output
- **Performance**: Page load < 2 seconds — drives image optimization strategy
- **Privacy**: No analytics, no third-party tracking scripts
- **Hosting**: Netlify or Vercel — static file deployment, no server required
- **Content model**: Markdown files — non-negotiable, must remain simple to edit

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro SSG | Zero JS by default, Markdown content collections, built-in image optimization — best fit for image-heavy static portfolio | ✓ Phase 1 |
| Full-width project list (not grid) | Editorial, intentional feel — slows viewer down, suits art director audience | — Pending |
| Disappear-on-scroll nav | More editorial than sticky nav, consistent with minimal aesthetic | ✓ Phase 1 |
| No contact form | Recruiters email directly; form needs backend/third-party; no CTAs policy | — Pending |
| No analytics | Explicit client requirement | ✓ Phase 1 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-15 after Phase 2 (Content Pages) completion*
