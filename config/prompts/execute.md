---
description: Execute an implementation plan autonomously with validation loops
argument-hint: <path-to-plan>
---

Execute the implementation plan provided in: $@

Read the entire plan before making any source-code changes.

Treat the following parts of the plan as authoritative when present:
- Objective
- Expected Behavior
- Frozen Requirements
- Out of Scope
- Constraints
- Acceptance Criteria
- Validation Plan
- Definition of Done

## Phase 1 — Inspect

Before editing:

1. Inspect the current repository state.
2. Locate all relevant implementation paths.
3. Map each important plan step to the actual codebase.
4. Validate important assumptions from the plan.
5. Identify conflicts between the plan and the actual implementation.

If there is a material conflict that changes the intended business behavior or architecture:
STOP and report BLOCKED.
Do not silently redesign the plan.

## Phase 2 — Implement

If the plan maps correctly:

1. Execute it step by step.
2. Prefer the smallest correct changes.
3. Follow existing repository conventions.
4. Do not expand scope.
5. Do not refactor unrelated code.

For a large plan, validate logical milestones incrementally rather than waiting until the end.

## Phase 3 — Validate

After a logical implementation unit:

1. Run the cheapest meaningful targeted validation.
2. Evaluate the result.
3. If it fails:
   - diagnose the failure,
   - identify the failure class,
   - update the hypothesis using evidence,
   - make the smallest corrective fix,
   - validate again.

Do not perform random trial-and-error fixes.

Maximum corrective attempts for the same failure class: 3.

If unresolved after the budget:
STOP and report BLOCKED.

## Phase 4 — Acceptance Verification

When technical validations pass:

1. Verify every acceptance criterion explicitly.
2. Verify the expected behavior, not only syntax/build success.
3. Check important edge cases listed in the plan.
4. Confirm that out-of-scope behavior was not changed.
5. Map each acceptance criterion to concrete validation evidence (AC-1 -> V-1, AC-2 -> V-2, ...).
   State the actual number/record/result that proves each criterion, not just "pass".

## Phase 5 — Final Review

Run and inspect:

- git status
- git diff

Review the final diff against:
- the implementation plan,
- frozen requirements,
- acceptance criteria,
- project rules.

Perform an adversarial self-review:
assume the implementation is still wrong and identify the most likely remaining defect.

If a credible defect exists:
fix and validate it before completion.

## Final Status

Return exactly one final state:

### DONE

Only if:
- implementation is complete,
- validation passes,
- acceptance criteria pass,
- final diff review passes,
- no unresolved issue remains.

Report:
- summary,
- completed plan steps (each step: PASS/FAIL),
- changed files,
- validations run and results (each: V-1 PASS/FAIL with evidence),
- acceptance criteria result (each: AC-1 PASS with concrete evidence),
- important implementation notes,
- any recommended follow-up.

Use this exact structure for the DONE report:

## Status
DONE

## Implementation
- Step 1: PASS
- Step 2: PASS

## Validation
- V1: PASS — evidence: ...
- V2: PASS — evidence: ...

## Acceptance Criteria
- AC1: PASS — evidence: ...
- AC2: PASS — evidence: ...

## Changed Files
- ...

## Final Diff Review
PASS

## Remaining Issues
None

### BLOCKED

Use when the task cannot safely or correctly continue.

Report:
- blocker,
- evidence,
- affected plan step,
- what was attempted,
- current repository state,
- what decision/information is required next.

Never report DONE with known failing validation.

## Frontend / UI Execution Enforcement

If any implementation step creates or changes frontend/UI/UX:

1. Treat it as a frontend task automatically.
2. Follow the Mandatory Frontend / UI Workflow from global AGENTS.md.
3. Load and apply the `frontend-design` skill.
4. Inspect the existing visual language before making meaningful UI changes.
5. If greenfield, apply the global default visual preference unless the plan specifies another direction.
6. Render the actual UI after implementation.
7. Validate desktop and mobile.
8. Fix meaningful visual issues before completion.
9. Include visual validation evidence in the final report.

Build, lint, or unit-test success alone is NOT sufficient to mark frontend work DONE.

### Frontend Vision Validation

When frontend visual validation reaches the screenshot-inspection step:

- keep the active coding model unchanged,
- if the active model cannot read images, delegate screenshot analysis to the configured vision model (qwen3.8-max via describe_image tool),
- receive the structured visual review as text,
- let the primary coding model evaluate those findings against the implementation plan and project rules,
- fix only valid issues,
- re-render only after meaningful changes,
- run final visual review before frontend DONE.

Do not switch the whole execution session to the vision model merely to inspect screenshots.

### Frontend Vision Budget

For frontend visual validation:

- default to FUNCTIONAL_QUALITY mode,
- maximum 2 vision-review calls,
- only perform a second visual review when the first review found valid CRITICAL or MAJOR issues and meaningful fixes were applied,
- MINOR issues must not trigger another vision review,
- if only MINOR issues remain after correction, continue toward DONE,
- do not perform endless aesthetic refinement.

User-requested pixel-perfect/polish work may use a higher explicit visual-review budget.

### Trading / ML Scope-Aware Decision Gate

When executing a trading/ML plan:

0. Scope Bootstrap (automatic, no user prompt needed):
   - if `ai/experiments/EXPERIMENT_SCOPE.md` exists → read it,
   - if missing → auto-draft it from the frozen implementation plan
     (extract frozen stack / dimensions / deferred items), save as
     `DRAFTED_FROM_PLAN`, and continue the task — do not stop to ask.
   - The scope is created by the executor, never by the quant reviewer.
1. Complete the existing milestone/checklist.
2. Read the current `ai/experiments/EXPERIMENT_SCOPE.md`.
3. Verify that generated experiments stayed within scope.
4. Build/update the analysis packet with a scope snapshot.
5. Invoke the Qwen 3.8 Max Quant Analyst review (delegated, structured text result).
6. Execute only recommendations classified as IN_SCOPE_TUNING.
7. Persist OUT_OF_SCOPE/FUTURE ideas without executing them (FUTURE_IMPROVEMENTS.md).
8. A scope expansion requires explicit user approval or a new/frozen implementation plan.

After the Qwen quant review returns:
- continue to execution immediately (do not stop at the review):
  1. persist FUTURE_IMPROVEMENTS,
  2. record decision.md,
  3. translate EXECUTABLE_NEXT_ACTIONS into experiment configs and run them via the project runner (max 3),
  4. report results briefly,
  5. do not start another review until the next checkpoint.
