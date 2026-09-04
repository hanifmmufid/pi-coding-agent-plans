# Improvement Plan — Existing Pi Frontend Skill Hardening

**Version:** 1.0  
**Scope:** Existing global Pi frontend workflow  
**Goal:** Improve the current frontend skill/workflow without replacing it, creating a new skill, or reducing current visual quality.

## 1. Objective

Preserve the current frontend workflow and add only three guards:

```text
1. Framework-native implementation guard
2. Production state completeness checks
3. Technical / Functional / Visual completion gates
```

Target:

```text
Existing frontend-design workflow
+ framework-native implementation
+ production readiness checks
+ clear completion gates
```

Not:

```text
new frontend skill
rewrite existing skill
multi-agent frontend system
one skill per framework
```

## 2. Existing Workflow to Preserve

```text
Frontend task detected
→ load frontend-design skill
→ inspect existing UI/design system
→ follow existing visual language
→ implement
→ run actual page
→ desktop screenshot
→ visual review
→ fix if needed
→ mobile screenshot
→ responsive review
→ functional validation
→ DONE
```

Keep current quality targets:

```text
modern
minimal
elegant
professional
production-grade
not wireframe-like
not generic AI-looking
```

Greenfield fallback remains:

```text
light-first
left-sidebar preferred
clean
restrained
```

Existing project design always has higher priority.

## 3. Frozen Requirements

1. Do not create a new frontend skill.
2. Do not fork `frontend-design` unless truly necessary.
3. Do not reduce current visual standards.
4. Keep screenshot validation.
5. Keep desktop/mobile validation.
6. Keep DeepSeek V4 Flash as primary implementation model.
7. Keep the current vision reviewer and anti-loop budget.
8. Keep existing project design system as source of truth.
9. Global visual defaults remain fallback only.
10. Improvements must be additive and lightweight.

## 4. Improvement A — Framework-Native Implementation Guard

Before meaningful frontend implementation, Pi must detect and understand:

```text
framework
framework version
rendering model
styling system
component library
routing model
existing architecture
existing component conventions
```

This applies across:

```text
React / Next.js
Vue / Nuxt
Svelte / SvelteKit
Angular
Astro
Solid
HTMX / Alpine
Laravel Blade
Django Templates
Rails
Odoo OWL / QWeb
plain HTML/CSS/JS
other web frameworks
```

Design rules remain framework-agnostic. Implementation must remain framework-native.

### Rule to merge

```md
### Framework-Native Implementation

Frontend design requirements are framework-agnostic.

Before implementation:

1. Detect the active frontend framework and version.
2. Inspect the project's rendering model and architecture.
3. Inspect existing components, styling system, routing, and conventions.
4. Follow framework-native patterns and APIs.
5. Reuse existing project abstractions before creating new ones.
6. Do not import architectural patterns from another framework unnecessarily.
7. If the framework is unfamiliar, inspect local project structure/config/docs first.
8. Keep the same visual quality requirements regardless of framework.
```

## 5. Priority Order

```text
1. User explicit requirement
2. Frozen project/spec requirement
3. Existing project architecture
4. Existing design/component system
5. Framework-native conventions
6. Global frontend defaults
7. Reviewer recommendations
```

## 6. Improvement B — Production State Completeness

For production UI, check relevant states when applicable:

```text
loading
empty
error
disabled/submitting
long-content behavior
overflow behavior
responsive edge cases
basic accessibility
```

Do not require irrelevant states.

### Data-driven page

```text
[ ] normal state
[ ] loading state
[ ] empty state
[ ] error state
```

### Form

```text
[ ] normal state
[ ] validation error
[ ] disabled/submitting state
[ ] success/feedback state if relevant
```

### Table/List

```text
[ ] normal data
[ ] empty data
[ ] long content
[ ] horizontal overflow if relevant
[ ] mobile behavior
```

## 7. Basic Accessibility Guard

Minimum checks:

```text
clear labels
usable focus states
reasonable semantic structure
keyboard-accessible primary actions where applicable
sufficient visual distinction for interactive controls
no critical information conveyed by color alone
```

Do not turn every task into a full accessibility audit.

## 8. Improvement C — Three Completion Gates

Frontend work is only complete when relevant gates pass:

```text
TECHNICAL
FUNCTIONAL
VISUAL
```

### Technical Gate

```text
[ ] build passes
[ ] no obvious runtime errors
[ ] no broken imports
[ ] framework conventions respected
[ ] no console-breaking errors
```

Run relevant existing lint/tests when available.

### Functional Gate

```text
[ ] primary navigation works
[ ] important actions work
[ ] forms work if present
[ ] relevant loading/error/empty states work
[ ] responsive behavior is usable
[ ] data interaction behaves as intended
```

### Visual Gate

```text
[ ] actual rendered UI reviewed
[ ] desktop acceptable
[ ] mobile acceptable
[ ] no major overlap
[ ] no severe overflow
[ ] clear hierarchy
[ ] typography readable
[ ] important actions visible
[ ] consistent with existing design language
```

Minor-only cosmetic issues do not block completion.

## 9. Existing Vision Workflow Must Stay Intact

Keep:

```text
DeepSeek V4 Flash
→ implement
→ screenshot
→ vision reviewer
→ structured findings
→ DeepSeek fixes if needed
```

Keep existing anti-loop behavior:

```text
default max visual review calls = 2
```

Second review only after meaningful CRITICAL/MAJOR findings and a meaningful fix.

No endless cosmetic loop.

## 10. Framework Detection Workflow

Inspect:

```text
package.json / manifest
framework config
entrypoints
app structure
styling config
component library
```

Examples:

```text
Next.js → next.config + app/pages
SvelteKit → svelte.config + src/routes
Nuxt → nuxt.config + pages/app
Odoo → manifest + assets + OWL/QWeb
```

Do not hardcode support to these examples only.

## 11. Existing Project Behavior

For existing products:

```text
inspect current screens
inspect existing components
inspect spacing/density
inspect typography
inspect interaction patterns
reuse existing tokens/components
```

Rule:

```text
improve locally
preserve product consistency
avoid unnecessary redesign
```

## 12. Greenfield Behavior

When no established design language exists:

```text
light theme
left sidebar for application/dashboard UI
modern
minimal
elegant
professional
clean
restrained
```

Framework-native implementation still applies.

## 13. Avoid Cross-Framework Architecture Leakage

Bad:

```text
Svelte project → forced React-style architecture
Odoo project → forced generic SaaS dashboard style
```

Good:

```text
universal visual quality
+ native framework implementation
+ existing product conventions
```

## 14. Update Global AGENTS.md Minimally

Merge only:

```md
### Framework-Native Production Frontend

For frontend/UI tasks:

- detect and respect the project's framework, version, rendering model, component conventions, and styling system before implementation;
- keep design requirements framework-agnostic but implementation framework-native;
- reuse existing project components and patterns where appropriate;
- do not force patterns from another framework;
- for production-facing UI, check relevant loading, empty, error, disabled, long-content, overflow, responsive, and basic accessibility states;
- frontend work is complete only when relevant Technical, Functional, and Visual gates pass.
```

## 15. Update `/execute` Minimally

```md
### Frontend Production Gate

Before meaningful frontend implementation:

1. Detect framework and project conventions.
2. Apply the existing `frontend-design` workflow.
3. Implement using framework-native patterns.
4. Validate relevant production states.
5. Complete Technical, Functional, and Visual gates.
6. Do not declare DONE until all relevant gates pass.
```

## 16. Update `/fix` Minimally

```md
### Frontend Fix Rules

- preserve existing design language;
- follow framework-native implementation patterns;
- fix the smallest relevant area;
- recheck only affected production states;
- repeat screenshot review only after meaningful visual change;
- do not expand scope into redesign unless required.
```

## 17. Update `/review` Minimally

```md
### Frontend Review

Review frontend work across three dimensions:

TECHNICAL
- build/runtime/framework correctness

FUNCTIONAL
- interactions, state handling, responsive usability

VISUAL
- actual rendered quality, hierarchy, spacing, typography, consistency

Do not fail a task for minor cosmetic issues when functionality and visual quality are already acceptable.
```

## 18. Skill Package Policy

Keep the existing global frontend-design package.

Do not create:

```text
react-frontend-skill
vue-frontend-skill
svelte-frontend-skill
astro-frontend-skill
etc.
```

Only consider a framework-specific skill later if repeated real-world failures prove general repo inspection is insufficient.

## 19. Out of Scope

Do not add:

```text
new frontend skill
multi-agent designer system
framework skill collection
Figma integration
pixel-perfect loop
full accessibility audit by default
visual regression CI
automatic component library replacement
automatic redesign
new dedicated design model
```

## 20. Validation Scenarios

### Existing Next.js app
Expected:
```text
detect framework
inspect current design system
reuse components
apply frontend-design
validate production states
pass three gates
```

### SvelteKit app
Expected:
```text
use Svelte-native implementation
do not copy React architecture
same visual quality target
```

### Odoo UI
Expected:
```text
preserve Odoo/OWL/QWeb conventions
preserve operational density
do not force generic SaaS styling
```

### Greenfield framework
Expected:
```text
detect native structure
apply global visual fallback
create coherent design foundation
validate rendered UI
```

### Data page
When relevant:
```text
normal
loading
empty
error
responsive
```

## 21. Acceptance Criteria

- **AC-1:** Existing frontend-design skill remains the core skill.
- **AC-2:** No new frontend skill is introduced.
- **AC-3:** Framework detection occurs before meaningful implementation.
- **AC-4:** Implementation follows framework-native conventions.
- **AC-5:** Existing design system outranks global defaults.
- **AC-6:** Relevant production states are checked.
- **AC-7:** Technical gate exists.
- **AC-8:** Functional gate exists.
- **AC-9:** Visual gate exists.
- **AC-10:** Screenshot/vision validation remains intact.
- **AC-11:** Vision anti-loop remains intact.
- **AC-12:** DeepSeek V4 Flash remains primary executor.
- **AC-13:** No unnecessary redesign occurs.
- **AC-14:** Visual quality does not decrease.
- **AC-15:** Workflow remains lightweight.

## 22. Definition of Done

- [ ] Existing frontend configuration audited.
- [ ] Existing frontend-design skill preserved.
- [ ] Framework-native guard merged.
- [ ] Production-state checks merged.
- [ ] Three completion gates merged.
- [ ] AGENTS.md updated minimally.
- [ ] `/execute` updated minimally.
- [ ] `/fix` updated minimally.
- [ ] `/review` updated minimally.
- [ ] Vision workflow unchanged.
- [ ] Anti-loop behavior unchanged.
- [ ] Existing project test passes.
- [ ] Different framework test passes.
- [ ] Convention-heavy framework test passes.
- [ ] No visual-quality regression observed.

## 23. Implementation Order

```text
1. Audit existing frontend configuration
2. Backup affected global files
3. Preserve existing frontend-design skill
4. Add framework-native guard
5. Add production-state checks
6. Add Technical / Functional / Visual gates
7. Merge AGENTS.md minimally
8. Merge /execute minimally
9. Merge /fix minimally
10. Merge /review minimally
11. Validate existing project
12. Validate another framework
13. Validate production states
14. Confirm vision loop still behaves correctly
15. Stop when acceptance criteria pass
```

## 24. Anti-Regression Principle

If a new rule causes:

```text
worse visual output
more generic UI
excessive instruction overhead
slower normal frontend workflow
unnecessary rework
```

prefer reverting or simplifying that rule.

## 25. Final Architecture

```text
Frontend Task
→ Detect Framework + Project Conventions
→ Existing frontend-design Skill
→ Framework-Native Implementation
→ Production State Checks
→ Technical Gate
→ Functional Gate
→ Visual Gate
→ Vision Review if needed
→ DONE
```

## 26. Final Principle

> Keep the frontend skill that already works well.

> Improve it with small production-oriented guards, not a rewrite.

> Design quality stays universal; implementation stays native to the framework actually used by the project.
