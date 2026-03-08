# Home Page Review and Roadmap

> **Author**: Codex
> **Date**: March 8, 2026
> **Status**: Updated after test alignment

---

## Executive Summary

The current home page is a polished first-pass marketing surface for SecondOrder's positioning. It communicates the core thesis clearly, routes users into `/chat`, and already covers the main narrative sections described in product guidance.

The implementation is still a mostly static v1. It is optimized for message clarity rather than conversion, proof, experimentation, or long-term content scalability. The next phase should focus on making the page measurable, easier to evolve, and more persuasive to new users.

---

## Current Implementation

### What is shipped today

The marketing page is implemented in [`app/page.tsx`](/Users/henry/workspace/secondorder-web/app/page.tsx) as a single server component with page-local content arrays and static sections:

- Header with wordmark, icon, anchor navigation, and `/chat` entry point
- Hero section with product thesis, short supporting copy, and primary CTA to `/chat`
- Capability panel with four feature cards
- "What is it" overview section
- Iterative problem-solving section
- Self-auditing section
- Meta-thinking section
- Final CTA section routing users to `/chat`

The page already aligns with the current design system:

- Brand fonts from [`app/layout.tsx`](/Users/henry/workspace/secondorder-web/app/layout.tsx)
- Tailwind token usage from [`tailwind.config.ts`](/Users/henry/workspace/secondorder-web/tailwind.config.ts) and styling guidance
- Reuse of the shared [`components/ui/button.tsx`](/Users/henry/workspace/secondorder-web/components/ui/button.tsx) component

### What is working well

- Clear positioning around meta-thinking, orchestration, and self-auditing
- Consistent visual language across sections
- Simple navigation with anchor targets and a direct product CTA
- Responsive layout choices for desktop, tablet, and mobile
- Low implementation complexity, which makes the page easy to reason about

---

## Assessment

### Strengths

- The page has a coherent narrative arc: concept, mechanism, trust signal, then CTA
- Copy is consistent with the product framing described in [`docs/agents/product-and-content.md`](/Users/henry/workspace/secondorder-web/docs/agents/product-and-content.md)
- The single-file implementation keeps the current surface easy to edit while the product is still moving

### Current limitations

- Content, layout, and section structure are tightly coupled in one file, which will slow iteration as the page grows
- There is only one conversion path: enter `/chat`
- The page explains the product, but does not yet prove outcomes with demos, examples, metrics, or customer evidence
- There is no clear analytics or experimentation layer visible from the current implementation
- Mobile navigation is reduced to no nav rather than an alternative mobile pattern
- There is no reusable content model for features, proof blocks, FAQs, comparison sections, or campaign-specific variants

### Implementation debt discovered during review

- Landing-page E2E coverage has now been realigned with the current home page CTA behavior and updated copy
- The remaining debt is that the tests still validate a largely static page, not analytics, SEO, or richer conversion modules

### Recently completed

- Updated [`e2e/landing-page.spec.ts`](/Users/henry/workspace/secondorder-web/e2e/landing-page.spec.ts) to match the current `/chat` CTA flow and current on-page copy
- Updated [`e2e/button-interactions.spec.ts`](/Users/henry/workspace/secondorder-web/e2e/button-interactions.spec.ts) to validate the current CTA labels and `/chat` routing

This closes the immediate mismatch between implementation and test coverage.

---

## Roadmap

### Phase 1: Stabilize and Instrument

Goal: make the current page trustworthy to iterate on.

- Update landing-page E2E tests to match the current home page behavior and copy
- Add explicit conversion event tracking for hero CTA, nav CTA, and footer CTA
- Add basic SEO hardening: richer metadata, Open Graph image strategy, and structured landing-page copy review
- Extract the home page into reusable section components while keeping the same design language
- Move page copy arrays into a dedicated local content module so messaging can change without editing layout code

### Phase 2: Increase Persuasion

Goal: improve conversion quality for first-time visitors.

- Add a product demo or interactive preview of the `/chat` experience
- Add proof sections: example workflows, sample outputs, benchmark-style claims if defensible, or operator testimonials
- Introduce a clearer audience framing section such as "who this is for"
- Add an FAQ section that handles adoption objections: cost, reliability, privacy, and use cases
- Add a secondary CTA path for visitors who are not ready to enter chat immediately

### Phase 3: Deepen Product Story

Goal: explain differentiation in a way that supports product and investor conversations.

- Add an architecture or system-flow section showing planner, judge, tools, and feedback loops
- Add comparison content that distinguishes SecondOrder from generic chat assistants
- Add use-case landing modules for research, planning, agent orchestration, and reflective workflows
- Add changeable social-proof slots for launch announcements, usage milestones, or partner logos

### Phase 4: Build a Scalable Marketing Platform

Goal: support ongoing campaigns without turning `app/page.tsx` into a bottleneck.

- Create a reusable marketing-section library for hero, proof, comparison, FAQ, CTA, and content grids
- Introduce a content schema for marketing pages and campaign variants
- Add A/B testing hooks for headline, CTA, and demo variants
- Add a lightweight editorial workflow for updating copy and launch content
- Consider a pattern for multiple entry pages if the product begins targeting different personas

---

## Recommended Feature Backlog

Priority should be:

1. Fix stale landing-page tests
2. Add analytics for CTA clicks and scroll depth
3. Componentize the page structure
4. Add a demo/proof section above the fold or directly below the hero
5. Add FAQ and objection-handling content
6. Add social proof or outcome evidence
7. Add experiment hooks for headline and CTA variants

Updated priority after the test fix:

1. Add analytics for CTA clicks and scroll depth
2. Componentize the page structure
3. Add a demo/proof section above the fold or directly below the hero
4. Add FAQ and objection-handling content
5. Add social proof or outcome evidence
6. Add experiment hooks for headline and CTA variants

---

## Suggested Delivery Order

### Sprint 1

- Add instrumentation
- Refactor into section components without changing UI
- If needed, add one smoke check for `/chat` navigation success rather than only asserting `href` values

### Sprint 2

- Add demo/proof module
- Add FAQ
- Tighten headline and CTA hierarchy based on analytics

### Sprint 3

- Add persona or use-case modules
- Add comparison and architecture storytelling
- Prepare the page for experiments and campaign variants

---

## Success Metrics

The next version of the home page should be evaluated against:

- CTA click-through rate to `/chat`
- Scroll depth to proof and final CTA sections
- Visitor-to-chat-start conversion
- Bounce rate from the home page
- Time-to-update for copy and section changes

---

## Recommended Next Step

The highest-leverage next task is to treat the current page as the baseline v1, then immediately:

1. add analytics
2. componentize the page for faster iteration
3. ship one strong proof/demo section

That sequence improves confidence, measurement, and persuasion without forcing a full redesign.
