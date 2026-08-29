---
description: Systematic, token-efficient codebase understanding with modular persistent documentation
argument-hint: [optional repo path | optional depth: QUICK_RECON|STANDARD_STUDY|DEEP_DIVE]
---

Study this codebase systematically and efficiently.

Repo path: $1
Depth mode: $2 (default STANDARD_STUDY; use QUICK_RECON for fast orientation, DEEP_DIVE only when explicitly requested)

Load and apply the `codebase-study` skill first.

## Process

Proceed phase by phase. Do not read the entire repository.

### Phase 1 — Repository Reconnaissance
Inspect (cheap, high-signal):
- top-level tree (`ls`/`tree` limited depth),
- README,
- manifests (package.json, pyproject.toml, go.mod, Cargo.toml, etc.),
- lock files (skim only),
- Docker/compose/k8s,
- CI config,
- env/config templates (do NOT read real secrets),
- entrypoints,
- tests,
- docs,
- scripts.

Output (before going deeper):
- repo type,
- main stack,
- major modules,
- runtime model,
- deployment clues.

### Phase 2 — Architecture Mapping
Identify:
- application/module/service boundaries,
- monolith / modular-monolith / microservice shape,
- sync vs async flows,
- internal APIs,
- external integrations.

Persist:
- `docs/codebase/architecture.md`
- `docs/codebase/modules.md`

### Phase 3 — Runtime / Request Flow
Trace representative flows:
request → routing → auth → service → domain logic → persistence → response.
Also inspect background jobs, events, queues, scheduled work.

Persist:
- `docs/codebase/data-flow.md`

### Phase 4 — Security
Study: authentication, authorization, role/permission model, secrets handling, input validation, tenancy/isolation, audit logging, rate limiting, CSRF/XSS/SQL injection protections, secure defaults, dependency security.

Persist:
- `docs/codebase/security.md`

### Phase 5 — Infrastructure
Study: Docker, Kubernetes, IaC, reverse proxy, service discovery, caching, queue/broker, observability, scaling, environment config, deployment topology.

Persist:
- `docs/codebase/infrastructure.md`

### Phase 6 — Data & Persistence
Study: database technology, schema organization, migrations, repositories/data access, transaction boundaries, indexing, caching, consistency model, idempotency, retry patterns.

Persist:
- `docs/codebase/data-model.md`

### Phase 7 — Performance & Scalability
Study: query patterns, N+1 prevention, indexes, caching, batch processing, pagination, concurrency, worker model, rate limiting, horizontal scaling, hot paths.

Persist:
- `docs/codebase/performance.md`

### Phase 8 — Testing & Reliability
Study: unit/integration/E2E tests, fixtures, mocks, CI gates, retry policies, fault tolerance, graceful degradation, timeout handling, circuit breakers.

Persist:
- `docs/codebase/testing.md`
- `docs/codebase/failure-handling.md`

### Phase 9 — Deployment / Operations
Study: release process, migrations, rollbacks, feature flags, blue-green/canary, zero-downtime, health checks, readiness/liveness, logs/metrics/tracing.

Persist:
- `docs/codebase/deployment.md`

### Phase 10 — Engineering Lessons
Persist:
- `docs/codebase/engineering-lessons.md`

Format per pattern:

```
## Pattern: <name>
Observed in: ...
Why it exists: ...
Benefits: ...
Trade-offs: ...
When to reuse: ...
When not to reuse: ...
```

## Documentation Rules

- Create modular docs under `docs/codebase/` — do NOT create one giant CODEBASE.md.
- Create/update `docs/codebase/README.md` as the navigation index.
- Use `Observed:` / `Evidence:` labels in factual docs, with source references (file paths).
- Include freshness metadata in each doc:
  ```
  Last verified: YYYY-MM-DD
  Repository revision: <git commit hash>
  ```
- Separate facts from interpretation (lessons go in engineering-lessons.md).

## Efficiency Rules

- Obtain a lightweight repository sketch first (Fovea sketch).
- Identify major modules/boundaries from the sketch.
- Focus only on relevant areas for each study phase (Fovea focus/dwell).
- Use Fovea impact when assessing likely change/blast-radius areas.
- If Fovea is unavailable, use rg/fd/grep/tree for targeted navigation.
- Do not `cat` entire files when a targeted search suffices.
- Skip node_modules, vendor, build, dist, .git, binaries, generated artifacts.
- Read representative source files; verify findings against source.
- Stop once enough evidence exists.
- For DEEP_DIVE, focus only on the explicitly requested area.

## Final Report

Return:

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
