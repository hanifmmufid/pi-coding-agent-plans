# Improvement Plan — Fast, Comprehensive Codebase Understanding for Pi

**Version:** 1.0  
**Scope:** Global Pi configuration + reusable codebase-study workflow  
**Goal:** Membuat Pi mampu memahami repo baru, termasuk repo besar/enterprise, secara cepat, komprehensif, dan hemat context/token; lalu menyimpan hasil pemahaman sebagai dokumentasi modular yang bisa digunakan kembali di session berikutnya.

## 1. Objective

Tambahkan workflow global agar Pi dapat:

1. melakukan reconnaissance repo secara sistematis,
2. memahami arsitektur tanpa membaca semua file mentah ke context,
3. memakai code graph/repo mapping untuk navigasi,
4. membuat dokumentasi persistent yang ringan,
5. membedakan fakta repo, interpretasi, dan engineering lessons,
6. menggunakan dokumentasi itu sebagai orientation layer di session berikutnya,
7. tetap memverifikasi source code sebagai source of truth,
8. memperbarui dokumentasi secara incremental,
9. mendukung studi architecture, security, infrastructure, data flow, persistence, performance, testing, deployment, failure handling, dan engineering patterns.

## 2. Core Principle

Jangan gunakan pola:

```text
repo besar
→ baca semua file
→ masukkan semua ke context
→ mahal dan berat
```

Gunakan:

```text
repo besar
→ map structure
→ identify boundaries
→ inspect entrypoints
→ query relevant graph
→ deep dive bertahap
→ persist findings
```

Prinsip:

> **Index once, understand progressively, document persistently, verify source when needed.**

## 3. Target Architecture

```text
GLOBAL PI
│
├── codebase-study skill
├── study-codebase prompt
├── refresh-codebase-docs prompt
├── code graph / repo mapping extension
└── global AGENTS.md guidance
        │
        ▼
PROJECT / REPOSITORY
│
├── AGENTS.md
├── docs/
│   └── codebase/
│       ├── README.md
│       ├── architecture.md
│       ├── modules.md
│       ├── data-flow.md
│       ├── security.md
│       ├── infrastructure.md
│       ├── data-model.md
│       ├── performance.md
│       ├── integrations.md
│       ├── testing.md
│       ├── deployment.md
│       ├── failure-handling.md
│       └── engineering-lessons.md
└── source code
```

## 4. Frozen Requirements

1. Workflow harus global dan reusable.
2. Existing Pi config tidak boleh diganti total.
3. Existing `AGENTS.md`, `/execute`, `/fix`, `/review`, skills, profiles, safety extensions tetap utuh.
4. Codebase study adalah capability tambahan.
5. Jangan load seluruh repo ke context.
6. Gunakan progressive inspection.
7. Dokumentasi harus modular.
8. `AGENTS.md` tidak boleh menjadi tempat menyimpan seluruh arsitektur.
9. Source code tetap source of truth.
10. Dokumentasi hanya navigation/knowledge aid.
11. Fakta dan engineering lesson harus dipisahkan.
12. Update dokumentasi harus incremental.
13. Hindari over-engineering seperti vector DB/RAG server di V1.
14. Tidak menggunakan subagent swarm secara default.
15. Token efficiency adalah requirement utama.

## 5. Out of Scope

Tidak termasuk:
- external vector database,
- dedicated RAG server,
- embeddings pipeline kompleks,
- multi-agent architecture reviewers,
- full static-analysis platform,
- automatic documentation CI,
- exhaustive line-by-line documentation seluruh repo.

## 6. Step 1 — Install Code Graph / Repository Mapping Capability

Preferred V1:

```bash
pi install npm:pi-code-graph
```

Tujuan:
- map symbol relationship,
- dependency,
- caller/callee,
- file/module relationship,
- membantu Pi memahami repo tanpa membaca semua file sekaligus.

Validation:
- extension berhasil load,
- query sederhana bekerja,
- Pi dapat menemukan relationship lintas file.

## 7. Optional Alternative — Foveated Repo Mapping

Jika `pi-code-graph` belum cukup, evaluasi `pi-fovea`.

Decision rule:

```text
start with pi-code-graph
→ evaluate
→ add pi-fovea only if needed
```

Jangan pasang dua tool overlap di awal.

## 8. Step 2 — Create Global `codebase-study` Skill

Create:

```text
~/.pi/agent/skills/codebase-study/SKILL.md
```

Recommended rules:

```md
# Codebase Study Skill

Use this skill when:
- entering a new repository,
- studying a mature/open-source/enterprise codebase,
- preparing architecture-sensitive work,
- creating persistent codebase documentation,
- refreshing understanding after major repository changes.

## Rules

- Do not read the entire repository blindly.
- Start with repository structure, manifests, docs, entrypoints, config, CI, deployment, and tests.
- Build hypotheses before deep-diving.
- Use code graph/repository search to verify relationships.
- Deep-dive only into representative and high-impact paths.
- Separate facts from interpretation.
- Persist findings under `docs/codebase/`.
- Source code remains the source of truth.
- If documentation conflicts with current source, trust current source and update documentation.
```

## 9. Codebase Study Phases

### Phase 1 — Repository Reconnaissance

Inspect:
- top-level tree,
- README,
- manifests,
- lock files,
- Docker/compose/k8s,
- CI,
- env/config templates,
- entrypoints,
- tests,
- docs,
- scripts.

Output:
- repo type,
- main stack,
- major modules,
- runtime model,
- deployment clues.

### Phase 2 — Architecture Mapping

Identify:
- application boundaries,
- module boundaries,
- service boundaries,
- monolith/modular-monolith/microservice shape,
- sync vs async flows,
- internal APIs,
- external integrations.

Persist:
- `docs/codebase/architecture.md`
- `docs/codebase/modules.md`

### Phase 3 — Runtime / Request Flow

Trace representative flows:

```text
request
→ routing
→ auth
→ service
→ domain/business logic
→ persistence
→ response
```

Also inspect background jobs, events, queues, and scheduled work.

Persist:
- `docs/codebase/data-flow.md`

### Phase 4 — Security

Study:
- authentication,
- authorization,
- role/permission model,
- secrets handling,
- input validation,
- tenancy/isolation,
- audit logging,
- rate limiting,
- CSRF/XSS/SQL injection protections,
- secure defaults,
- dependency/security practices.

Persist:
- `docs/codebase/security.md`

### Phase 5 — Infrastructure

Study:
- Docker,
- Kubernetes,
- IaC,
- reverse proxy,
- service discovery,
- caching,
- queue/broker,
- observability,
- scaling strategy,
- environment configuration,
- deployment topology.

Persist:
- `docs/codebase/infrastructure.md`

### Phase 6 — Data & Persistence

Study:
- database technology,
- schema organization,
- migrations,
- repositories/data access,
- transaction boundaries,
- indexing,
- caching,
- consistency model,
- idempotency,
- retry patterns.

Persist:
- `docs/codebase/data-model.md`

### Phase 7 — Performance & Scalability

Study:
- query patterns,
- N+1 prevention,
- indexes,
- caching,
- batch processing,
- pagination,
- concurrency,
- worker model,
- rate limiting,
- horizontal scaling,
- hot-path optimization.

Persist:
- `docs/codebase/performance.md`

### Phase 8 — Testing & Reliability

Study:
- unit tests,
- integration tests,
- E2E tests,
- fixtures,
- mocks,
- CI gates,
- retry policies,
- fault tolerance,
- graceful degradation,
- timeout handling,
- circuit breakers.

Persist:
- `docs/codebase/testing.md`
- `docs/codebase/failure-handling.md`

### Phase 9 — Deployment / Operations

Study:
- release process,
- migrations,
- rollbacks,
- feature flags,
- blue-green/canary,
- zero-downtime techniques,
- health checks,
- readiness/liveness,
- logs/metrics/tracing.

Persist:
- `docs/codebase/deployment.md`

### Phase 10 — Engineering Lessons

Persist:
- `docs/codebase/engineering-lessons.md`

Recommended format:

```md
## Pattern: ...

Observed in:
- ...

Why it exists:
- ...

Benefits:
- ...

Trade-offs:
- ...

When to reuse:
- ...

When not to reuse:
- ...
```

## 10. Step 3 — Create Modular Documentation Structure

Use:

```text
docs/codebase/
├── README.md
├── architecture.md
├── modules.md
├── data-flow.md
├── security.md
├── infrastructure.md
├── data-model.md
├── performance.md
├── integrations.md
├── testing.md
├── deployment.md
├── failure-handling.md
└── engineering-lessons.md
```

Do NOT create one giant `CODEBASE.md`.

## 11. `docs/codebase/README.md`

Purpose:
- navigation index,
- quick repo orientation,
- document freshness.

Example:

```md
# Codebase Knowledge Map

## Quick Overview
...

## Architecture
See: architecture.md

## Security
See: security.md

## Infrastructure
See: infrastructure.md

## Performance
See: performance.md

## Engineering Lessons
See: engineering-lessons.md
```

## 12. Facts vs Lessons Separation

Factual docs:
- `architecture.md`
- `security.md`
- `infrastructure.md`
- `data-model.md`

Use labels such as:

```text
Observed:
Evidence:
```

`engineering-lessons.md` contains:
- interpretation,
- reusable patterns,
- trade-offs,
- recommendations.

## 13. Evidence Requirement

Important claims should include source references.

Example:

```md
## Authentication

Observed:
JWT authentication is handled in ...

Evidence:
- src/auth/...
- middleware/...
- config/...
```

## 14. Freshness Metadata

Each document should include:

```md
Last verified:
YYYY-MM-DD

Repository revision:
<git commit hash if available>
```

Optional:

```md
Primary evidence:
- ...
```

## 15. Step 4 — Update Global AGENTS.md

Do not replace existing content. Merge:

```md
## Codebase Knowledge Workflow

When working in a large or unfamiliar repository:

- prefer progressive codebase reconnaissance over reading the entire repository,
- use available code graph/repository mapping tools to identify relevant areas,
- consult `docs/codebase/README.md` and only the relevant codebase documents when available,
- verify important assumptions against current source code,
- treat codebase documentation as a navigation aid, not the source of truth,
- update affected documentation after architecture-significant changes.

Do not load all `docs/codebase/*` files unless the task genuinely requires them.
```

## 16. Step 5 — Create `/study-codebase`

Create:

```text
~/.pi/agent/prompts/study-codebase.md
```

Expected flow:

```text
recon
→ architecture map
→ representative deep dives
→ security
→ infrastructure
→ persistence
→ performance
→ testing
→ deployment
→ engineering lessons
→ write docs
```

Prompt must instruct Pi to:
- proceed phase-by-phase,
- avoid blind exhaustive reads,
- use code graph,
- cite evidence,
- write modular docs,
- report unknowns explicitly.

## 17. Step 6 — Create `/refresh-codebase-docs`

Create:

```text
~/.pi/agent/prompts/refresh-codebase-docs.md
```

Workflow:

```text
git diff / changed areas
→ identify affected docs
→ inspect only relevant code
→ update only affected documentation
```

Do not regenerate full knowledge base by default.

## 18. Incremental Update Rule

Example:

```text
auth middleware changed
→ update security.md
→ maybe data-flow.md
```

Do not touch unrelated docs unless needed.

## 19. Codebase Study Depth Modes

### QUICK_RECON
For fast orientation:
- repo overview,
- stack,
- main modules,
- entrypoints,
- architecture hypothesis.

### STANDARD_STUDY
Default:
- architecture,
- data flow,
- security,
- infrastructure,
- persistence,
- performance,
- testing,
- deployment,
- lessons.

### DEEP_DIVE
Only when explicitly requested:
- security deep dive,
- query optimization,
- event architecture,
- deployment reliability, etc.

## 20. Token Discipline

Rules:

1. Do not `cat` entire repository.
2. Do not read generated/vendor directories.
3. Skip by default:
   - node_modules,
   - vendor,
   - build,
   - dist,
   - .git,
   - binaries,
   - generated artifacts.
4. Read representative files.
5. Use graph/search for relationships.
6. Load docs on demand.
7. Summarize findings before deeper traversal.
8. Stop once enough evidence exists.

## 21. Source-of-Truth Rule

Priority:

```text
current source code
> current config
> tests
> repository docs
> generated codebase docs
```

If generated docs conflict with source:

```text
source wins
→ update docs
```

## 22. Study Report

After `/study-codebase`:

```md
## Codebase Study Status
COMPLETE / PARTIAL / BLOCKED

## Repository Type
...

## Main Architecture
...

## Main Modules
...

## Security Model
...

## Infrastructure
...

## Data Layer
...

## Performance Patterns
...

## Testing Strategy
...

## Key Engineering Lessons
...

## Documentation Created
- ...

## Unknown / Needs Deep Dive
- ...
```

## 23. Enterprise Repo Learning Focus

Prioritize:
- how boundaries are enforced,
- how failures are handled,
- how auth is designed,
- how secrets are managed,
- how migrations are done,
- how deployment avoids downtime,
- how queues/jobs are structured,
- how data consistency is maintained,
- how queries are optimized,
- how observability is implemented,
- how tests protect architecture,
- how teams prevent accidental coupling.

## 24. Reusable Pattern Catalog

Optional later:

```text
docs/codebase/patterns/
```

Examples:
- async-job-isolation.md
- transaction-boundary.md
- idempotency.md
- retry-strategy.md
- cache-invalidation.md
- zero-downtime-migration.md

Do not create this in V1 unless useful patterns naturally emerge.

## 25. Validation Scenarios

### Scenario A — Medium Repo
Run:

```text
/study-codebase
```

Expected:
- docs generated,
- no full repo read,
- evidence included,
- architecture understandable.

### Scenario B — Large Enterprise Repo
Expected:
- progressive reconnaissance,
- graph-assisted navigation,
- modular docs,
- no context explosion.

### Scenario C — Follow-up Question

Ask:

```text
How does authentication work?
```

Expected:

```text
read security.md
→ verify current source
→ answer
```

No full re-study.

### Scenario D — Code Change

Run:

```text
/refresh-codebase-docs
```

Expected:
- only affected docs updated,
- unrelated docs untouched.

## 26. Acceptance Criteria

- **AC-1:** Global `codebase-study` skill exists.
- **AC-2:** Code graph capability works.
- **AC-3:** `/study-codebase` works.
- **AC-4:** `/refresh-codebase-docs` works.
- **AC-5:** Documentation is modular.
- **AC-6:** Existing Pi flow remains intact.
- **AC-7:** AGENTS.md stays small.
- **AC-8:** Docs are loaded on demand.
- **AC-9:** Source remains authoritative.
- **AC-10:** Facts and lessons are separated.
- **AC-11:** Evidence is recorded.
- **AC-12:** Incremental update works.
- **AC-13:** Large repo study does not require loading all files.
- **AC-14:** Token/context usage remains controlled.
- **AC-15:** Engineering lessons are reusable.

## 27. Definition of Done

Implementation is complete when:

- [ ] `pi-code-graph` installed and verified.
- [ ] `codebase-study` skill created.
- [ ] `/study-codebase` created.
- [ ] `/refresh-codebase-docs` created.
- [ ] global `AGENTS.md` merged safely.
- [ ] existing skills/prompts/safety config preserved.
- [ ] medium repo test passes.
- [ ] large repo test passes.
- [ ] modular docs generated.
- [ ] follow-up query uses docs + source verification.
- [ ] incremental refresh works.
- [ ] no giant CODEBASE.md created.
- [ ] no unnecessary repo-wide rereads.

## 28. Implementation Order

```text
1. Inspect current global Pi config
2. Backup relevant global files
3. Install pi-code-graph
4. Verify graph queries
5. Create codebase-study skill
6. Create /study-codebase
7. Create /refresh-codebase-docs
8. Merge codebase knowledge rule into global AGENTS.md
9. Reload Pi
10. Test on medium repo
11. Test on large repo
12. Inspect generated docs
13. Test follow-up architecture question
14. Test incremental refresh
15. Measure context/token usage
16. Refine only if real bottleneck appears
```

## 29. Anti-Over-Engineering Guard

Do NOT add yet:

```text
vector DB
external RAG
embedding service
multi-agent repo analysts
full documentation CI
multiple graph engines
automatic UML generation
knowledge database server
```

V1:

```text
Pi
+
code graph
+
codebase-study skill
+
modular markdown docs
```

## 30. Final Architecture

```text
NEW REPO
   ↓
/study-codebase
   ↓
repo reconnaissance
   ↓
code graph / search
   ↓
targeted deep dives
   ↓
docs/codebase/*.md
   ↓
future sessions
   ↓
read relevant docs only
   ↓
verify current source
   ↓
implement / learn / design
```

## 31. Final Principle

> **Pi should not relearn a large repository from zero every session.**

Instead:

> **Map it once, document it well, refresh incrementally, and verify source when needed.**

This creates a lightweight but comprehensive knowledge layer for studying mature, production-level, and enterprise-grade repositories.
