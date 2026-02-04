# Product Requirements Document (PRD) - Zyenx Showcase MVP

## 1. Overview
**Project Name:** Zyenx Showcase MVP
**Goal:** A high-performance, visually stunning landing page to demonstrate ZyenxCorp's engineering and design capabilities to potential clients.
**Stack:** HTML5, TailwindCSS (via CDN for speed), Vanilla JS, Docker (for Coolify deployment).

## 2. Features
- **Hero Section:** "Future-Proof Your Business" with a dynamic particle/network background effect.
- **Services Grid:** 3 cards (Automation, Analytics, Web) with hover effects.
- **The "Brain" Demo:** A live, simulated terminal window typing out "system status" logs (meta-reference to Zyenx).
- **CTA:** Simple "Audit My System" button linking to `mailto:zyenxcorp@gmail.com`.

## 3. Technical Specs
- **Docker:** `nginx:alpine` based for minimal footprint.
- **Performance:** Lighthouse score target > 95.
- **Responsiveness:** Mobile-first.

## 4. Work Breakdown (Delegation Plan)
1.  **Frontend Core:** Generate `index.html` with Tailwind structure. -> *Delegate to Gemini*
2.  **Visuals:** Generate `style.css` for custom animations/particle effects. -> *Delegate to Gemini*
3.  **Logic:** Generate `script.js` for the "Terminal Typing" effect. -> *Delegate to Gemini*
4.  **DevOps:** Create `Dockerfile` and `nginx.conf`. -> *Self*

## 5. Execution
I will now spawn the sub-tasks to build these assets.
