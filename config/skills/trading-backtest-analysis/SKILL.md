---
name: trading-backtest-analysis
description: >
  Analyze AI/ML trading backtests, experiment sweeps, walk-forward
  validation, calibration, market-regime performance, overfitting risk,
  transaction-cost sensitivity, parameter stability, and model promotion
  decisions. Always respect the active experiment scope and distinguish
  current tuning actions from future out-of-scope improvements.
---

# Trading Backtest Analysis Skill

Use this skill when:
- reviewing AI/ML trading backtests or experiment results,
- deciding parameter tuning next steps,
- evaluating walk-forward / OOS / calibration results,
- assessing overfitting or regime instability,
- deciding model promotion / rejection,
- responding to a quant-review request.

## Roles

- Primary executor: DeepSeek V4 Flash (coding, training, backtesting, validation).
- Quant reviewer: **delegated via the `quant_review` tool** — a real model call
  through LiteLLM (default `cmd-deepseek-v4-pro`, fallback `cmd-deepseek-v4-flash`,
  configurable via `~/.pi/agent/quant-tool.json`), NOT role-play by the executor.
  Prefer `cmd-*` (Command Code) over `go-*` (OpenCode Go quota running out).
- The reviewer interprets evidence; it does not invent missing measurements.
- The executor must call the `quant_review` tool (with analysis packet + scope path)
  instead of pretending to be the reviewer. The tool returns the verdict with a
  `[quant_review by <provider>/<model>]` header identifying which model produced it.
- If the `quant_review` tool is unavailable, return QUANT_REVIEW_BLOCKED:
  TOOL_UNAVAILABLE rather than fabricating a verdict.

## Scope Discipline

Before reviewing:

1. Read the active `EXPERIMENT_SCOPE.md` if it exists.
2. Identify:
   - active features,
   - tunable parameters,
   - allowed ranges,
   - fixed parameters,
   - out-of-scope items,
   - deferred ideas,
   - current phase,
   - promotion criteria.
3. Treat this scope as a hard boundary for `NEXT_EXPERIMENTS`.

Do not recommend an out-of-scope feature or parameter as an immediate tuning action.

Out-of-scope ideas must be placed under `FUTURE_IMPROVEMENTS`.

## Scope Bootstrap (Otomatis — oleh Executor, BUKAN Reviewer)

The experiment scope is auto-created by the primary executor (DeepSeek V4 Flash) — never by the quant reviewer (Qwen).

The reviewer may not write its own judging rules (conflict of interest); it may only VALIDATE.

### Auto-Bootstrap Flow (executor, at the start of any trading/ML task)

1. If `ai/experiments/EXPERIMENT_SCOPE.md` exists → read it, proceed. Done.
2. If missing → automatically draft it from the frozen implementation plan:
   - extract the frozen V1 stack / market scope / dimensions / deferred items
     (e.g. from `AI_Trading_V1_M1-M4_Technical_Implementation_Plan.md`),
   - write it to `ai/experiments/EXPERIMENT_SCOPE.md`,
   - mark status header: `DRAFTED_FROM_PLAN` + source file + date,
   - do NOT block execution of non-scope-sensitive work,
   - proceed with the task.
3. Scope-sensitive tuning (parameter changes) may proceed only when scope is:
   - `FROZEN` (explicitly approved), or
   - drafted from a frozen plan and the proposed tuning stays inside its bounds
     (plan authority is #2 after user instruction, per Scope Authority Priority).
4. Any proposed change BEYOND the plan bounds still requires explicit user approval
   (record in decision.md as REQUIRES_SCOPE_CHANGE: YES).

### Reviewer Role (Qwen) — Validate, Never Author

The quant reviewer:
- verifies the scope file exists and is consistent with the frozen plan,
- reports `SCOPE_STATUS: VALID` or `SCOPE_STATUS: CONFLICT_FOUND` with evidence,
- does not rewrite or create the scope file,
- if scope is missing, returns `QUANT_REVIEW_BLOCKED: EXPERIMENT_SCOPE_MISSING`
  and instructs the executor to run Scope Bootstrap instead of blocking the whole flow.

## Scope Authority Priority

1. User explicit current instruction
2. Frozen project/milestone plan
3. EXPERIMENT_SCOPE.md
4. Project AGENTS.md
5. Global AGENTS.md
6. Quant Analyst recommendation

If a review recommendation conflicts with scope:
- scope wins.

## Quant Analyst Allowed Actions

May:
- compare current candidates,
- rank current parameter choices,
- identify overfitting,
- identify regime instability,
- recommend changing currently tunable parameters,
- recommend stopping a parameter search,
- recommend collecting missing evidence,
- recommend future improvements separately.

May NOT:
- silently add new features,
- silently change label horizon,
- silently switch model family,
- silently add ensemble,
- silently introduce new data source,
- silently widen tuning space,
- change fixed parameters unless scope explicitly allows it.

## Scope Change Policy

Any recommendation outside current scope must be classified:

```
FUTURE_IMPROVEMENT
REQUIRES_SCOPE_CHANGE: YES
```

DeepSeek must NOT execute it automatically.

It may only be executed after:
- user approval,
- or a new implementation plan,
- or explicit scope revision.

## Deterministic Metrics First

Before any quant review, compute objective metrics with code/Python:

```
Sharpe
Sortino
max drawdown
return
profit factor
expectancy
hit rate
turnover
fee sensitivity
slippage sensitivity
walk-forward
regime breakdown
calibration
sample count
parameter sensitivity
train → validation → test degradation
```

Qwen interprets; it does not invent missing measurements.

## Anti-Overfitting Review

Check when available:
- train vs validation degradation,
- validation vs test degradation,
- walk-forward consistency,
- market-regime concentration,
- sample size,
- multiple-testing exposure,
- parameter neighborhood stability,
- fees/slippage sensitivity,
- turnover,
- drawdown,
- tail risk,
- calibration,
- baseline superiority.

For crypto regimes when available:
- bull, bear, sideways,
- high volatility, low volatility.

## Review Budget

Default: 1 Qwen review per decision checkpoint.
Maximum: 2 (only if critical evidence was missing and then supplied, or first review reports LOW confidence due to missing data).
No open-ended review loop.

## Structured Output

Return:

```
VERDICT:
PROMOTE | RETUNE | REJECT | NEED_MORE_EVIDENCE

CONFIDENCE:
HIGH | MEDIUM | LOW

SCOPE_STATUS:
VALID | CONFLICT_FOUND

CURRENT_SCOPE_SUMMARY:
...

KEY_FINDINGS:
1. ...
2. ...
3. ...

OVERFITTING_RISK:
LOW | MEDIUM | HIGH

OOS_ROBUSTNESS:
PASS | WEAK | FAIL

REGIME_STABILITY:
PASS | WEAK | FAIL

PARAMETER_STABILITY:
PASS | WEAK | FAIL

CALIBRATION:
PASS | WEAK | NOT_AVAILABLE

COST_ROBUSTNESS:
PASS | WEAK | FAIL | NOT_AVAILABLE

MAIN_FAILURE_MODE:
...

MISSING_EVIDENCE:
- ...

IN_SCOPE_TUNING_RECOMMENDATIONS:
1.
   Parameter:
   Current:
   Proposed:
   Hypothesis:
   Keep Fixed:
   Expected Evidence:
   Success Criterion:
   Failure Criterion:

EXECUTABLE_NEXT_ACTIONS:
1.
   experiment_id:
   config_overrides:
     - key: value   (machine-readable; follow the project's experiment config schema)
   purpose:
   success_criterion:
   failure_criterion:

OUT_OF_SCOPE_OBSERVATIONS:
- ...

FUTURE_IMPROVEMENTS:
1.
   Idea:
   Why It May Help:
   Evidence Needed:
   REQUIRES_SCOPE_CHANGE: YES

DO_NOT_TUNE:
- ...

STOP_CONDITIONS:
- ...

FINAL_RECOMMENDATION:
...
```

## Max In-Scope Experiments

Default: MAX_NEXT_EXPERIMENTS = 3, only from currently tunable features/parameters.

Prefer:
- one hypothesis,
- one controlled change,
- one measurable result.

Do not recommend new feature + new model + new label + new window all at once.

## Failure Handling

- Scope file missing → return `QUANT_REVIEW_BLOCKED: EXPERIMENT_SCOPE_MISSING`, or draft scope from the frozen plan and require confirmation.
- Analysis packet incomplete → `NEED_MORE_EVIDENCE`.
- Out-of-scope tuning suggested as immediate → reclassify to FUTURE_IMPROVEMENT, do not execute.
- Scope conflict → record `RECOMMENDATION_REJECTED: OUT_OF_SCOPE`.

## Persistence

- In-scope actions → record in `ai/experiments/<id>/decision.md`.
- Out-of-scope ideas → persist in `ai/experiments/FUTURE_IMPROVEMENTS.md`.
- Learnings → `ai/experiments/LEARNINGS.md`.

## Execution Contract (Review → Execute)

After the quant review returns a structured verdict, DeepSeek MUST continue to execution immediately — do NOT stop at the review and wait for another user instruction.

Flow:

```
Quant review verdict received
  ↓
1. Persist FUTURE_IMPROVEMENTS (out-of-scope ideas) — do not execute
2. Persist decision.md (verdict + selected in-scope actions)
3. For each IN_SCOPE_TUNING_RECOMMENDATION (max 3):
   - translate the recommendation into an executable experiment config
   - use the project's experiment runner/config conventions
     (e.g. experiments/runner.py run <config.json>)
   - run it
4. Collect results and report briefly
5. Do NOT start a new quant review until the next decision checkpoint
   (checklist-complete), even if results are now available
```

Rules:

- Execute only recommendations from `IN_SCOPE_TUNING_RECOMMENDATIONS`.
- Never execute `FUTURE_IMPROVEMENTS` or anything marked `REQUIRES_SCOPE_CHANGE: YES`.
- If no in-scope recommendation is actionable (missing config fields, ambiguous parameter), report what is blocking execution instead of guessing.
- The execution batch is limited to MAX_NEXT_EXPERIMENTS = 3.
- After executing, update `decision.md` with actual results/outcome.
- Do not loop: one review → one execution batch → stop until next checkpoint.

If the project has no experiment runner (no way to execute a config), persist the recommendations as next actions without executing, and state that execution is blocked by missing tooling.
