---
description: Structured visual review of a rendered frontend screenshot (delegate to vision model)
argument-hint: <screenshot-path> [page-purpose]
---

Review this rendered frontend screenshot as a senior product UI reviewer.

Screenshot path: $1
Page purpose: $2

Do NOT redesign the product from scratch.

Evaluate the screenshot against:
- the existing product visual language,
- the provided design system,
- the current implementation requirements,
- modern, minimal, elegant, professional UI standards.

Focus on:

1. Layout balance
2. Typography hierarchy
3. Spacing consistency
4. Alignment
5. Content density
6. Sidebar/navigation proportions
7. Table/form readability
8. Visual grouping
9. Contrast
10. Responsive/layout defects
11. Generic AI-looking patterns
12. Wireframe/placeholder appearance
13. Excessive cards
14. Excessive gradients/shadows/decorations
15. Overall production readiness

Process:
1. Use the describe_image tool on the screenshot (vision model: qwen3.8-max).
2. Ask the vision model to evaluate against the checklist above.
3. Return exactly this structure:

VISUAL_STATUS:
PASS | NEEDS_FIX

CRITICAL:
- ...

MAJOR:
- ...

MINOR:
- ...

RESPONSIVE:
- ...

DESIGN_CONSISTENCY:
PASS | NEEDS_FIX
Reason:
...

RECOMMENDED_FIXES:
1. ...
2. ...
3. ...

ACTION_REQUIRED:
YES | NO

RECHECK_REQUIRED:
YES | NO

Do not recommend changes that conflict with explicit requirements or the existing product design system.
## Review Threshold

This review uses FUNCTIONAL_QUALITY mode unless explicitly stated otherwise.

Do NOT search aggressively for cosmetic imperfections once the page is clearly usable, coherent, responsive, and production-acceptable.

Only classify an issue as MAJOR if it materially affects:

- usability,
- readability,
- hierarchy,
- navigation,
- responsiveness,
- visual consistency,
- production readiness.

Minor differences in:
- spacing,
- radius,
- shadow,
- subtle color,
- tiny alignment,
- micro visual polish

must be classified as MINOR.

MINOR findings must not cause NEEDS_FIX by themselves.

If there are no CRITICAL or MAJOR findings:

VISUAL_STATUS: PASS
ACTION_REQUIRED: NO
RECHECK_REQUIRED: NO

## Severity Model

CRITICAL — materially breaks the UI (content inaccessible, navigation unusable, major overlap, severe overflow, important actions hidden, unreadable text, broken layout). Must fix before DONE.

MAJOR — materially reduces product quality (hierarchy unclear, sidebar proportion wrong, table hard to read, major spacing inconsistency, poor responsive stacking, inconsistent with design system). Should fix before DONE.

MINOR — cosmetic only (slight spacing, softer shadow, radius inconsistency, small color refinement, tiny alignment, aesthetic preference). Does NOT trigger another vision review.

Required logic:
- CRITICAL/MAJOR exists → VISUAL_STATUS: NEEDS_FIX, ACTION_REQUIRED: YES
- MINOR only → VISUAL_STATUS: PASS, ACTION_REQUIRED: NO
