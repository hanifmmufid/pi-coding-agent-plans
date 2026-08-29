# Implementation Plan — Dual-Model Frontend Visual Validation for Pi
## DeepSeek V4 Flash as Primary Executor + Vision Reviewer as Dedicated Screenshot Analyst

**Version:** 1.0  
**Scope:** Global Pi configuration improvement  
**Primary Constraint:** Integrate visual-model delegation without changing or breaking the existing Pi execution flow, existing skills, `AGENTS.md`, project rules, prompts, profiles, safety extensions, or validation behavior.

---

# 1. Objective

Upgrade the existing Pi frontend workflow so that:

1. **DeepSeek V4 Flash remains the primary coding/execution model.**
2. Frontend implementation continues to use the current:
   - global `AGENTS.md`,
   - project `AGENTS.md`,
   - `/execute`,
   - `/fix`,
   - `/review`,
   - `frontend-design` skill,
   - browser/screenshot tooling,
   - safety extensions,
   - project-specific profiles/rules,
   - existing validation loop.
3. When visual validation requires reading a screenshot and the active primary model cannot consume image input:
   - screenshot analysis is delegated automatically to a dedicated vision-capable model.
4. The vision model returns **structured textual visual findings**.
5. DeepSeek V4 Flash receives those findings and continues:
   - diagnosis,
   - frontend correction,
   - re-validation.
6. Existing execution flow is **extended**, not replaced.
7. Existing project behavior and rules must not be silently overwritten.
8. The new vision layer must remain lightweight and cost-efficient.

---

# 2. Core Architecture

Target architecture:

```text
User / Implementation Plan
        ↓
Existing Pi Workflow
        ↓
Global AGENTS.md
Project AGENTS.md
Existing Skills / Profiles / Prompts
        ↓
DeepSeek V4 Flash
Primary Executor
        ↓
Inspect Existing Design
        ↓
frontend-design Skill
        ↓
Implement / Fix Frontend
        ↓
Run Actual Page
        ↓
Browser Screenshot
        ↓
Does Primary Model Support Image?
        │
        ├── YES
        │     ↓
        │  Primary visual inspection
        │
        └── NO
              ↓
        Vision Delegation Tool
              ↓
        Vision-Capable Model
              ↓
        Structured Textual Review
              ↓
        DeepSeek V4 Flash
              ↓
        Diagnose / Fix
              ↓
        Re-render if needed
              ↓
        Final Visual Validation
              ↓
        Existing Functional Validation
              ↓
        Final Diff Review
              ↓
        DONE / BLOCKED
```

---

# 3. Non-Negotiable Integration Principles

## 3.1 Preserve Existing Flow

Do NOT replace:

- `/execute`,
- `/fix`,
- `/review`,
- existing frontend-design workflow,
- existing validation rules,
- existing project-specific AGENTS rules,
- existing safety gates,
- existing permission behavior,
- existing model/provider setup,
- existing project profile/config.

The vision layer must be added as:

> **a delegated visual-analysis capability inside the existing frontend validation step.**

---

## 3.2 Existing Rules Stay Authoritative

Priority order:

```text
1. User's explicit current request
2. Frozen implementation plan / project specification
3. Project AGENTS.md / project profile
4. Existing project design system
5. Global AGENTS.md
6. Global frontend defaults
7. Vision reviewer recommendations
```

The vision reviewer:

- may identify problems,
- may recommend fixes,
- may classify visual severity,

but MUST NOT override:

- frozen requirements,
- project design system,
- business rules,
- route behavior,
- project-specific visual conventions.

---

## 3.3 Vision Model Is Reviewer, Not Primary Coder

The vision model's job is:

```text
SEE
ANALYZE
REPORT
```

Not:

```text
rewrite repository
redesign architecture
change requirements
directly modify source code
```

DeepSeek V4 Flash remains responsible for:

```text
inspect code
implement
fix
run commands
validate
review diff
```

---

# 4. Existing Global Components That Must Remain Synchronized

Before implementation, inspect and preserve the current versions of:

```text
~/.pi/agent/AGENTS.md
~/.pi/agent/prompts/execute.md
~/.pi/agent/prompts/fix.md
~/.pi/agent/prompts/review.md
~/.pi/agent/extensions/
~/.pi/agent/models.json          # if present
~/.pi/agent/auth.json            # if present
```

Also inspect relevant installed skills/packages:

```text
frontend-design
browser-screenshot
existing safety extensions
existing project-specific skills
```

And per project:

```text
<repo>/AGENTS.md
<repo>/.pi/
<repo>/docs/DESIGN_SYSTEM.md     # if present
<repo>/ai/plans/
<repo>/ai/decisions/
```

---

# 5. Pre-Implementation Safety Step

Before modifying global config:

1. Detect existing files.
2. Create backups.
3. Do not overwrite entire files if only one section needs to be added.
4. Merge changes surgically.

Recommended backup examples:

```bash
cp ~/.pi/agent/AGENTS.md ~/.pi/agent/AGENTS.md.bak-vision
cp ~/.pi/agent/prompts/execute.md ~/.pi/agent/prompts/execute.md.bak-vision
cp ~/.pi/agent/prompts/fix.md ~/.pi/agent/prompts/fix.md.bak-vision
cp ~/.pi/agent/prompts/review.md ~/.pi/agent/prompts/review.md.bak-vision
```

If a file does not exist:

> do not fail; skip or create only when required.

---

# 6. Step 1 — Install a Vision Delegation Extension

Preferred approach:

```text
pi-vision-tool
```

Reason:

- primary model stays active,
- the model can delegate image analysis,
- screenshot is analyzed by a separate vision model,
- result comes back as text,
- no full session model switch is required.

Install according to the package's current Pi installation method.

Example target:

```bash
pi install npm:pi-vision-tool
```

**Important:** verify actual package name/installation syntax before execution. Do not assume package metadata if Pi reports a different canonical package identifier.

If `pi-vision-tool` is unavailable or incompatible with the installed Pi version:

Fallback:

```text
pi-vision-handoff
```

Use only one visual delegation mechanism unless there is a proven need for both.

---

# 7. Step 2 — Configure a Vision-Capable Model

Primary remains:

```text
DeepSeek V4 Flash
```

Vision reviewer should be:

```text
Qwen vision-capable model
```

or another explicitly image-capable model available through the current provider setup.

Do NOT select a model only because its name is Qwen/Max.

Verify that the model:

```text
supports image input
```

Preferred selection criteria:

1. reliable screenshot understanding,
2. good UI/layout reasoning,
3. relatively low cost,
4. accessible through current provider/API,
5. compatible with Pi's model registry / vision tool.

---

# 8. Vision Model Configuration

Target conceptual config:

```text
Primary model:
DeepSeek V4 Flash

Vision model:
Qwen Vision / other image-capable model

Primary responsibilities:
- coding
- repository exploration
- implementation
- fixing
- command execution
- functional validation

Vision responsibilities:
- screenshot analysis
- UI critique
- responsive visual review
```

Do not modify the default primary model globally just to support screenshots.

---

# 9. Step 3 — Add Vision Delegation Rules to Global AGENTS.md

Modify only the frontend section in:

```text
~/.pi/agent/AGENTS.md
```

Do NOT replace existing content.

Add or merge this section:

```md
### Vision Delegation for Frontend Validation

When frontend/UI visual validation requires inspecting a screenshot:

1. Render the actual page using the existing browser/screenshot workflow.
2. If the active primary model supports image input, inspect the screenshot normally.
3. If the active primary model does NOT support image input:
   - delegate the screenshot to the configured vision-capable model,
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
```

---

# 10. Step 4 — Define Structured Vision Review Prompt

Create a reusable prompt if the vision tool supports custom prompts.

Recommended location:

```text
~/.pi/agent/prompts/visual-review.md
```

Recommended content:

```md
Review this rendered frontend screenshot as a senior product UI reviewer.

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

Return exactly this structure:

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

RECHECK_REQUIRED:
YES | NO

Do not recommend changes that conflict with explicit requirements or the existing product design system.
```

---

# 11. Step 5 — Update `/execute` Without Changing Existing Execution Flow

File:

```text
~/.pi/agent/prompts/execute.md
```

Do not replace current workflow.

Find the existing frontend section and append/merge:

```md
### Frontend Vision Validation

When frontend visual validation reaches the screenshot-inspection step:

- keep the active coding model unchanged,
- if the active model cannot read images, delegate screenshot analysis to the configured vision model,
- receive the structured visual review as text,
- let the primary coding model evaluate those findings against the implementation plan and project rules,
- fix only valid issues,
- re-render only after meaningful changes,
- run final visual review before frontend DONE.

Do not switch the whole execution session to the vision model merely to inspect screenshots.
```

---

# 12. Step 6 — Update `/fix`

File:

```text
~/.pi/agent/prompts/fix.md
```

Merge:

```md
### Frontend Screenshot Review

For visual/frontend fixes:

1. Render the affected page.
2. Capture screenshot.
3. If the active model cannot read images, delegate screenshot review to the configured vision model.
4. Use structured reviewer findings to identify the visual root cause.
5. The primary model performs the code fix.
6. Re-render and re-check when the change is meaningful.
7. Do not declare DONE until visual validation passes.
```

---

# 13. Step 7 — Update `/review`

File:

```text
~/.pi/agent/prompts/review.md
```

Merge:

```md
### Delegated Visual Review

If frontend changes exist and the active model cannot inspect screenshots:

- invoke the configured vision reviewer,
- obtain structured visual findings,
- combine them with source diff review,
- verify that recommendations align with project rules and design system,
- report meaningful visual defects by severity.

Do not report frontend review as complete if rendered visual evidence was available but never analyzed.
```

---

# 14. Step 8 — Preserve Existing Frontend Skill Behavior

The existing:

```text
frontend-design
```

skill remains the design implementation guidance.

Responsibility split:

```text
frontend-design
→ guides design creation and styling decisions

browser-screenshot
→ captures actual rendered result

vision reviewer
→ analyzes the screenshot

DeepSeek V4 Flash
→ implements/fixes

AGENTS.md
→ governs policy and project consistency

/execute /fix /review
→ governs workflow
```

Do not duplicate frontend-design rules inside the vision extension.

---

# 15. Step 9 — Preserve Existing Project-Specific Behavior

Project-specific files remain authoritative:

```text
<repo>/AGENTS.md
<repo>/docs/DESIGN_SYSTEM.md
<repo>/ai/plans/*.md
```

Example:

If global preference says:

```text
light + sidebar
```

but an established project intentionally uses:

```text
dark theme
```

then:

```text
project design wins
```

unless the current task explicitly requests a theme change.

Vision reviewer must evaluate:

> consistency with the actual project

not merely global aesthetic preference.

---

# 16. Step 10 — Vision Review Context Package

When invoking the visual reviewer, provide only relevant context.

Preferred context:

```text
1. screenshot
2. short page purpose
3. relevant visual requirement
4. relevant design system excerpt
5. target viewport
```

Avoid sending:

```text
entire repository
entire conversation
full implementation plan if unnecessary
```

Goal:

> keep vision calls cheap and focused.

---

# 17. Desktop Review Workflow

For desktop:

```text
viewport ≈ 1440px
```

Vision prompt context example:

```text
Page:
Product Offers

Purpose:
Operational dashboard for managing offers.

Design constraints:
Light application UI, left sidebar, modern/minimal/elegant.

Review:
Layout, hierarchy, spacing, sidebar, table readability, production readiness.
```

---

# 18. Mobile Review Workflow

For mobile:

```text
viewport ≈ 390px
```

Reviewer should specifically evaluate:

```text
navigation access
horizontal overflow
content stacking
table behavior
button reachability
text readability
spacing
responsive hierarchy
```

---

# 19. Visual Fix Loop

Target loop:

```text
DeepSeek implements
        ↓
Screenshot
        ↓
Vision reviewer
        ↓
Structured findings
        ↓
DeepSeek filters findings
against requirements/project rules
        ↓
Valid issue exists?
   ┌─────────────┴─────────────┐
  YES                          NO
   ↓                            ↓
Fix                        Continue
   ↓
Re-render
   ↓
Vision review
```

Limit visual loops:

```text
maximum 2 meaningful corrective visual loops by default
```

If still significantly wrong:

```text
BLOCKED / model escalation / request stronger visual reasoning
```

Do not endlessly tweak UI.

---

# 20. Severity Handling

Vision reviewer output:

```text
CRITICAL
MAJOR
MINOR
```

Primary model should use:

```text
CRITICAL:
must fix before DONE

MAJOR:
fix if relevant to requirements / production quality

MINOR:
fix only if low-cost and clearly beneficial
```

Do not burn tokens perfecting subjective micro-details.

---

# 21. Recheck Policy

If:

```text
RECHECK_REQUIRED: NO
```

and no meaningful source changes occur afterward:

> do not take another screenshot.

If:

```text
RECHECK_REQUIRED: YES
```

and DeepSeek applies the recommended fix:

> take one new screenshot and re-run reviewer.

---

# 22. Cost Efficiency Rules

1. DeepSeek V4 Flash remains primary.
2. Vision model is called only when screenshot interpretation is required.
3. Send compressed screenshot if tooling supports it.
4. Avoid multiple screenshots of the same unchanged state.
5. Use one screenshot per target viewport initially.
6. Re-review only after meaningful visual changes.
7. Do not pass unnecessary repository context to vision model.
8. Do not switch entire session to expensive vision model.
9. Keep visual reviewer output structured and concise.

---

# 23. Model Escalation

Do not add automatic model routing yet.

If visual reviewer is not accurate enough:

Manual improvement order:

```text
1. improve visual-review prompt
2. use a better vision-capable model
3. increase reasoning level if supported
4. only then consider automatic model routing
```

---

# 24. Failure Handling

## Vision tool unavailable

If vision delegation fails:

```text
Status:
VISUAL_VALIDATION_BLOCKED
```

Do not pretend screenshot was reviewed.

Report:

```text
- screenshot captured
- primary model cannot inspect images
- vision reviewer unavailable
- visual validation incomplete
```

Functional validation may continue, but frontend must not be marked fully `DONE`.

---

## Vision model returns low-quality feedback

If feedback is generic:

```text
"looks good"
```

without evidence:

- retry once with structured visual-review prompt,
- require severity + concrete findings,
- if still poor, report reviewer limitation.

---

## Vision feedback conflicts with frozen requirements

Ignore conflicting suggestion and record:

```text
Vision suggestion rejected:
conflicts with project requirement/design system.
```

---

# 25. Validation Plan

Run four pilot scenarios.

## Pilot A — Existing Application

Primary:
DeepSeek V4 Flash

Task:
modify an existing page.

Expected:

```text
DeepSeek implements
→ screenshot
→ vision reviewer
→ findings
→ DeepSeek fixes if needed
→ final validation
```

Existing product visual language must remain intact.

---

## Pilot B — Greenfield Dashboard

Task:

```text
create a new admin dashboard
```

Expected:

- frontend-design skill applied,
- global greenfield preference applied,
- DeepSeek builds UI,
- vision model reviews desktop/mobile,
- DeepSeek refines,
- final result production-grade.

---

## Pilot C — Visual Bug Fix

Task:

```text
sidebar mobile overlaps content
```

Expected:

- DeepSeek investigates,
- actual screenshot captured,
- vision reviewer confirms issue,
- DeepSeek fixes,
- recheck pass.

---

## Pilot D — Project Rule Conflict

Project has an intentional dark design system.

Global preference:

```text
light-first
```

Expected:

```text
project design wins
```

Vision reviewer must review consistency with project, not force light mode.

---

# 26. Acceptance Criteria

- **AC-1:** DeepSeek V4 Flash remains primary model.
- **AC-2:** Existing global Pi flow remains intact.
- **AC-3:** Existing `frontend-design` skill remains in use.
- **AC-4:** Existing browser screenshot flow remains in use.
- **AC-5:** Screenshot analysis can be delegated to vision model.
- **AC-6:** Vision output returns to DeepSeek as text.
- **AC-7:** DeepSeek acts on valid visual findings.
- **AC-8:** Existing project rules remain authoritative.
- **AC-9:** Existing design systems are not overridden.
- **AC-10:** `/execute` supports delegated visual validation.
- **AC-11:** `/fix` supports delegated visual validation.
- **AC-12:** `/review` supports delegated visual review.
- **AC-13:** Desktop review works.
- **AC-14:** Mobile review works.
- **AC-15:** Vision failure is reported honestly.
- **AC-16:** No excessive additional token usage.
- **AC-17:** No full session model switching required.
- **AC-18:** No unrelated global config is changed.

---

# 27. Definition of Done

Implementation is complete only when:

- [ ] Existing global configs backed up.
- [ ] Vision extension installed and loads successfully.
- [ ] Vision-capable model configured and verified.
- [ ] DeepSeek V4 Flash remains default primary.
- [ ] Global `AGENTS.md` merged without losing existing rules.
- [ ] `/execute` merged without replacing existing flow.
- [ ] `/fix` merged without replacing existing flow.
- [ ] `/review` merged without replacing existing flow.
- [ ] `frontend-design` remains functional.
- [ ] browser screenshot remains functional.
- [ ] Existing safety extensions remain functional.
- [ ] Pilot A passes.
- [ ] Pilot B passes.
- [ ] Pilot C passes.
- [ ] Pilot D passes.
- [ ] Desktop delegated review passes.
- [ ] Mobile delegated review passes.
- [ ] DeepSeek receives structured visual feedback.
- [ ] DeepSeek can correct UI based on reviewer feedback.
- [ ] No project-specific rule is overwritten.

---

# 28. Implementation Order

Execute in this order:

```text
1. Inspect existing global Pi config
2. Inspect installed skills/extensions
3. Backup relevant global config files
4. Install vision delegation extension
5. Verify extension compatibility
6. Configure vision-capable model
7. Test standalone image analysis
8. Merge vision rules into global AGENTS.md
9. Merge delegated vision flow into /execute
10. Merge delegated vision flow into /fix
11. Merge delegated visual review into /review
12. Reload Pi
13. Verify existing frontend-design still loads
14. Verify browser screenshot still works
15. Verify safety extensions still work
16. Run Pilot A
17. Run Pilot B
18. Run Pilot C
19. Run Pilot D
20. Review token/cost behavior
21. Report final configuration changes
```

---

# 29. Final Report Required from Pi

At the end of implementation, report:

```md
## Status
DONE / BLOCKED

## Existing Config Preserved
- AGENTS.md: YES/NO
- execute.md: YES/NO
- fix.md: YES/NO
- review.md: YES/NO
- safety extensions: YES/NO
- frontend-design: YES/NO
- browser screenshot: YES/NO

## Vision Integration
Vision extension:
...

Vision model:
...

Primary model:
DeepSeek V4 Flash

## Validation
Standalone vision test: PASS/FAIL
Desktop delegated review: PASS/FAIL
Mobile delegated review: PASS/FAIL
Existing frontend workflow: PASS/FAIL
Safety workflow: PASS/FAIL

## Pilot Results
Pilot A: PASS/FAIL
Pilot B: PASS/FAIL
Pilot C: PASS/FAIL
Pilot D: PASS/FAIL

## Config Files Changed
- ...

## Existing Files Backed Up
- ...

## Remaining Issues
None / ...
```

---

# 30. Anti-Over-Engineering Guard

Do NOT add at this stage:

```text
multi-agent frontend team
automatic full model switching
automatic complex router
visual reviewer subagent swarm
Figma integration
design-playbook
visual regression CI
multiple vision models
parallel screenshot reviewers
```

Current target is intentionally simple:

```text
DeepSeek V4 Flash
        +
one vision reviewer
        +
existing frontend workflow
```

---

# 31. Final Architecture Decision

Final intended global Pi frontend architecture:

```text
                      GLOBAL PI
                         │
              Existing Rules / Skills
                         │
                 DeepSeek V4 Flash
                    Primary Model
                         │
                 Frontend Implement
                         │
                  Browser Screenshot
                         │
                 Vision Delegation
                         │
               Vision-Capable Model
                         │
                Structured Findings
                         │
                 DeepSeek V4 Flash
                         │
                 Fix / Re-validate
                         │
          Existing Functional Validation
                         │
                  Final Diff Review
                         │
                    DONE/BLOCKED
```

Core principle:

> **Do not replace the existing Pi workflow. Add vision as a specialized delegated reviewer exactly where the existing frontend validation flow currently has a visual-understanding gap.**
