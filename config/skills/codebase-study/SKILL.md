---
name: codebase-study
description: Systematically understand a new or large repository — progressive reconnaissance, architecture mapping, targeted deep dives, and modular persistent documentation under docs/codebase. Use when entering a new repository, studying a mature codebase, preparing architecture-sensitive work, or refreshing codebase docs after major changes.
---

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
- Use the available repository-awareness tooling to understand the codebase progressively.

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

If Fovea is unavailable, use rg/fd/grep/tree for targeted navigation.

- Deep-dive only into representative and high-impact paths.
- Separate facts from interpretation.
- Persist findings under `docs/codebase/`.
- Source code remains the source of truth.
- If documentation conflicts with current source, trust current source and update documentation.

## Token Discipline

1. Do not `cat` the entire repository.
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

## Source-of-Truth Priority

```
current source code
> current config
> tests
> repository docs
> generated codebase docs
```

If generated docs conflict with source:
- source wins,
- update docs.

## Depth Modes

### QUICK_RECON
For fast orientation:
- repo overview,
- stack,
- main modules,
- entrypoints,
- architecture hypothesis.

### STANDARD_STUDY (default)
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

## Facts vs Lessons

Factual docs (`architecture.md`, `security.md`, `infrastructure.md`, `data-model.md`) use labels:
- `Observed:`
- `Evidence:`

`engineering-lessons.md` contains:
- interpretation,
- reusable patterns,
- trade-offs,
- recommendations.

## Freshness Metadata

Each document includes:

```
Last verified: YYYY-MM-DD
Repository revision: <git commit hash if available>
```
