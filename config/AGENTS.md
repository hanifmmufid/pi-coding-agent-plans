# Global Engineering Execution Rules

## Core Behavior

- Inspect the existing implementation before editing.
- Understand the relevant code path before making changes.
- For bugs, identify a root-cause hypothesis and supporting evidence before editing.
- For implementation plans, verify that the plan maps correctly to the actual repository before execution.
- Prefer the smallest correct change.
- Follow existing project architecture, conventions, naming, and patterns.
- Do not refactor unrelated code.
- Do not expand scope unless required to satisfy the requested behavior.
- Never silently change frozen requirements.

## Investigation

Before editing a bug:
1. Locate the relevant code.
2. Trace the actual execution/data flow.
3. Form a root-cause hypothesis.
4. Collect evidence that supports or disproves it.
5. If confidence is low, investigate further before editing.

Do not use code edits as a substitute for diagnosis.

## Implementation

- Make the smallest change that satisfies the requirement.
- Preserve backward compatibility unless the task explicitly requires otherwise.
- Reuse existing abstractions before creating new ones.
- Avoid speculative cleanup.
- Avoid unrelated formatting changes.
- Do not modify files outside the task scope without a concrete reason.

## Validation Loop

After implementation:
1. Run the most targeted relevant validation first.
2. If validation passes, continue to acceptance verification.
3. If validation fails, diagnose the failure before making another edit.
4. State or internally establish a new hypothesis based on the failure evidence.
5. Make the smallest corrective change.
6. Re-run only the relevant validation first.
7. Do not repeat the same failed approach without new evidence.

Maximum corrective attempts for the same failure class: 3.

Classify failures before choosing the next action:
- IMPLEMENTATION_ERROR: the change was incomplete or incorrect — fix the implementation.
- ROOT_CAUSE_WRONG: the original hypothesis is contradicted by evidence — re-investigate before editing.
- PLAN_CONFLICT: the plan conflicts with the actual codebase — stop and report BLOCKED.
- ENVIRONMENT_ERROR: dependency/service/DB issue — report the environment blocker.
- VALIDATION_ERROR: the validation itself is wrong or too weak — fix the validation, not the code.
- DEPENDENCY_ERROR: missing/unexpected dependency — resolve or report.
- DATA_ERROR: input data contradicts assumptions — report evidence.

Use the classification to pick the smallest next action instead of repeating the same edit.

If the same failure class remains unresolved after 3 evidence-driven corrective attempts:
- stop,
- mark the task BLOCKED,
- report evidence,
- report attempted fixes,
- report the suspected blocker.

## Completion Gate

A task is DONE only when all applicable conditions are true:

- requested behavior is implemented,
- targeted validation passes,
- acceptance criteria pass,
- final git diff has been reviewed,
- no unresolved errors remain,
- no unintended or unrelated changes remain,
- no known requirement is left incomplete.

Never declare DONE only because code was written.

## Final Review

Before declaring DONE:

1. Review `git diff`.
2. Re-read the request or implementation plan.
3. Verify each acceptance criterion.
4. Check for scope creep.
5. Check likely edge cases.
6. Check for accidental behavior changes.
7. Check that temporary/debug code was removed.
8. Check that validation evidence supports the final conclusion.

Perform an adversarial self-review:
"Assume this implementation may still be wrong. What is the most likely remaining defect?"

If a credible issue is found, resolve or report it before DONE.

## Escalation

Stop and report instead of guessing when:

- the requested behavior is materially ambiguous,
- the implementation plan conflicts with the actual codebase,
- required information is missing,
- a dependency/environment prevents meaningful validation,
- solving the issue requires changing a frozen business rule,
- repeated failure indicates that the current root-cause hypothesis is wrong.

## Testing

- Prefer targeted validation.
- Run the cheapest meaningful validation first.
- Escalate validation depth as needed.
- Do not run a full regression suite unless explicitly requested or clearly necessary for a high-risk change.

## Git

- Inspect `git status` before major work.
- Review `git diff` before completion.
- Do not force push.
- Do not rewrite shared history.
- Do not reset or delete unrelated user changes.

## Mandatory Frontend / UI Workflow

Any task that creates, modifies, fixes, redesigns, or extends frontend/UI/UX must follow this workflow automatically.

Frontend/UI tasks include, but are not limited to:
- application pages
- dashboards
- forms
- tables
- cards
- navigation
- sidebars
- responsive layouts
- landing pages
- website pages
- frontend components
- Odoo custom frontend/UI
- visual bug fixes
- layout changes
- spacing changes
- typography changes
- color/theme changes
- styling changes
- responsive fixes

Do not wait for the user to explicitly request frontend-design workflow.

For meaningful frontend/UI work, you MUST read and apply the `frontend-design` skill before implementation.

### Global Default Visual Preference

When the project does NOT already have a clear established design language, use these defaults:

- Light theme by default.
- Prefer left sidebar navigation for application/dashboard interfaces.
- Modern.
- Minimal.
- Elegant.
- Professional.
- Clean.
- Restrained.
- Production-grade.

Do not produce:
- wireframe-like UI,
- placeholder-looking UI,
- generic AI dashboard aesthetics.

### Existing Product Rule

If the project already has an established design language:

1. Inspect existing screens/components before designing.
2. Treat the existing product as the primary visual reference.
3. Reuse its:
   - typography,
   - spacing,
   - colors,
   - components,
   - navigation,
   - form patterns,
   - table patterns,
   - interaction conventions.
4. New UI must look native to the same product.
5. Do not force the global light/sidebar preference if it would conflict with an intentional established product design.

### Greenfield Application Rule

For a new application/dashboard with no established visual system:

Default to:
- light theme,
- left sidebar primary navigation,
- very light neutral page background,
- white primary surfaces,
- subtle borders,
- restrained shadows,
- dark neutral primary text,
- muted secondary text,
- restrained accent color.

Before building many screens:
1. define visual direction,
2. define typography,
3. define spacing scale,
4. define color roles,
5. define content density,
6. define component language,
7. define responsive behavior,
8. create or update `docs/DESIGN_SYSTEM.md`.

### Design Quality Rules

Prefer quality through:
- typography hierarchy,
- spacing,
- alignment,
- proportion,
- content density,
- restrained color,
- clear interaction states.

Avoid by default:
- excessive gradients,
- decorative blobs,
- excessive rounded cards,
- card-inside-card layouts,
- excessive shadows,
- oversized hero typography,
- random visual effects,
- excessive empty space,
- weak visual hierarchy,
- flat white-on-white grouping.

### Application Navigation Preference

For application/dashboard interfaces with no established navigation pattern:

- Prefer a left sidebar as primary navigation.
- Keep the sidebar compact and scannable.
- Active state must be obvious.
- Hover state should be subtle.
- Main content should remain spacious and readable.
- On mobile, sidebar should become drawer/off-canvas or equivalent compact navigation.

Do not use marketing-style top navigation as the primary pattern for operational dashboards unless the product already uses it or the requirement explicitly asks for it.

### Odoo / Operational UI Principle

For ERP/admin/operational screens:
- preserve information density,
- prioritize usability over decoration,
- avoid turning operational UI into marketing-style layouts,
- keep tables/forms/filters/actions easy to scan.

### Mandatory Visual Validation

Frontend work is NOT DONE when code merely builds successfully.

Before declaring DONE:

1. Render/run the actual page.
2. Perform visual inspection.
3. Validate desktop layout.
4. Validate mobile layout.
5. Check:
   - typography hierarchy,
   - spacing,
   - alignment,
   - visual balance,
   - content density,
   - responsive behavior,
   - design consistency,
   - interaction clarity,
   - overflow/layout defects.
6. Fix meaningful visual weaknesses.
7. Re-render after meaningful fixes.
8. Perform final visual inspection.

If browser/screenshot tooling is available, actual rendered screenshots MUST be used.

Minimum:
- desktop around 1440px width,
- mobile around 390px width.

Do not take repeated screenshots when no meaningful visual change occurred.

Never declare a frontend task DONE without visual validation.

### Vision Delegation for Frontend Validation

When frontend/UI visual validation requires inspecting a screenshot:

1. Render the actual page using the existing browser/screenshot workflow.
2. If the active primary model supports image input, inspect the screenshot normally.
3. If the active primary model does NOT support image input:
   - delegate the screenshot to the configured vision-capable model (cmd-qwen3.8-max via describe_image tool, configured in ~/.pi/agent/vision-tool.json),
   - use the vision tool/handoff mechanism,
   - request a structured visual review.
4. Treat the vision model as a visual reviewer only.
5. The primary coding model remains responsible for deciding and implementing code changes.
6. Apply visual feedback only when it is consistent with:
   - the user's requirement,
   - frozen implementation plan,
   - project AGENTS.md,
   - existing design system,
   - existing product visual language.
7. Do not let the vision reviewer silently redefine project requirements.
8. After meaningful frontend fixes, re-render and re-check only when necessary.
9. Final frontend DONE status requires visual validation evidence.

The vision review result must be converted into actionable text for the primary coding model.

### Visual Validation Budget & Anti-Loop Rule

Visual validation is a quality gate, not an endless polishing loop.

Default mode:

FUNCTIONAL_QUALITY

In FUNCTIONAL_QUALITY mode:

- prioritize usability,
- prioritize clarity,
- prioritize responsive correctness,
- prioritize major design consistency,
- prioritize production readiness,
- do not optimize minor cosmetic differences indefinitely.

Default vision review budget:

- maximum 2 vision-model calls per frontend task.

Vision Review #2 is allowed only when Vision Review #1 identifies at least one valid CRITICAL or MAJOR issue that requires a meaningful correction.

If Vision Review #1 returns:
- PASS, or
- only MINOR issues,

do not run another visual review.

If Vision Review #2 leaves only MINOR issues:

- consider visual validation PASS,
- do not continue the loop,
- optionally mention minor issues in the final report.

MINOR issues must never trigger another vision-review cycle in default mode.

Only exceed the default vision budget when the user explicitly requests:
- pixel-perfect output,
- exact visual matching,
- intensive visual polish,
- close reproduction of a reference.

When vision budget is exhausted:
- stop visual iteration,
- report remaining material issues if any,
- do not silently continue calling the vision model.

## Codebase Knowledge & Awareness Workflow

When working in a large or unfamiliar repository:

- prefer progressive codebase reconnaissance over reading the entire repository,
- use the available Fovea/repository-awareness tools for lightweight orientation,
- prefer small contextual maps over reading the entire repository,
- consult only relevant `docs/codebase/` documents,
- verify important assumptions against current source code,
- treat Fovea output and generated documentation as navigation aids, not authoritative truth,
- update affected documentation after architecture-significant changes.

Do not load all `docs/codebase/*` files unless the task genuinely requires them.

When a task involves studying a new/mature repository, use the `codebase-study` skill and the `/study-codebase` workflow. After architecture-significant changes, use `/refresh-codebase-docs` to update only the affected documents.

Source code remains the final source of truth.

## Trading / ML Quantitative Review

For AI/ML trading projects:

- DeepSeek V4 Flash remains the primary executor.
- The quant reviewer is **delegated via the `quant_review` tool** (a real model
  call through LiteLLM, NOT role-play by the executor). Configure via
  `~/.pi/agent/quant-tool.json` (`/quant config model ...`). Default model is
  `cmd-deepseek-v4-pro` (Command Code provider — stable for full analysis
  packets, ~50s), with `cmd-deepseek-v4-flash` as fallback. Prefer `cmd-*`
  models (Command Code provider) over `go-*` (OpenCode Go subscription is
  running out). `cmd-qwen3.8-max` exists but is flaky on large packets.
- Vision model: **delegated via the `describe_image` tool** (configured in
  `~/.pi/agent/vision-tool.json`). Default is `cmd-qwen3.8-max` (Qwen 3.8 Max
  via Command Code provider — supports text+image, ~11s on images). Prefer
  `cmd-*` over `go-*`/`pi-*` (OpenCode Go / Console Go quota running out).
- The experiment scope (`ai/experiments/EXPERIMENT_SCOPE.md`) is auto-created by
  the executor (Scope Bootstrap) from the frozen implementation plan at the start
  of a trading/ML task — never wait for the user to request it, and never let the
  reviewer (Qwen) author it (conflict of interest). The reviewer may only validate it.
  Auto-created scope files are marked `DRAFTED_FROM_PLAN` (with source file + date)
  in the status header; the user may review/correct them at any time.
- Before any quant review, read the current experiment scope (`ai/experiments/EXPERIMENT_SCOPE.md`).
- Treat active features, tunable parameters, fixed parameters, allowed ranges, and out-of-scope items as hard review constraints.
- Immediate tuning recommendations must stay inside the current scope.
- Ideas outside scope must be listed separately as future improvements and must not be executed automatically.
- After a meaningful milestone/backtest checklist completes, run the scope-aware Quant Analyst review before the next modeling/tuning decision.
- Compute deterministic metrics before LLM interpretation.
- Send a compact analysis packet, not full logs.
- Do not invoke Qwen after every trial.
