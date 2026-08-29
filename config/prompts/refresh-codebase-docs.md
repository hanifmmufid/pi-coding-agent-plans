---
description: Incrementally refresh docs/codebase documentation after code changes
argument-hint: [optional description of what changed]
---

Refresh the codebase documentation incrementally.

Change context: $@

Do NOT regenerate the full knowledge base by default.

## Process

1. Determine what changed:
   - inspect `git status` and `git diff --stat`,
   - identify the changed files/areas.
2. Use Fovea impact/focus if helpful to identify what the change touches across the codebase.
3. Map each changed area to the affected codebase docs:
   - architecture / modules / data-flow / security / infrastructure / data-model / performance / testing / deployment / failure-handling / integrations,
   - auth changes → security.md (+ data-flow.md if request paths change),
   - schema/migration changes → data-model.md,
   - infrastructure/CI/Docker changes → infrastructure.md + deployment.md,
   - test changes → testing.md,
   - queue/job changes → data-flow.md + failure-handling.md.
4. Inspect only the relevant code to confirm what actually changed (do not re-read the whole repo).
5. Update only the affected documentation sections.
6. Update `docs/codebase/README.md` only if the doc set or index changed.
7. Update freshness metadata:
   ```
   Last verified: YYYY-MM-DD
   Repository revision: <git commit hash>
   ```
8. Do not touch unrelated docs.

Do not run a full repository study.

## Rules

- Source code is the source of truth. If docs conflict with current source, update the docs to match source.
- If the change is trivial (comments, formatting, no behavior change), no doc update is needed — state that.
- If a change affects a pattern documented in `engineering-lessons.md`, update the lesson entry.

## Final Report

## Refresh Status
UPDATED / NO_UPDATE_NEEDED / PARTIAL

## Changed Areas
- ...

## Docs Updated
- ...

## Docs Intentionally NOT Updated
- ... (reason)
