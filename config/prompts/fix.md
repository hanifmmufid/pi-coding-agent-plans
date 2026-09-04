---
description: Investigate and fix a bug with evidence-driven validation loops
argument-hint: <bug-or-issue>
---

Fix the following issue:

$@

Own the task from investigation through validated completion.

## Investigate First

Before editing:

1. Locate the relevant code.
2. Understand the current behavior.
3. Trace the execution/data path.
4. Form the most likely root-cause hypothesis.
5. Gather concrete evidence.

If confidence is low, investigate more.
Do not edit merely to test random guesses.

## Fix

Once the root cause is sufficiently supported:

1. Make the smallest correct fix.
2. Preserve unrelated behavior.
3. Follow existing project conventions.
4. Avoid unrelated refactoring.

## Validate

Run the most targeted meaningful validation.

If validation fails:

1. Diagnose the new evidence.
2. Identify whether:
   - the root cause was wrong,
   - implementation was incomplete,
   - validation setup is wrong,
   - another dependency is involved.
3. Form an updated hypothesis.
4. Make the smallest corrective change.
5. Validate again.

Maximum 3 corrective attempts for the same failure class.

## Final Verification

Before DONE:

- verify the originally reported issue,
- verify relevant acceptance behavior,
- inspect git diff,
- check for side effects,
- check for unrelated modifications,
- perform an adversarial self-review.

Return DONE only when the fix is validated.
Otherwise return BLOCKED with evidence.

## Frontend / UI Fix Enforcement

If the reported issue affects frontend/UI/UX, including layout, spacing, styling, responsiveness, theme, navigation, or component appearance:

1. Automatically load and apply the `frontend-design` skill.
2. Inspect the actual rendered page when possible.
3. Identify the visual/functional root cause before editing.
4. Make the smallest correct fix.
5. Render and inspect the result.
6. Validate desktop and mobile when the issue may affect responsiveness.
7. Do not declare DONE without visual validation.

### Frontend Fix Rules

When fixing frontend issues:

- preserve the existing design language;
- follow framework-native implementation patterns;
- fix the smallest relevant area;
- recheck only the affected production states;
- repeat screenshot review only after a meaningful visual change;
- do not expand scope into redesign unless required.

### Frontend Screenshot Review

For visual/frontend fixes:

1. Render the affected page.
2. Capture screenshot.
3. If the active model cannot read images, delegate screenshot review to the configured vision model (qwen3.8-max via describe_image tool).
4. Use structured reviewer findings to identify the visual root cause.
5. The primary model performs the code fix.
6. Re-render and re-check when the change is meaningful.
7. Do not declare DONE until visual validation passes.

### Frontend Fix Visual Budget

For visual/frontend fixes:

1. Use one visual review to verify the affected result.
2. If the reviewer finds a material CRITICAL/MAJOR issue:
   - fix it,
   - allow one final recheck.
3. If only MINOR issues remain:
   - stop visual iteration.
4. Do not keep adjusting cosmetic details unless the user requested polish.
