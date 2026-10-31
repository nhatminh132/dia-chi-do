# Cinematic Homepage Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade the homepage into a premium cinematic documentary experience with video-ready scene layers, restrained editorial UI, and smooth Scene 01 → Scene 02 motion while preserving historical content, routes, map behavior, and empty video URLs.

**Architecture:** Keep `Hero` as the owner of the opening state machine and its ScrollTrigger transition. Keep `SceneMedia` as the reusable video layer with graceful poster/fallback behavior. Improve the visual system in `globals.css`, then tune the homepage scene components without changing data ownership or `MapCanvas.tsx`.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, GSAP 3, existing scene manifest and cinematic components.

---

### Task 1: Establish cinematic visual language

**Files:**
- Modify: `src/app/globals.css`

- [ ] Add restrained documentary color, grain, vignette, focus-ring, and mobile overflow rules using existing tokens.
- [ ] Preserve all existing scene-specific styles and verify the page remains readable without video assets.
- [ ] Run `npm run lint`.

### Task 2: Upgrade opening hero composition

**Files:**
- Modify: `src/components/home/Hero.tsx`

- [ ] Keep Phase 1 video-only when a real manifest source exists, otherwise show the existing polished SVG fallback.
- [ ] Reduce intro UI to one title, subtitle, one primary CTA, one secondary link, and a skip control.
- [ ] Use a cinematic title mask and a single atmospheric focal field instead of a decorative star or horizontal red split.
- [ ] Use GSAP scrub to scale/reposition the title and reveal Scene 02 without pinning or scroll trapping.

### Task 3: Make scene media video-ready

**Files:**
- Modify: `src/components/cinematic/SceneMedia.tsx`
- Modify: `src/data/scenes.ts` only if required to preserve empty URLs

- [ ] Keep all `src` and `poster` values empty until supplied assets exist.
- [ ] Preserve muted, inline playback, lazy loading, error fallback, and reduced-motion behavior.
- [ ] Verify video failure never leaves a blank or black media hole.

### Task 4: Verify the homepage contract

**Files:**
- Test: local homepage at 390px, 768px, and 1440px

- [ ] Verify initial render, intro skip, reduced motion, Scene 02 scroll transition, media failure fallback, no horizontal overflow, and no permanent hidden content.
- [ ] Run `npm run lint` and `npm run build`.
- [ ] Confirm `MapCanvas.tsx` is unchanged.
