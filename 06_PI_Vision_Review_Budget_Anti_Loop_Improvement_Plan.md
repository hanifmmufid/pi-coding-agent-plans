# Improvement Plan — Vision Review Budget & Anti-Loop Guard for Pi Frontend Validation

**Version:** 1.0  
**Scope:** Global Pi frontend validation behavior  
**Goal:** Mengurangi loop visual validation berulang dan pemakaian vision model mahal tanpa mengurangi kualitas minimum frontend yang diperlukan.

---

# 1. Objective

Perbaiki global frontend validation flow agar vision model:

- tetap dipakai sebagai quality gate,
- tidak berubah menjadi continuous visual critic,
- tidak terus mencari minor cosmetic issues,
- tidak memicu loop tanpa batas,
- tidak menguras quota model vision mahal,
- tetap menjaga usability, clarity, responsiveness, dan production readiness.

Primary model tetap:

```text
DeepSeek V4 Flash
```

Vision reviewer tetap:

```text
Qwen vision-capable model / configured vision model
```

Namun penggunaan vision reviewer dibatasi dengan:

- call budget,
- severity threshold,
- stop condition,
- default functional-quality mode,
- explicit polish mode only when requested.

---

# 2. Problem Statement

Current loop:

```text
DeepSeek implement
↓
Vision review
↓
Minor issue found
↓
DeepSeek fixes
↓
Vision review again
↓
Another minor issue found
↓
DeepSeek fixes again
↓
Vision review again
↓
...
```

Masalah:

1. Vision model terus mencari kekurangan kecil.
2. Minor cosmetic issue dianggap alasan untuk re-review.
3. Expensive vision quota terkuras.
4. Task frontend memakan waktu lebih lama dari manfaat yang diperoleh.
5. Functional work tertunda karena excessive polishing.
6. Visual validation kehilangan fungsi utamanya sebagai quality gate.

---

# 3. Desired Behavior

New default flow:

```text
DeepSeek implementation
↓
Vision Review #1
↓
CRITICAL / MAJOR issue?
├── NO
│   ↓
│   PASS
│
└── YES
    ↓
DeepSeek fixes material issues
    ↓
Vision Review #2
    ↓
Material issue still remains?
├── NO
│   ↓
│   PASS
│
└── YES
    ↓
BLOCKED / report remaining material issue
```

Important:

```text
MINOR issue only
→ no further vision review
→ task may continue to DONE
```

---

# 4. Core Principle

Vision validation must act as:

> **QUALITY GATE**

not:

> **ENDLESS POLISH LOOP**

Default frontend target:

```text
clear
usable
responsive
consistent
production-acceptable
```

Default frontend target is NOT:

```text
pixel-perfect
maximum aesthetic polish
exact visual reproduction
micro-spacing perfection
```

unless explicitly requested by the user.

---

# 5. Frozen Requirements

1. Default vision-call budget = maximum 2 calls per frontend task.
2. If Review #1 returns PASS or only MINOR issues:
   - do not run Review #2.
3. Review #2 is allowed only if Review #1 contains CRITICAL or MAJOR issues.
4. Minor issues must not trigger another vision cycle.
5. After Review #2:
   - if only MINOR issues remain, visual validation is considered PASS.
6. If material CRITICAL/MAJOR issues still remain after Review #2:
   - report them,
   - do not enter endless loop.
7. DeepSeek V4 Flash remains primary executor.
8. Existing `/execute`, `/fix`, `/review`, `AGENTS.md`, frontend-design skill, screenshot flow, and project rules must remain intact.
9. This improvement extends the existing flow; it does not replace it.
10. User can explicitly request higher visual polish when needed.

---

# 6. Visual Modes

Introduce two conceptual modes.

## 6.1 Default Mode

```text
VISUAL_MODE = FUNCTIONAL_QUALITY
```

This is the global default.

Prioritize:

- usability,
- clear hierarchy,
- readable typography,
- responsive correctness,
- no overlap,
- no overflow,
- navigation clarity,
- component consistency,
- production-acceptable appearance.

Ignore as blockers:

- tiny spacing differences,
- subtle shadow differences,
- slight radius inconsistencies,
- tiny alignment refinements,
- micro color tuning,
- purely aesthetic preferences with no usability impact.

---

## 6.2 Polish Mode

Activated only when user explicitly requests things like:

```text
pixel perfect
make it very polished
match this screenshot closely
make it visually exact
refine every detail
```

Conceptually:

```text
VISUAL_MODE = POLISH
```

In this mode:

- more review iterations may be allowed,
- minor issues may be actionable,
- vision budget can be increased.

Default rule:

```text
FUNCTIONAL_QUALITY unless explicitly overridden.
```

---

# 7. Vision Call Budget

## Default Budget

```text
MAX_VISION_CALLS = 2
```

Per frontend task.

Recommended behavior:

### Small visual task

```text
1 vision call
```

### Normal frontend implementation

```text
up to 2 vision calls
```

### Explicit polish task

```text
up to 3–4 calls
```

Only if user explicitly requests high-fidelity visual polishing.

---

# 8. Severity Model

Vision reviewer must classify findings as:

```text
CRITICAL
MAJOR
MINOR
```

## CRITICAL

Only for problems that materially break the UI.

Examples:

- content inaccessible,
- navigation unusable,
- major overlap,
- severe horizontal overflow,
- important actions hidden,
- major responsive break,
- unreadable text,
- broken layout.

CRITICAL:

```text
must fix before DONE
```

---

## MAJOR

Only for issues materially reducing product quality.

Examples:

- hierarchy significantly unclear,
- sidebar proportion clearly wrong,
- important table hard to read,
- major spacing inconsistency,
- poor responsive stacking,
- key sections visually confusing,
- UI clearly inconsistent with existing design system.

MAJOR:

```text
should fix before DONE
```

---

## MINOR

Cosmetic issues only.

Examples:

- slight spacing improvement,
- shadow could be softer,
- radius slightly inconsistent,
- small color refinement,
- tiny alignment difference,
- minor padding improvement,
- aesthetic preference.

MINOR:

```text
does NOT trigger another vision review
```

---

# 9. Mandatory Stop Conditions

Vision loop must stop when any condition below is true.

## Stop Condition A

Review #1:

```text
VISUAL_STATUS = PASS
```

Stop.

---

## Stop Condition B

Review #1 contains:

```text
MINOR only
```

Stop.

---

## Stop Condition C

Review #2 contains:

```text
MINOR only
```

Stop and consider visual validation PASS.

---

## Stop Condition D

Vision-call budget reached.

Stop.

Do not automatically request another review.

---

## Stop Condition E

Remaining issue is subjective polish only.

Stop.

---

# 10. Update Global AGENTS.md

Do not replace current frontend rules.

Merge the following section into:

```text
~/.pi/agent/AGENTS.md
```

```md
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
```

---

# 11. Update Vision Reviewer Prompt

Existing visual review prompt must become stricter.

Add:

```md
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
```

---

# 12. Structured Vision Output

Use:

```text
VISUAL_STATUS:
PASS | NEEDS_FIX

CRITICAL:
- ...

MAJOR:
- ...

MINOR:
- ...

ACTION_REQUIRED:
YES | NO

RECHECK_REQUIRED:
YES | NO

RECOMMENDED_FIXES:
1. ...
2. ...
```

Required logic:

```text
CRITICAL/MAJOR exists
→ NEEDS_FIX

MINOR only
→ PASS
```

---

# 13. Update `/execute`

Merge into existing:

```text
~/.pi/agent/prompts/execute.md
```

```md
### Frontend Vision Budget

For frontend visual validation:

- default to FUNCTIONAL_QUALITY mode,
- maximum 2 vision-review calls,
- only perform a second visual review when the first review found valid CRITICAL or MAJOR issues and meaningful fixes were applied,
- MINOR issues must not trigger another vision review,
- if only MINOR issues remain after correction, continue toward DONE,
- do not perform endless aesthetic refinement.

User-requested pixel-perfect/polish work may use a higher explicit visual-review budget.
```

---

# 14. Update `/fix`

Merge:

```md
### Frontend Fix Visual Budget

For visual/frontend fixes:

1. Use one visual review to verify the affected result.
2. If the reviewer finds a material CRITICAL/MAJOR issue:
   - fix it,
   - allow one final recheck.
3. If only MINOR issues remain:
   - stop visual iteration.
4. Do not keep adjusting cosmetic details unless the user requested polish.
```

---

# 15. Update `/review`

Merge:

```md
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
```

---

# 16. Recheck Policy

## Review #1 PASS

```text
No recheck.
```

## Review #1 MINOR only

```text
No recheck.
```

## Review #1 CRITICAL/MAJOR

```text
Fix material issue.
One recheck allowed.
```

## Review #2 PASS / MINOR only

```text
Stop.
```

## Review #2 still CRITICAL/MAJOR

```text
Stop automatic loop.
Report remaining material issue.
```

Possible status:

```text
DONE with known limitation
```

or:

```text
BLOCKED
```

depending on severity and acceptance criteria.

---

# 17. Screenshot Policy

Default:

```text
Desktop screenshot:
1 initial

Mobile screenshot:
1 initial
```

Do not automatically re-screenshot both viewports after every fix.

Only recheck the viewport affected by the material issue.

Example:

```text
desktop passes
mobile major issue

→ fix mobile
→ recheck mobile only
```

This further reduces vision cost.

---

# 18. Cost Discipline

Rules:

1. Do not call vision model if no meaningful UI changed.
2. Do not call vision model after text-only/backend changes.
3. Do not recheck unaffected viewport.
4. Do not recheck MINOR issue fixes.
5. Do not use expensive reasoning level unnecessarily.
6. Keep vision context narrow.
7. Keep reviewer output concise.
8. Use DeepSeek for all code interpretation and implementation.
9. Reserve vision model exclusively for visual evidence.

---

# 19. Functional Priority Rule

Default task priority:

```text
1. Correct functionality
2. No broken UI
3. Clear usability
4. Responsive behavior
5. Major visual consistency
6. Cosmetic polish
```

Cosmetic polish must not delay functional completion in default mode.

---

# 20. Visual Acceptance Threshold

Frontend is visually acceptable when:

```text
✓ content readable
✓ hierarchy clear
✓ no overlap
✓ no severe overflow
✓ navigation usable
✓ important actions visible
✓ responsive layout usable
✓ tables/forms usable
✓ design broadly consistent
✓ no obvious broken/unfinished visual state
```

Frontend does NOT require:

```text
perfect micro-spacing
perfect shadows
perfect radii
exact color nuance
pixel-perfect alignment
```

unless specifically requested.

---

# 21. Final Report Behavior

Minor issues should be listed separately:

```md
## Visual Validation

Status:
PASS

Vision calls used:
2 / 2

Critical:
None

Major:
None

Optional minor polish:
- table row spacing could be slightly refined
- secondary text could be slightly softer

These do not block completion.
```

This prevents minor observations from becoming another work cycle.

---

# 22. Vision Budget Tracking

If feasible in the existing workflow, maintain simple task-local state:

```text
vision_calls_used = 0
vision_call_budget = 2
```

Before invoking vision:

```text
if vision_calls_used >= vision_call_budget:
    stop visual review
```

No complex persistent state machine is required.

If implementation would require a large custom extension:

> do not add it yet.

Prompt-level enforcement is sufficient for V1.

---

# 23. Explicit Polish Override

If user says:

```text
make this pixel perfect
polish the visuals fully
match the reference exactly
```

then the agent may switch to:

```text
VISUAL_MODE = POLISH
```

Suggested:

```text
vision_call_budget = 4
```

In POLISH mode:

- MINOR may become actionable,
- additional visual cycles may occur.

This override must come from:

- explicit user request,
- or explicit implementation-plan requirement.

Do not infer POLISH mode automatically.

---

# 24. Validation Scenarios

## Scenario A — Good on First Review

Vision #1:

```text
CRITICAL: none
MAJOR: none
MINOR:
- small spacing suggestion
```

Expected:

```text
PASS
No Vision #2
DONE
```

---

## Scenario B — Major Issue

Vision #1:

```text
MAJOR:
- mobile sidebar overlaps content
```

Expected:

```text
DeepSeek fixes
→ Vision #2
```

Vision #2:

```text
MINOR:
- mobile padding could be slightly larger
```

Expected:

```text
PASS
Stop
```

---

## Scenario C — Reviewer Keeps Finding Tiny Issues

Review #2 returns only cosmetic suggestions.

Expected:

```text
No Review #3.
```

---

## Scenario D — Major Issue Still Exists

Review #2:

```text
MAJOR:
- table remains unusable on mobile
```

Expected:

```text
Stop automatic visual loop.
Report issue.
Do not invoke Vision #3 automatically.
```

---

## Scenario E — Explicit Pixel Perfect Request

User explicitly requests high polish.

Expected:

```text
POLISH mode
higher visual budget allowed
```

---

# 25. Acceptance Criteria

- **AC-1:** Default max vision calls = 2.
- **AC-2:** PASS on first review stops immediately.
- **AC-3:** MINOR-only review stops immediately.
- **AC-4:** Second review only after CRITICAL/MAJOR fix.
- **AC-5:** No third review in default mode.
- **AC-6:** Minor cosmetic issues do not block DONE.
- **AC-7:** DeepSeek remains primary executor.
- **AC-8:** Existing frontend workflow remains unchanged except anti-loop guard.
- **AC-9:** Existing skills/prompts/project rules remain synchronized.
- **AC-10:** User can explicitly enable POLISH mode.
- **AC-11:** Unaffected viewport is not re-reviewed unnecessarily.
- **AC-12:** Vision usage/cost is materially reduced.

---

# 26. Definition of Done

Improvement is complete when:

- [ ] Global AGENTS.md contains anti-loop rule.
- [ ] Visual reviewer prompt uses material severity threshold.
- [ ] `/execute` respects max 2 vision calls.
- [ ] `/fix` respects max 2 vision calls.
- [ ] `/review` does not fail on MINOR-only issues.
- [ ] Existing frontend-design skill still works.
- [ ] Existing screenshot/vision integration still works.
- [ ] Existing safety flow remains unchanged.
- [ ] First-review PASS scenario tested.
- [ ] Major-fix-recheck scenario tested.
- [ ] Minor-only scenario tested.
- [ ] No third automatic vision call occurs.
- [ ] POLISH override behavior documented.

---

# 27. Implementation Order

```text
1. Inspect existing visual validation rules
2. Backup affected global files
3. Merge anti-loop rules into AGENTS.md
4. Tighten visual-review prompt
5. Update /execute
6. Update /fix
7. Update /review
8. Reload Pi
9. Test first-review PASS
10. Test major → fix → second review
11. Test minor-only stop behavior
12. Verify no automatic third vision call
13. Verify existing frontend flow still works
14. Compare vision quota usage before/after
```

---

# 28. Final Architecture

```text
DeepSeek V4 Flash
        ↓
Implement
        ↓
Vision Review #1
        ↓
Material issue?
   ┌────┴────┐
  NO        YES
   ↓          ↓
 DONE       FIX
              ↓
       Vision Review #2
              ↓
       Material issue?
         ┌────┴────┐
        NO        YES
         ↓          ↓
       DONE       STOP
                  Report
```

No default path to:

```text
Vision Review #3
Vision Review #4
Vision Review #5
```

---

# 29. Final Principle

> **Visual validation should catch important problems, not continuously manufacture new work.**

Default frontend goal:

> **Functionally correct, visually clear, responsive, and production-acceptable.**

Not:

> **perfect down to every cosmetic detail.**
