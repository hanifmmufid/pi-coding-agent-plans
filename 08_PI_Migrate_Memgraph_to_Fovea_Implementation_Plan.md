# Implementation Plan — Replace Memgraph Codebase Intelligence with Pi Fovea

**Version:** 1.0  
**Scope:** Global Pi codebase-understanding stack  
**Goal:** Mengganti setup codebase intelligence yang sebelumnya memakai `pi-code-graph + Memgraph` dengan `Pi Fovea` sebagai lightweight repo-awareness layer, sambil mempertahankan `codebase-study`, modular Markdown knowledge, existing Pi workflows, dan prinsip hemat context/token.

---

# 1. Objective

Migrasikan:

```text
Pi
→ pi-code-graph
→ Memgraph
→ codebase-study
→ docs/codebase/*.md
```

menjadi:

```text
Pi
→ Pi Fovea
→ codebase-study
→ docs/codebase/*.md
```

Tujuan utama:

1. menghilangkan dependency Memgraph,
2. mengurangi service/container tambahan di VPS,
3. tetap memberi Pi awareness terhadap repo besar,
4. menjaga context tetap ringan,
5. mempertahankan structured repo study,
6. mempertahankan persistent Markdown knowledge,
7. tidak mengubah flow utama Pi yang sudah ada,
8. Local CodeGraph tetap menjadi opsi Phase 2 bila exact caller/callee/impact query terbukti diperlukan.

---

# 2. Design Philosophy

Setup Pi tetap mengikuti prinsip:

```text
lightweight by default
progressive context
single-agent first
source code = source of truth
persistent docs = navigation/memory
specialized tools only when needed
no unnecessary always-on services
```

Peran tiap komponen:

```text
DeepSeek V4 Flash
→ primary reasoning / coding executor

Pi Fovea
→ lightweight repo-awareness / contextual map

codebase-study
→ systematic study methodology

docs/codebase/*.md
→ persistent reusable knowledge

source code
→ final source of truth
```

---

# 3. Current State

Existing setup kemungkinan sudah memiliki:

```text
~/.pi/agent/
├── AGENTS.md
├── skills/
│   └── codebase-study/
│       └── SKILL.md
├── prompts/
│   ├── study-codebase.md
│   └── refresh-codebase-docs.md
└── ...
```

Dan pada repository:

```text
docs/codebase/
├── README.md
├── architecture.md
├── modules.md
├── security.md
├── infrastructure.md
├── data-model.md
├── performance.md
├── testing.md
└── ...
```

Code intelligence sebelumnya:

```text
pi-code-graph
+
Memgraph
```

---

# 4. Target State

Target global architecture:

```text
GLOBAL PI
│
├── DeepSeek V4 Flash
├── Pi Fovea
├── codebase-study skill
├── /study-codebase
├── /refresh-codebase-docs
├── existing AGENTS.md
├── existing /execute
├── existing /fix
├── existing /review
├── existing frontend/vision setup
└── existing safety extensions
```

Per repo:

```text
repository/
├── AGENTS.md
├── docs/
│   └── codebase/
│       ├── README.md
│       ├── architecture.md
│       ├── modules.md
│       ├── security.md
│       └── ...
└── source code
```

No required always-on:

```text
Memgraph service
graph DB container
central graph backend
```

---

# 5. Frozen Requirements

1. DeepSeek V4 Flash remains primary executor.
2. Existing frontend/vision configuration must not be changed.
3. Existing `/execute`, `/fix`, `/review` remain intact.
4. Existing `codebase-study` skill remains intact in purpose.
5. Existing `docs/codebase/*.md` must be preserved.
6. Existing safety extensions remain intact.
7. Fovea is an acceleration/context layer, not source of truth.
8. Source code remains authoritative.
9. Do not automatically load all codebase docs.
10. Do not run full deep study on every repo/task.
11. Fovea context budget must remain conservative.
12. Memgraph must not be removed until Fovea is validated.
13. Local CodeGraph is NOT installed in V1 unless a real gap appears.
14. No vector DB / RAG / subagent swarm.
15. Migration must be reversible.

---

# 6. Why Fovea Is the Default Replacement

Fovea is preferred because the main requirement is:

> Pi should quickly understand a large repository without loading the entire repository into context.

Fovea provides:

```text
whole-repo awareness
+
relevance-focused context
+
bounded token budget
+
progressive disclosure
```

This is more aligned with the existing Pi philosophy than:

```text
always-on graph database
+
semantic backend
+
extra service management
```

---

# 7. Step 1 — Audit Existing Memgraph Setup

Before changing anything, inspect:

```text
installed Pi packages
pi-code-graph config
Memgraph container/service
Memgraph port
Memgraph volumes
startup scripts
systemd/docker compose entries
codebase-study references
AGENTS.md references
study-codebase prompt references
```

Record current state.

Do not delete anything yet.

---

# 8. Step 2 — Backup Global Pi Configuration

Backup relevant files:

```bash
cp ~/.pi/agent/AGENTS.md ~/.pi/agent/AGENTS.md.bak-fovea
cp ~/.pi/agent/prompts/study-codebase.md ~/.pi/agent/prompts/study-codebase.md.bak-fovea
cp ~/.pi/agent/prompts/refresh-codebase-docs.md ~/.pi/agent/prompts/refresh-codebase-docs.md.bak-fovea
```

If skill exists:

```bash
cp ~/.pi/agent/skills/codebase-study/SKILL.md \
   ~/.pi/agent/skills/codebase-study/SKILL.md.bak-fovea
```

Do not back up unrelated config unnecessarily.

---

# 9. Step 3 — Install Pi Fovea

Install Pi Fovea using its current supported Pi installation method.

Conceptual target:

```bash
pi install npm:pi-fovea
```

Important:

> verify actual package identifier and installed Pi compatibility before execution.

Do not uninstall `pi-code-graph` yet.

---

# 10. Step 4 — Configure Fovea Conservatively

Use a conservative configuration to avoid context bloat.

Recommended conceptual starting config:

```json
{
  "sync": {
    "mode": "hidden",
    "scope": "session",
    "budget": 256,
    "pushFocus": false
  },
  "tools": {
    "defaultBudget": 512,
    "grepMode": "augment",
    "grepAugmentBudget": 256
  }
}
```

Exact config keys must be verified against the installed Fovea version.

Goals:

```text
small automatic context
larger context only on explicit pull
session-scoped relevance
no aggressive push
```

---

# 11. Fovea Usage Philosophy

Default:

```text
push little
pull detail when needed
```

Automatic repo awareness should remain small.

Use explicit Fovea tools only when necessary:

```text
sketch
focus
dwell
impact
```

Conceptual roles:

```text
sketch
→ broad repo overview

focus
→ relevant area for current topic

dwell
→ deeper look at a selected area

impact
→ likely change/blast-radius context
```

---

# 12. Step 5 — Update `codebase-study` Skill Minimally

Do NOT rewrite the skill.

Change graph-specific wording to Fovea-aware wording.

Recommended rule:

```md
Use the available repository-awareness tooling to understand the codebase progressively.

Prefer:
- repository sketch,
- relevant focus,
- targeted source reads,
- source verification.

Do not read the entire repository blindly.

Use Fovea to identify:
- important modules,
- likely entrypoints,
- relevant boundaries,
- representative flows,
- likely impact areas.

Persist confirmed findings under `docs/codebase/`.
```

Keep existing study phases unchanged.

---

# 13. Step 6 — Update Global AGENTS.md Minimally

Do not replace the existing codebase workflow.

Merge:

```md
## Codebase Awareness

When working in a large or unfamiliar repository:

- use the available Fovea/repository-awareness tools for lightweight orientation,
- prefer small contextual maps over reading the entire repository,
- consult only relevant `docs/codebase/` documents,
- verify important assumptions against current source code,
- treat Fovea output and generated documentation as navigation aids, not authoritative truth.

Do not load all codebase documentation unless genuinely necessary.
```

Keep AGENTS.md compact.

---

# 14. Step 7 — Update `/study-codebase`

Preserve existing phases:

```text
recon
architecture
runtime/data flow
security
infrastructure
data
performance
testing
deployment
engineering lessons
```

Replace graph-specific navigation with:

```text
Fovea sketch
→ focused repo areas
→ targeted source reads
→ verify
→ write docs
```

Recommended beginning:

```text
1. Obtain a lightweight repository sketch.
2. Identify major modules/boundaries.
3. Focus only on relevant areas for each study phase.
4. Read representative source files.
5. Verify findings.
6. Persist confirmed knowledge.
```

---

# 15. Step 8 — Update `/refresh-codebase-docs`

Keep incremental behavior.

New flow:

```text
changed files / git diff
→ Fovea impact/focus if needed
→ identify affected knowledge areas
→ inspect relevant source
→ update affected docs only
```

Do not run full repo study.

---

# 16. Preserve Modular Documentation

Existing:

```text
docs/codebase/*.md
```

must remain unchanged by the migration unless findings are stale.

Fovea does not replace persistent docs.

Roles:

```text
Fovea
→ current contextual awareness

docs/codebase
→ persistent understanding across sessions
```

---

# 17. Study Depth Modes Remain

Keep:

```text
QUICK_RECON
STANDARD_STUDY
DEEP_DIVE
```

## QUICK_RECON

Use:
- sketch,
- top-level boundaries,
- entrypoints,
- architecture hypothesis.

## STANDARD_STUDY

Use focused exploration for:
- architecture,
- security,
- infra,
- persistence,
- performance,
- testing,
- deployment.

## DEEP_DIVE

Only explicit:

```text
deep dive security
deep dive query performance
deep dive deployment architecture
```

---

# 18. Token/Context Budget Rules

1. Keep automatic Fovea sync budget small.
2. Do not push full focus automatically.
3. Use explicit focus only when needed.
4. Do not load all Markdown docs.
5. Do not read all source files in a module if representative files are enough.
6. Avoid generated/vendor directories.
7. Summarize before expanding scope.
8. Stop once enough evidence exists.

---

# 19. Existing Repo Study Workflow

Target:

```text
/study-codebase
↓
Fovea sketch
↓
identify modules
↓
focus architecture
↓
targeted source reads
↓
focus security
↓
targeted source reads
↓
focus infra
↓
...
↓
docs/codebase/*.md
```

Not:

```text
/study-codebase
↓
scan/read all files
```

---

# 20. Normal Coding Workflow

For a normal task:

```text
user request
↓
existing AGENTS/project rules
↓
Fovea gives lightweight repo context
↓
DeepSeek identifies relevant files
↓
source inspection
↓
implement
↓
validate
```

Do not invoke full `/study-codebase` automatically.

---

# 21. Architecture-Sensitive Task Workflow

For architecture-sensitive changes:

```text
read docs/codebase/README.md
↓
read relevant architecture/security/etc doc
↓
Fovea focus
↓
verify current source
↓
design / implement
```

---

# 22. Source-of-Truth Priority

Keep:

```text
current source code
> current config
> tests
> repository docs
> generated docs/codebase
> Fovea context
```

If Fovea/context appears inconsistent:

```text
verify current source
```

---

# 23. Parallel Validation Before Cutover

Before removing Memgraph, test the same repo with both stacks.

Questions:

```text
1. What are the major modules?
2. Where is authentication implemented?
3. Trace a representative request flow.
4. Where is persistence handled?
5. What parts are likely affected by changing service X?
```

Compare:

```text
Memgraph-backed workflow
vs
Fovea-backed workflow
```

Success is not exact equality.

Success means:

```text
Fovea gives sufficient orientation
Pi reaches correct source faster
context remains controlled
```

---

# 24. Pilot Repository Tests

Test at least:

## Pilot A — Medium Repo

Expected:

```text
Fovea indexing/context works
repo orientation quick
/study-codebase works
```

## Pilot B — Large Mature Repo

Expected:

```text
whole-repo awareness remains useful
context does not explode
targeted deep dives work
```

## Pilot C — Follow-Up Session

Ask:

```text
How does authentication work?
```

Expected:

```text
relevant docs
→ Fovea focus
→ current source verification
→ answer
```

## Pilot D — Coding Task

Expected:

```text
Fovea context assists navigation
no full study
implementation proceeds normally
```

---

# 25. Acceptance Threshold for Fovea

Fovea is sufficient as V1 if Pi can reliably:

```text
identify major modules
find likely entrypoints
understand broad boundaries
focus on relevant areas
reduce blind grep/read loops
navigate large repos efficiently
support systematic codebase-study
```

Exact caller/callee perfection is NOT required in V1.

---

# 26. When to Add Local CodeGraph Later

Only add Local CodeGraph if real usage shows repeated weakness in:

```text
exact caller/callee tracing
precise dependency chain
precise blast radius
symbol-level impact analysis
```

Then architecture becomes:

```text
Fovea
→ broad contextual awareness

Local CodeGraph
→ precise structural query
```

Do not install it preemptively.

---

# 27. Step 9 — Switch Default Repo-Awareness Layer

After pilots pass:

```text
Fovea = default
Memgraph-backed graph = deprecated
```

Update any graph-specific prompt wording.

Do not touch unrelated Pi functionality.

---

# 28. Step 10 — Disable Memgraph

Only after successful validation.

Disable:

```text
Memgraph container/service
startup hooks
unused graph processes
```

Observe system for a period before deleting volumes.

Do not run destructive generic commands.

---

# 29. Step 11 — Remove Old `pi-code-graph`

After confidence period:

- uninstall old extension,
- remove unused Memgraph config,
- optionally remove data volumes.

Keep backups until migration is considered final.

---

# 30. Rollback Plan

If Fovea is insufficient:

```text
restore AGENTS/prompts backups
re-enable pi-code-graph
restart Memgraph
```

Existing `docs/codebase/*.md` remain reusable.

No codebase knowledge should be lost.

---

# 31. Resource Expectations

Expected after migration:

```text
lower idle RAM
fewer containers/services
lower ops complexity
bounded context
no graph DB maintenance
```

Fovea still has indexing/context cost, but no always-on Memgraph service.

---

# 32. Existing Pi Setup Must Remain Synchronized

Do not modify:

```text
frontend-design workflow
vision reviewer flow
vision anti-loop budget
permission gate
protected paths
failure budget
model escalation rules
/execute core behavior
/fix core behavior
/review core behavior
```

This migration only changes:

```text
codebase-awareness backend/layer
```

---

# 33. Final Integration Map

```text
                    ChatGPT
             Think / Design / Plan
                      │
                      ▼
                     Pi
                      │
              DeepSeek V4 Flash
                      │
      ┌───────────────┼───────────────┐
      │               │               │
    Fovea      frontend-design      Vision
 repo context       UI skill       reviewer
      │
 codebase-study
      │
docs/codebase/*.md
      │
      ▼
 source code
```

---

# 34. Acceptance Criteria

- **AC-1:** Fovea installed and loads successfully.
- **AC-2:** Fovea uses conservative context budget.
- **AC-3:** `/study-codebase` works through Fovea-assisted navigation.
- **AC-4:** `/refresh-codebase-docs` remains incremental.
- **AC-5:** Existing modular docs preserved.
- **AC-6:** Existing Pi workflows preserved.
- **AC-7:** Large repo orientation remains useful.
- **AC-8:** No context explosion.
- **AC-9:** No Memgraph dependency in normal operation.
- **AC-10:** DeepSeek remains primary executor.
- **AC-11:** Source remains source of truth.
- **AC-12:** Local CodeGraph remains optional, not installed by default.
- **AC-13:** VPS operational complexity decreases.
- **AC-14:** Migration remains reversible until cleanup completes.

---

# 35. Definition of Done

Migration complete when:

- [ ] Existing Memgraph setup audited.
- [ ] Relevant config backed up.
- [ ] Pi Fovea installed.
- [ ] Conservative Fovea config applied.
- [ ] Fovea sketch/focus works.
- [ ] `codebase-study` merged minimally.
- [ ] AGENTS.md merged minimally.
- [ ] `/study-codebase` uses Fovea effectively.
- [ ] `/refresh-codebase-docs` remains incremental.
- [ ] Existing docs preserved.
- [ ] Medium repo test PASS.
- [ ] Large repo test PASS.
- [ ] Follow-up session test PASS.
- [ ] Normal coding task test PASS.
- [ ] No context bloat observed.
- [ ] Memgraph disabled.
- [ ] Old extension removed only after confidence.
- [ ] Rollback procedure documented.

---

# 36. Implementation Order

```text
1. Audit current Memgraph/pi-code-graph setup
2. Backup relevant global config
3. Install Pi Fovea
4. Verify Fovea compatibility
5. Apply conservative Fovea config
6. Test Fovea sketch/focus on pilot repo
7. Update codebase-study wording
8. Update global AGENTS.md minimally
9. Update /study-codebase
10. Update /refresh-codebase-docs
11. Test medium repo
12. Test large repo
13. Test follow-up session
14. Test normal coding task
15. Compare context/token behavior
16. Make Fovea default
17. Disable Memgraph
18. Observe
19. Remove old graph stack only after confidence
```

---

# 37. Anti-Over-Engineering Guard

Do NOT add now:

```text
Local CodeGraph
tree-sitter extension
vector DB
RAG server
code intelligence all-in-one suite
multi-agent repo analysts
automatic UML system
central knowledge service
```

Unless real usage proves a gap.

---

# 38. Final Decision

Use:

```text
Pi Fovea
+
codebase-study
+
docs/codebase/*.md
```

as the default codebase-understanding stack.

Keep:

```text
Local CodeGraph
```

as a future precision tool only if exact structural graph queries become necessary.

---

# 39. Final Principle

> **Fovea provides lightweight current awareness.**

> **codebase-study provides systematic learning.**

> **Markdown docs preserve knowledge across sessions.**

> **source code remains the final truth.**

The migration should simplify the system, not introduce a new layer of complexity.
