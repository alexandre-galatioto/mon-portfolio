# Phase 3: Responsive, Performance & Deploy - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-15
**Phase:** 03-responsive-performance-deploy
**Areas discussed:** Deployment platform, Performance budget, Image fill behavior

---

## Deployment Platform

| Option | Description | Selected |
|--------|-------------|----------|
| Netlify (Recommended) | Native Astro adapter, generous free tier, automatic deploy on git push, easy custom domain | ✓ |
| Vercel | Also has Astro support, fast edge network, slightly more complex config for pure static | |
| Both ready | Configure for Netlify as primary but keep config portable | |

**User's choice:** Netlify
**Notes:** User already has a Netlify account — will connect the repo manually.

| Option | Description | Selected |
|--------|-------------|----------|
| Start from scratch | Plan includes Netlify site creation, git repo linking, build settings | |
| Already have account | Just need build config and deploy settings | ✓ |
| You decide | Claude handles whatever setup is needed | |

**User's choice:** Already have account

| Option | Description | Selected |
|--------|-------------|----------|
| Custom domain | Plan includes DNS configuration steps | ✓ |
| Netlify URL for now | Ship with default .netlify.app URL | |

**User's choice:** Custom domain

---

## Performance Budget

| Option | Description | Selected |
|--------|-------------|----------|
| Move to src/assets/ (Recommended) | Astro auto-generates optimized WebP with srcset at build time | ✓ |
| Keep in public/ | Images served as-is, manual optimization needed | |
| You decide | Claude picks best approach for <2s target | |

**User's choice:** Move images to src/assets/ for Astro optimization

| Option | Description | Selected |
|--------|-------------|----------|
| Preload + font-display: swap (Recommended) | Preload Regular weight, others load on demand | ✓ |
| Preload all weights | Preload all 4 font files (~200-400KB extra) | |
| You decide | Claude picks best balance of speed and stability | |

**User's choice:** Preload Regular weight + font-display: swap

| Option | Description | Selected |
|--------|-------------|----------|
| 90+ Lighthouse score | Standard best-practice target, achievable with Astro static | ✓ |
| Just the 2s target | Don't chase a Lighthouse number | |
| 100 (perfect) | May require extra effort on CLS, accessibility, preloading | |

**User's choice:** 90+ Lighthouse performance score

---

## Image Fill Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Preserve aspect ratio, fill width (Recommended) | Images fill container width, height adjusts naturally. No cropping on gallery pages. | ✓ |
| Uniform aspect ratio everywhere | Force consistent ratio on all images including gallery | |
| You decide | Claude picks what looks best for a portfolio | |

**User's choice:** Preserve original aspect ratio, fill width

| Option | Description | Selected |
|--------|-------------|----------|
| Cap at max-width (Recommended) | Images stop growing past ~1200-1400px, center on page | ✓ |
| Full bleed always | Images fill 100% viewport width regardless of screen size | |
| You decide | Claude picks what works for portfolio presentation | |

**User's choice:** Cap at max-width (~1200-1400px)

---

## Claude's Discretion

- Exact max-width value (1200-1400px range)
- Specific Netlify build settings beyond basics
- netlify.toml vs dashboard config
- Font preload tag placement
- Additional Lighthouse optimizations for 90+ score
- Tablet-specific layout adjustments

## Deferred Ideas

None — discussion stayed within phase scope
