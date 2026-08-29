# Improvement Implementation Plan — Scope-Aware Quant Analyst Skill with Qwen 3.8 Max

**Version:** 2.0  
**Scope:** Global Pi trading/ML workflow  
**Primary Executor:** DeepSeek V4 Flash  
**Quant Reviewer:** Qwen 3.8 Max  
**Goal:** Menambahkan Quant Analyst yang kuat tetapi disiplin terhadap scope eksperimen aktif, sehingga reviewer hanya memberi tuning recommendation pada fitur/parameter yang memang sedang digunakan, sementara ide di luar scope dipisahkan sebagai future improvement dan tidak dieksekusi otomatis.

---

# 1. Objective

Upgrade global Pi trading/ML workflow menjadi:

```text
DeepSeek V4 Flash
→ implement / train / backtest / validate
→ complete current checklist / gate
→ read current experiment scope
→ build compact analysis packet
→ Qwen 3.8 Max Quant Analyst review
→ separate:
   - in-scope tuning
   - out-of-scope observations
   - future improvement ideas
→ DeepSeek executes only valid in-scope next actions
```

Tujuan utama:

1. Qwen 3.8 Max memahami **apa yang sedang dituning saat ini**.
2. Qwen 3.8 Max memahami **apa yang sengaja fixed**.
3. Qwen 3.8 Max memahami **fitur apa yang aktif**.
4. Qwen 3.8 Max memahami **fitur/parameter apa yang belum dipakai**.
5. Reviewer tidak boleh mengubah scope secara diam-diam.
6. Ide tambahan tetap boleh diberikan, tetapi harus masuk `FUTURE_IMPROVEMENT`, bukan `NEXT_EXPERIMENT`.
7. DeepSeek hanya mengeksekusi recommendation yang sesuai scope aktif.
8. Existing Pi flow tetap utuh.

---

# 2. Core Principle

Quant Analyst harus selalu membedakan:

```text
IN-SCOPE TUNING
vs
OUT-OF-SCOPE IMPROVEMENT
```

Hard rule:

> **Current experiment scope is a hard execution boundary.**

Reviewer boleh melihat peluang di luar scope, tetapi tidak boleh memasukkannya sebagai tuning action aktif.

---

# 3. Existing Pi Flow Must Remain Intact

Jangan mengganti:

- global `AGENTS.md`,
- project `AGENTS.md`,
- `/execute`,
- `/fix`,
- `/review`,
- `codebase-study`,
- Fovea/repo-awareness,
- frontend-design,
- vision reviewer,
- vision anti-loop budget,
- permission gate,
- protected paths,
- failure budget,
- milestone/checklist flow existing.

Quant Analyst hanya menjadi:

> **specialized review layer setelah evidence/checklist experiment selesai.**

---

# 4. Target Architecture

```text
                    Pi
                     │
            DeepSeek V4 Flash
             Primary Executor
                     │
              Current Scope
                     │
       EXPERIMENT_SCOPE.md / JSON
                     │
        ┌────────────┴────────────┐
        │                         │
     Coding                    Training
     Fixing                    Backtest
     Pipeline                  Evaluation
        │                         │
        └────────────┬────────────┘
                     │
             Checklist Complete
                     │
                     ▼
           Deterministic Metrics
                     │
           Analysis Packet Builder
                     │
                     ▼
               Qwen 3.8 Max
               Quant Analyst
                     │
          Scope-Aware Review
                     │
        ┌────────────┴─────────────┐
        │                          │
IN-SCOPE TUNING           FUTURE IMPROVEMENTS
        │                          │
        ▼                          ▼
DeepSeek may execute       Persist only / review later
```

---

# 5. Scope Model

Create a persistent scope artifact per active experiment phase.

Recommended:

```text
ai/experiments/EXPERIMENT_SCOPE.md
```

Alternative machine-readable companion:

```text
ai/experiments/experiment_scope.json
```

V1 can use Markdown first.

---

# 6. Required `EXPERIMENT_SCOPE.md`

Recommended structure:

```md
# Experiment Scope

## Current Objective
Improve robustness of the current simple trading model.

## Current Phase
Initial tuning / focused tuning / walk-forward / promotion gate / etc.

## Active Features
- volatility
- trend
- volume

## Tunable Parameters
- volatility_window: [60, 80, 120]
- trend_window: [20, 40, 60]

## Tunable Rules
- change one major factor at a time unless explicitly allowed
- keep model family fixed
- preserve label definition

## Fixed Parameters
- model_type: XGBoost
- label_horizon: 15m
- confidence_threshold: 0.70

## Explicitly Out of Scope
- new feature families
- order-book imbalance
- funding-rate features
- new model architectures
- ensemble models
- alternative labels

## Deferred Ideas
- order-book imbalance
- funding rate
- transformer-based model

## Current Philosophy
Stay simple first.
Validate the current feature/model set before adding complexity.

## Promotion Criteria
- ...
```

---

# 7. Scope Authority Rules

Priority order:

```text
1. User explicit current instruction
2. Frozen project/milestone plan
3. EXPERIMENT_SCOPE.md
4. Project AGENTS.md
5. Global AGENTS.md
6. Quant Analyst recommendation
```

If Qwen recommendation conflicts with scope:

```text
scope wins
```

---

# 8. Quant Analyst Allowed Actions

Qwen may:

- compare current candidates,
- rank current parameter choices,
- identify overfitting,
- identify regime instability,
- recommend changing currently tunable parameters,
- recommend stopping a parameter search,
- recommend collecting missing evidence,
- recommend future improvements separately.

Qwen may NOT:

- silently add new features,
- silently change label horizon,
- silently switch model family,
- silently add ensemble,
- silently introduce new data source,
- silently widen tuning space,
- change fixed parameters unless scope explicitly allows it.

---

# 9. Scope Change Policy

Any recommendation outside current scope must be classified as:

```text
FUTURE_IMPROVEMENT
```

and marked:

```text
REQUIRES_SCOPE_CHANGE: YES
```

DeepSeek must NOT execute it automatically.

It may only be executed after:

```text
user approval
OR
new implementation plan
OR
explicit scope revision
```

---

# 10. Step 1 — Update Global Quant Analyst Skill

File:

```text
~/.pi/agent/skills/trading-backtest-analysis/SKILL.md
```

Use frontmatter:

```yaml
---
name: trading-backtest-analysis
description: >
  Analyze AI/ML trading backtests, experiment sweeps, walk-forward
  validation, calibration, market-regime performance, overfitting risk,
  transaction-cost sensitivity, parameter stability, and model promotion
  decisions. Always respect the active experiment scope and distinguish
  current tuning actions from future out-of-scope improvements.
---
```

Add core rules:

```md
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
```

---

# 11. Step 2 — Create / Update Qwen 3.8 Max Quant Analyst Role

Conceptual role:

```text
name: quant-analyst
model: Qwen 3.8 Max
role: read-only quantitative reviewer
thinking: high / strongest reasonable mode available
```

Prompt:

```md
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
```

---

# 12. Step 3 — Analysis Packet Must Include Scope Snapshot

Update:

```text
ai/experiments/<experiment-id>/analysis_packet.json
```

Add:

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
  }
}
```

This ensures Qwen does not review metrics without knowing what is actually allowed.

---

# 13. Step 4 — Deterministic Metrics First

Before Qwen review, compute objective metrics using code/Python.

Examples:

```text
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

---

# 14. Step 5 — Mandatory Checklist → Scope-Aware Quant Review Gate

Workflow:

```text
Experiment work
↓
Technical checklist
↓
Functional checklist
↓
Backtest/evaluation checklist
↓
Scope consistency check
↓
ALL REQUIRED ITEMS COMPLETE?
        │
       YES
        ↓
Generate/update analysis packet
        ↓
Attach current scope snapshot
        ↓
Qwen 3.8 Max Quant Review
        ↓
Structured scope-aware verdict
        ↓
DeepSeek executes only in-scope action
```

If checklist incomplete:

```text
complete missing evidence first
```

---

# 15. Step 6 — Structured Reviewer Output

Qwen must return:

```text
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

---

# 16. Step 7 — Max In-Scope Experiments

Default:

```text
MAX_NEXT_EXPERIMENTS = 3
```

Only from:

```text
currently tunable features/parameters
```

Qwen must not recommend:

```text
new feature + new model + new label + new window
```

all at once.

Prefer:

```text
one hypothesis
one controlled change
one measurable result
```

---

# 17. Step 8 — Fixed Parameter Guard

Any parameter marked fixed must be treated as immutable for the current phase.

Example:

```text
model_type = fixed
label_horizon = fixed
confidence_threshold = fixed
```

If Qwen believes a fixed parameter is likely problematic:

```text
OUT_OF_SCOPE_OBSERVATION
+
FUTURE_IMPROVEMENT
+
REQUIRES_SCOPE_CHANGE: YES
```

Not immediate tuning.

---

# 18. Step 9 — Feature Guard

Only active features may be tuned/evaluated as current feature space.

Example:

```text
active:
volatility
trend
volume
```

Reviewer may recommend:

```text
volatility_window 120 → 80
```

Reviewer may NOT recommend immediate:

```text
add order-book imbalance
```

Instead:

```text
FUTURE_IMPROVEMENT:
Consider order-book imbalance after current simple feature set is exhausted.
```

---

# 19. Step 10 — Current Philosophy Guard

If scope says:

```text
Stay simple first
```

Qwen must prefer:

```text
simpler controlled experiments
```

over:

```text
new architecture
new feature family
complex ensemble
large sweep
```

unless current evidence strongly justifies a future scope-change recommendation.

---

# 20. Step 11 — Anti-Overfitting Review

Every meaningful review should check, when available:

```text
train vs validation degradation
validation vs test degradation
walk-forward consistency
market-regime concentration
sample size
multiple-testing exposure
parameter neighborhood stability
fees/slippage sensitivity
turnover
drawdown
tail risk
calibration
baseline superiority
```

For crypto regimes, when available:

```text
bull
bear
sideways
high volatility
low volatility
```

---

# 21. Step 12 — Update Global AGENTS.md Minimally

Merge:

```md
## Trading / ML Quantitative Review

For AI/ML trading projects:

- DeepSeek V4 Flash remains the primary executor.
- Qwen 3.8 Max is the quantitative reviewer.
- Before any quant review, read the current experiment scope.
- Treat active features, tunable parameters, fixed parameters, allowed ranges, and out-of-scope items as hard review constraints.
- Immediate tuning recommendations must stay inside the current scope.
- Ideas outside scope must be listed separately as future improvements and must not be executed automatically.
- After a meaningful milestone/backtest checklist completes, run the scope-aware Quant Analyst review before the next modeling/tuning decision.
- Compute deterministic metrics before LLM interpretation.
- Send a compact analysis packet, not full logs.
- Do not invoke Qwen after every trial.
```

---

# 22. Step 13 — Update `/execute`

Merge:

```md
### Trading / ML Scope-Aware Decision Gate

When executing a trading/ML plan:

1. Complete the existing milestone/checklist.
2. Read the current `EXPERIMENT_SCOPE.md`.
3. Verify that generated experiments stayed within scope.
4. Build/update the analysis packet with a scope snapshot.
5. Invoke Qwen 3.8 Max Quant Analyst.
6. Execute only recommendations classified as IN_SCOPE_TUNING.
7. Persist OUT_OF_SCOPE/FUTURE ideas without executing them.
8. A scope expansion requires explicit user approval or a new/frozen implementation plan.
```

---

# 23. Step 14 — Update `/review`

Merge:

```md
### Trading Model Scope Review

Before accepting a quantitative review:
- verify that recommendations respect current tunable parameters,
- reject silent scope expansion,
- separate immediate tuning from future improvement,
- ensure fixed parameters remain untouched,
- ensure model promotion is based on evidence, not headline return.
```

---

# 24. Step 15 — Optional `/quant-review`

Create/update:

```text
~/.pi/agent/prompts/quant-review.md
```

Usage:

```text
/quant-review ai/experiments/<id>/analysis_packet.json
```

Manual review must still load the current experiment scope first.

---

# 25. Persistent Experiment Structure

Recommended:

```text
ai/
└── experiments/
    ├── EXPERIMENT_SCOPE.md
    ├── EXPERIMENT_INDEX.md
    ├── LEARNINGS.md
    ├── FUTURE_IMPROVEMENTS.md
    └── <experiment-id>/
        ├── analysis_packet.json
        ├── quantitative_review.md
        └── decision.md
```

---

# 26. `FUTURE_IMPROVEMENTS.md`

Persist out-of-scope ideas separately.

Example:

```md
# Future Improvements

## Order-Book Imbalance
Status:
Deferred

Why:
May improve short-horizon directional signal.

Why Not Now:
Current phase intentionally evaluates a simpler feature set.

Evidence Needed Before Scope Expansion:
- current feature set reaches stable tuning plateau,
- OOS limitation remains attributable to missing microstructure signal.

Source:
Quant Review sweep-014
```

---

# 27. `decision.md`

DeepSeek records actual decision:

```md
# Experiment Decision

Quant Verdict:
RETUNE

Selected In-Scope Action:
volatility_window: 120 → 80

Reason:
...

Future Suggestions Recorded:
- order-book imbalance
- funding-rate feature

Not Executed Because:
Outside current scope.
```

---

# 28. Quant Review Trigger Policy

Call Qwen after:

```text
completed initial sweep
completed focused tuning batch
completed walk-forward
completed calibration evaluation
candidate promotion gate
major regression
ambiguous model comparison
completed milestone checklist
```

Do not call after:

```text
one trial
technical rerun
syntax fix
dependency fix
minor metric refresh
```

---

# 29. Review Call Budget

Default:

```text
1 Qwen review per decision checkpoint
```

Maximum:

```text
2
```

only if:
- critical evidence was missing and then supplied,
- first review reports LOW confidence due to missing data.

No open-ended review loop.

---

# 30. Model Configuration

Use:

```text
Primary:
DeepSeek V4 Flash

Quant Analyst:
Qwen 3.8 Max
```

Do not switch entire session.

Preferred:

```text
delegated Qwen review
→ structured text result
→ DeepSeek continues
```

---

# 31. Failure Handling

## Scope file missing

Do not let Qwen freely invent tuning space.

Return:

```text
QUANT_REVIEW_BLOCKED:
EXPERIMENT_SCOPE_MISSING
```

or create a draft scope from the frozen plan and require confirmation before executing scope-sensitive tuning.

## Analysis packet incomplete

Return:

```text
NEED_MORE_EVIDENCE
```

## Qwen suggests out-of-scope tuning as immediate action

DeepSeek must reclassify it to:

```text
FUTURE_IMPROVEMENT
```

and not execute.

## Scope conflict

Record:

```text
RECOMMENDATION_REJECTED:
OUT_OF_SCOPE
```

---

# 32. Validation Scenarios

## Scenario A — Allowed Window Tuning

Scope:

```text
volatility_window: [60,80,120]
```

Qwen recommends:

```text
120 → 80
```

Expected:

```text
IN_SCOPE
may execute
```

## Scenario B — New Feature Recommendation

Scope excludes order-book data.

Qwen suggests order-book imbalance.

Expected:

```text
FUTURE_IMPROVEMENT
REQUIRES_SCOPE_CHANGE: YES
not executed
```

## Scenario C — Fixed Parameter

`label_horizon` is fixed.

Qwen suggests changing label horizon.

Expected:

```text
out-of-scope
not executed
```

## Scenario D — Stay Simple Philosophy

Qwen suggests ensemble model while current simple model has not completed tuning.

Expected:

```text
deferred future idea
```

## Scenario E — Checklist Complete

Once checklist completes:

```text
analysis packet
→ scope-aware Qwen review
→ in-scope next decision
```

---

# 33. Acceptance Criteria

- **AC-1:** DeepSeek V4 Flash remains primary executor.
- **AC-2:** Qwen 3.8 Max remains Quant Analyst.
- **AC-3:** `EXPERIMENT_SCOPE.md` is read before quant review.
- **AC-4:** Active features are known.
- **AC-5:** Tunable parameters/ranges are known.
- **AC-6:** Fixed parameters are protected.
- **AC-7:** Out-of-scope items are explicitly known.
- **AC-8:** Immediate recommendations stay in scope.
- **AC-9:** Future ideas are separated.
- **AC-10:** Out-of-scope ideas are not auto-executed.
- **AC-11:** Completed checklist triggers quant review.
- **AC-12:** Quant review does not run for every trial.
- **AC-13:** Max 3 in-scope experiments are recommended.
- **AC-14:** Anti-overfitting checks remain mandatory.
- **AC-15:** Existing Pi flow remains intact.
- **AC-16:** No open-ended Qwen loop.

---

# 34. Definition of Done

- [ ] Scope-aware Quant Analyst skill updated.
- [ ] Qwen reviewer prompt updated.
- [ ] `EXPERIMENT_SCOPE.md` template created.
- [ ] analysis packet includes scope snapshot.
- [ ] checklist → review gate implemented.
- [ ] global AGENTS.md merged minimally.
- [ ] `/execute` integrated.
- [ ] `/review` integrated.
- [ ] future improvement persistence implemented.
- [ ] fixed parameter guard tested.
- [ ] out-of-scope feature guard tested.
- [ ] allowed tuning scenario tested.
- [ ] checklist-complete auto-review tested.
- [ ] no auto-execution outside scope.
- [ ] existing Pi flows remain unbroken.

---

# 35. Implementation Order

```text
1. Inspect current trading workflow
2. Backup affected global config
3. Create EXPERIMENT_SCOPE.md template
4. Update trading-backtest-analysis skill
5. Update Qwen 3.8 Max reviewer role
6. Add scope snapshot to analysis packet
7. Add hard scope gate
8. Add future-improvement classification
9. Merge global AGENTS.md rules
10. Merge /execute rules
11. Merge /review rules
12. Add/update /quant-review
13. Add FUTURE_IMPROVEMENTS.md persistence
14. Test allowed tuning
15. Test fixed parameter protection
16. Test out-of-scope feature recommendation
17. Test checklist-complete review
18. Verify no scope creep
```

---

# 36. Anti-Over-Engineering Guard

Do NOT add now:

```text
automatic scope expansion
multiple quant reviewers
optimizer swarm
auto feature engineering
auto architecture search
external experiment DB
unbounded hyperparameter sweeps
```

V2 remains:

```text
DeepSeek V4 Flash
+
Qwen 3.8 Max
+
EXPERIMENT_SCOPE.md
+
deterministic metrics
+
analysis packet
+
scope-aware review
```

---

# 37. Final Architecture

```text
          CURRENT EXPERIMENT SCOPE
                    │
                    ▼
            DeepSeek V4 Flash
                    │
        Train / Backtest / Validate
                    │
            Checklist Complete
                    │
                    ▼
         Deterministic Metrics
                    │
        Scope-Aware Analysis Packet
                    │
                    ▼
              Qwen 3.8 Max
                    │
        ┌───────────┴────────────┐
        │                        │
 IN-SCOPE TUNING        FUTURE IMPROVEMENT
        │                        │
        ▼                        ▼
DeepSeek executes       Persist / discuss later
```

---

# 38. Final Principle

> **The Quant Analyst must understand what is currently allowed to change before recommending what should change.**

> **Current tuning stays simple and disciplined.**

> **Ideas beyond the current feature/parameter space are valuable, but they are future recommendations, not automatic next actions.**
