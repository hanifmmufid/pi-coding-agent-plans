---
description: Create a greenfield design foundation (DESIGN_SYSTEM.md) with global defaults
argument-hint: [optional project path]
---

Create or update the design foundation for this greenfield project.

Project context: $@

Follow the Mandatory Frontend / UI Workflow from global AGENTS.md.

## Direction

Apply the global default visual preference when the project has no established
design language:

- Theme: Light-first.
- App navigation: Left sidebar preferred.
- Style: modern, minimal, elegant, professional, clean, restrained.
- Elevation: restrained (subtle borders + spacing over shadows).
- Cards: only for meaningful grouping.
- Color: neutral-first with restrained accent.
- Content density: operational, information-dense but scannable.

## Deliverable

Create `docs/DESIGN_SYSTEM.md` covering:

1. Visual Direction — one-paragraph intent.
2. Theme — light-first, optional dark notes.
3. Typography — typeface, scale, hierarchy, weights, line-height.
4. Color Roles — background, surface, border, primary text, secondary text,
   accent, semantic (success/warning/danger/info).
5. Spacing — spacing scale (e.g. 4px base), usage rules.
6. Density — compact vs comfortable, when each applies.
7. Component Language — buttons, forms, inputs, tables, badges, modals,
   dropdowns, toasts.
8. Navigation — left sidebar pattern, active/hover states, mobile drawer.
9. Cards — when they are appropriate and when they are not.
10. Forms — labels, validation, field spacing, actions.
11. Tables — density, alignment, sorting, row states.
12. Responsive Behavior — breakpoints, sidebar→drawer, table behavior.
13. Motion — subtle and functional only.
14. Do / Don't — explicit list.

## Constraints

- Do not create marketing-style patterns for operational UI.
- Do not add excessive gradients, blobs, random effects.
- Keep it implementable by the default model (DeepSeek V4 Flash).
- Do not over-engineer the design system.

## Output

Report:
- path of created/updated DESIGN_SYSTEM.md,
- key decisions (theme, nav, typography, color roles),
- how it maps to the global default preference,
- any deviation from the global defaults and why.
