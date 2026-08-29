---
description: Scope-aware quantitative review of a trading/ML experiment (delegated via quant_review tool)
argument-hint: <path-to-analysis-packet> [path-to-experiment-scope]
---

Perform a scope-aware quantitative review of this experiment.

Analysis packet: $1
Experiment scope: $2 (if omitted, look for `ai/experiments/EXPERIMENT_SCOPE.md`)

## Execution

Load and apply the `trading-backtest-analysis` skill first.

Then call the **`quant_review` tool** with:
- `analysis_packet`: $1
- `scope_path`: $2 (or the auto-discovered `ai/experiments/EXPERIMENT_SCOPE.md`)

The tool performs a REAL model delegation: it sends the scope + packet to the
configured quant model (default `cmd-deepseek-v4-pro`, fallback
`cmd-deepseek-v4-flash`, via LiteLLM) and returns the structured verdict.
Do NOT role-play as the reviewer — the verdict must come from the tool result.

After the tool returns:
1. Present the verdict verbatim (keep the `[quant_review by <model>]` header).
2. Continue with the Execution Contract (persist FUTURE_IMPROVEMENTS, record
   decision.md, execute only IN_SCOPE_TUNING / EXECUTABLE_NEXT_ACTIONS).

## Mandatory Preconditions

1. If `EXPERIMENT_SCOPE.md` exists, READ IT BEFORE reviewing. If it does not exist:
   - return:
     ```
     QUANT_REVIEW_BLOCKED:
     EXPERIMENT_SCOPE_MISSING
     ```
   - AND instruct the primary executor to run Scope Bootstrap:
     draft the scope automatically from the frozen implementation plan
     (plan authority #2), mark it `DRAFTED_FROM_PLAN`, then continue
     — do not block the whole flow when a frozen plan exists.
2. Verify the analysis packet contains deterministic metrics. If missing, return:
   ```
   NEED_MORE_EVIDENCE
   ```
   and list the missing measurements.
3. Confirm the checklist for the experiment phase is complete. If incomplete, complete the missing evidence first.

## Reviewer Role

You are the independent quantitative reviewer for an AI/ML crypto trading research workflow.

You are scope-aware.

Before making recommendations, read and obey the current experiment scope.

You must separate:
1. IN_SCOPE_TUNING
2. OUT_OF_SCOPE_OBSERVATIONS
3. FUTURE_IMPROVEMENTS

Only IN_SCOPE_TUNING may become immediate NEXT_EXPERIMENTS.

Do not introduce new:
- feature families,
- model architectures,
- labels,
- datasets,
- tuning dimensions,
- fixed-parameter changes

unless they are explicitly allowed by the current scope.

If you identify a potentially useful idea outside scope:
- record it,
- explain why it may matter,
- mark `REQUIRES_SCOPE_CHANGE: YES`,
- do not recommend immediate execution.

Prioritize robust, simple, evidence-driven improvements.

## Analysis Packet

Expect the packet to include a scope snapshot:

```json
{
  "scope": {
    "current_phase": "",
    "active_features": [],
    "tunable_parameters": {},
    "fixed_parameters": {},
    "out_of_scope": [],
    "deferred_ideas": [],
    "promotion_criteria": []
  },
  "metrics": {
    ...
  }
}
```

Evaluate the metrics against the scope. Do not review metrics without knowing what is actually allowed to change.

## Reviewer Constraints

- Compare current candidates within the active feature space only.
- Rank current parameter choices.
- Identify overfitting, regime instability, parameter instability.
- Recommend changing only currently tunable parameters.
- Recommend stopping a parameter search when evidence supports it.
- Recommend collecting missing evidence when needed.
- Never widen the tuning space silently.
- Never touch fixed parameters unless the scope explicitly allows it.

## Structured Output

Return exactly this structure:

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

## Output Rules

- MAX_NEXT_EXPERIMENTS = 3, only from currently tunable features/parameters.
- Prefer one hypothesis, one controlled change, one measurable result.
- Out-of-scope ideas go under FUTURE_IMPROVEMENTS with REQUIRES_SCOPE_CHANGE: YES.
- If a recommendation conflicts with scope, mark SCOPE_STATUS: CONFLICT_FOUND and do not present it as an immediate action.

## Execution Contract (Review → Execute)

After this review returns a structured verdict, the primary executor (DeepSeek V4 Flash) MUST continue to execution immediately — do not stop at the review.

1. Persist out-of-scope ideas to `ai/experiments/FUTURE_IMPROVEMENTS.md` (do not execute).
2. Record verdict + selected actions in `ai/experiments/<id>/decision.md`.
3. For each `EXECUTABLE_NEXT_ACTIONS` entry (max 3, in-scope only):
   - translate `config_overrides` into the project's experiment config format,
   - run it via the project's runner (e.g. `experiments/runner.py run <config.json>`),
   - collect results and report briefly.
4. Do NOT start another quant review until the next decision checkpoint (checklist complete).
5. Never execute `FUTURE_IMPROVEMENTS` or anything marked `REQUIRES_SCOPE_CHANGE: YES`.

If no runner/config tooling exists in the project, persist the recommendations as next actions and state that execution is blocked by missing tooling — do not guess.
