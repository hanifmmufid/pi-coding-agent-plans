---
description: Review current changes against requirements and find remaining defects
argument-hint: [optional requirement or plan path]
---

Review the current repository changes.

If an argument is provided, use it as the governing requirement/plan:
$@

Inspect:
- git status
- git diff
- relevant surrounding implementation

Review for:

1. Requirement completeness
2. Logic correctness
3. Incorrect assumptions
4. Missing edge cases
5. Unintended behavior changes
6. Scope creep
7. Data integrity issues
8. Error handling gaps
9. Security issues where relevant
10. Temporary/debug artifacts
11. Missing validation
12. Inconsistent project conventions

Do not praise the implementation.
Act as an adversarial reviewer.

Classify findings:

- BLOCKER
- HIGH
- MEDIUM
- LOW

If no meaningful issue is found, state that clearly and summarize the evidence reviewed.
## Frontend / UI Review

If the current diff includes frontend/UI changes, review both code and rendered visual result.

Check:
- consistency with existing product,
- typography hierarchy,
- spacing,
- alignment,
- content density,
- component consistency,
- responsive behavior,
- desktop layout,
- mobile layout,
- overflow,
- accessibility of primary actions,
- generic AI-looking patterns,
- wireframe/placeholder appearance,
- excessive cards/shadows/gradients,
- unnecessary visual complexity.

Frontend review is incomplete if only the source diff is reviewed while the rendered result is available.

### Frontend Review

Review frontend work across three dimensions:

TECHNICAL
- build/runtime/framework correctness

FUNCTIONAL
- interactions, state handling, responsive usability

VISUAL
- actual rendered quality, hierarchy, spacing, typography, consistency

Do not fail a task for minor cosmetic issues when functionality and visual quality are already acceptable.

### Delegated Visual Review

If frontend changes exist and the active model cannot inspect screenshots:

- invoke the configured vision reviewer (qwen3.8-max via describe_image tool),
- obtain structured visual findings,
- combine them with source diff review,
- verify that recommendations align with project rules and design system,
- report meaningful visual defects by severity.

Do not report frontend review as complete if rendered visual evidence was available but never analyzed.

### Visual Review Threshold

Frontend review should focus on material defects.

Do not fail a frontend review solely because of MINOR cosmetic issues.

A frontend review can PASS when:
- functionality is correct,
- layout is usable,
- responsiveness is acceptable,
- hierarchy is clear,
- no CRITICAL or MAJOR visual issues remain.

Minor polish suggestions should be reported separately as optional.

### Trading Model Scope Review

Before accepting a quantitative review:
- verify that recommendations respect current tunable parameters,
- reject silent scope expansion,
- separate immediate tuning from future improvement,
- ensure fixed parameters remain untouched,
- ensure model promotion is based on evidence, not headline return.
