# PI Coding Executor Setup Blueprint
## Untuk Fix Code, Bug/Issue, dan Eksekusi Implementation Plan secara Autonomous

**Versi:** 1.0  
**Target environment:** VPS Linux  
**Struktur project:** `/my-project/<nama-project>`  
**Default execution model:** DeepSeek V4 Flash  
**Peran utama Pi:** executor — inspect → implement → validate → diagnose → fix → validate → review → DONE/BLOCKED

---

# 1. Tujuan Setup

Setup ini dirancang untuk workflow berikut:

1. Requirement, diskusi, arsitektur, keputusan, dan implementation plan dibuat terlebih dahulu.
2. Pi menerima bug/fix request atau implementation plan yang sudah cukup jelas.
3. Pi membaca codebase dan memverifikasi asumsi sebelum melakukan perubahan.
4. Pi membuat perubahan sekecil mungkin yang benar.
5. Pi melakukan targeted validation.
6. Jika validation gagal, Pi melakukan diagnosis terlebih dahulu.
7. Pi melakukan corrective fix lalu validation ulang.
8. Loop dilanjutkan sampai acceptance criteria terpenuhi.
9. Pi melakukan final `git diff` review sebelum menyatakan selesai.
10. Jika menemui conflict, ambiguity penting, atau failure yang tidak terselesaikan, Pi berhenti dengan status `BLOCKED`, bukan mengarang solusi.

Target utamanya:

> **akurasi tinggi, autonomous loop yang disiplin, jumlah loop sedikit, context efisien, dan cost rendah.**

---

# 2. Pembagian Peran

## ChatGPT / Planner

Digunakan untuk:

- diskusi requirement,
- memahami masalah bisnis,
- eksplorasi alternatif,
- architecture/design,
- freeze keputusan,
- menyusun implementation plan,
- menentukan acceptance criteria,
- menentukan validation plan.

## Pi

Digunakan untuk:

- membaca repository,
- mencari root cause,
- mapping implementation plan ke codebase,
- mengedit file,
- menjalankan command,
- targeted testing,
- memperbaiki hasil yang gagal,
- validation loop,
- final diff review,
- menghasilkan laporan DONE/BLOCKED.

Workflow:

```text
Requirement / Plan
        ↓
       Pi
        ↓
Inspect repository
        ↓
Confirm root cause / implementation mapping
        ↓
Implement
        ↓
Targeted validation
        ↓
    PASS?
   /     \
 NO       YES
 ↓         ↓
Diagnose   Acceptance check
 ↓         ↓
Fix        Final diff review
 ↓         ↓
Validate   Adversarial self-review
  └──────→ DONE
```

---

# 3. Prinsip Utama

## 3.1 Root cause before edit

Untuk bug/issue:

```text
Investigate
→ hypothesis
→ evidence
→ confidence sufficient
→ edit
```

Jangan:

```text
Guess
→ edit
→ test
→ random edit
→ test
```

## 3.2 Smallest correct change

Pi harus mengutamakan:

- perubahan minimum,
- mengikuti pattern existing,
- tidak refactor unrelated code,
- tidak memperluas scope tanpa kebutuhan.

## 3.3 Validation-driven completion

Kode berhasil ditulis **bukan berarti task selesai**.

DONE hanya jika:

- behavior yang diminta terpenuhi,
- targeted validation pass,
- acceptance criteria pass,
- final diff sudah direview,
- tidak ada unresolved error,
- tidak ada perubahan di luar scope.

## 3.4 Failure budget

Batas yang direkomendasikan:

> Maksimal **3 corrective attempt untuk failure class yang sama**.

Bukan 3 loop untuk seluruh task.

Contoh:

```text
XML parse failure:
attempt 1
attempt 2
attempt 3
→ masih gagal
→ BLOCKED / ESCALATE
```

Task besar tetap boleh mempunyai beberapa failure class yang berbeda.

## 3.5 Escalate instead of guessing

Pi harus berhenti jika:

- implementation plan bertentangan dengan codebase aktual,
- business logic ambigu dan berdampak besar,
- dependency penting tidak tersedia,
- environment tidak memungkinkan validation,
- failure class yang sama tetap gagal setelah failure budget.

---

# 4. Struktur VPS

Contoh:

```text
/my-project/
├── kammi-odoo/
├── ai-business/
├── internal-tools/
└── other-project/
```

**Jalankan Pi dari root repository yang sedang dikerjakan.**

Benar:

```bash
cd /my-project/kammi-odoo
pi
```

Hindari:

```bash
cd /my-project
pi
```

jika Pi hanya perlu mengerjakan satu repository.

Tujuannya:

- membatasi search scope,
- mengurangi context,
- mengurangi risiko edit repo lain,
- membuat tool execution lebih predictable.

---

# 5. Struktur Global Pi

Pi menggunakan konfigurasi user di:

```text
~/.pi/agent/
```

Jika VPS dijalankan sebagai `root`, biasanya menjadi:

```text
/root/.pi/agent/
```

Struktur yang direkomendasikan:

```text
~/.pi/agent/
├── AGENTS.md
├── prompts/
│   ├── execute.md
│   ├── fix.md
│   └── review.md
├── extensions/
│   ├── permission-gate.ts
│   └── protected-paths.ts
└── auth.json
```

Provider/model tambahan yang menggunakan API compatible dapat dikonfigurasi melalui:

```text
~/.pi/agent/models.json
```

bila diperlukan.

---

# 6. Struktur Setiap Project

Contoh:

```text
/my-project/kammi-odoo/
├── AGENTS.md
├── .pi/
│   ├── prompts/
│   └── extensions/
├── ai/
│   ├── plans/
│   ├── decisions/
│   └── reports/
├── addons/
├── docker/
└── ...
```

Direkomendasikan:

```text
ai/plans/
```

untuk implementation plan.

Contoh:

```text
ai/plans/fix-dashboard-filter.md
ai/plans/mentoring-module-v2.md
ai/plans/stock-reconciliation-fix.md
```

Jangan menimpa satu `IMPLEMENTATION_PLAN.md` terus-menerus jika banyak task paralel.

---

# 7. Install Pi

Pilihan npm:

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
```

Atau gunakan installer resmi Pi sesuai dokumentasi resmi.

Cek:

```bash
pi --version
```

Update:

```bash
pi update --self
```

---

# 8. DeepSeek V4 Flash

Pi memiliki built-in DeepSeek provider.

Gunakan environment variable:

```bash
export DEEPSEEK_API_KEY="YOUR_KEY"
```

Untuk persist:

```bash
nano ~/.bashrc
```

Tambahkan:

```bash
export DEEPSEEK_API_KEY="YOUR_KEY"
```

Kemudian:

```bash
source ~/.bashrc
```

Alternatifnya gunakan:

```text
/login
```

dari Pi dan pilih DeepSeek.

Setelah Pi dibuka:

```text
/model
```

lalu pilih DeepSeek V4 Flash.

> Jangan simpan API key di `AGENTS.md`, repository, `.pi/`, atau file yang ikut Git.

---

# 9. Global AGENTS.md

Buat:

```bash
mkdir -p ~/.pi/agent
nano ~/.pi/agent/AGENTS.md
```

Isi yang direkomendasikan:

```md
# Global Engineering Execution Rules

## Core Behavior

- Inspect the existing implementation before editing.
- Understand the relevant code path before making changes.
- For bugs, identify a root-cause hypothesis and supporting evidence before editing.
- For implementation plans, verify that the plan maps correctly to the actual repository before execution.
- Prefer the smallest correct change.
- Follow existing project architecture, conventions, naming, and patterns.
- Do not refactor unrelated code.
- Do not expand scope unless required to satisfy the requested behavior.
- Never silently change frozen requirements.

## Investigation

Before editing a bug:
1. Locate the relevant code.
2. Trace the actual execution/data flow.
3. Form a root-cause hypothesis.
4. Collect evidence that supports or disproves it.
5. If confidence is low, investigate further before editing.

Do not use code edits as a substitute for diagnosis.

## Implementation

- Make the smallest change that satisfies the requirement.
- Preserve backward compatibility unless the task explicitly requires otherwise.
- Reuse existing abstractions before creating new ones.
- Avoid speculative cleanup.
- Avoid unrelated formatting changes.
- Do not modify files outside the task scope without a concrete reason.

## Validation Loop

After implementation:
1. Run the most targeted relevant validation first.
2. If validation passes, continue to acceptance verification.
3. If validation fails, diagnose the failure before making another edit.
4. State or internally establish a new hypothesis based on the failure evidence.
5. Make the smallest corrective change.
6. Re-run only the relevant validation first.
7. Do not repeat the same failed approach without new evidence.

Maximum corrective attempts for the same failure class: 3.

If the same failure class remains unresolved after 3 evidence-driven corrective attempts:
- stop,
- mark the task BLOCKED,
- report evidence,
- report attempted fixes,
- report the suspected blocker.

## Completion Gate

A task is DONE only when all applicable conditions are true:

- requested behavior is implemented,
- targeted validation passes,
- acceptance criteria pass,
- final git diff has been reviewed,
- no unresolved errors remain,
- no unintended or unrelated changes remain,
- no known requirement is left incomplete.

Never declare DONE only because code was written.

## Final Review

Before declaring DONE:

1. Review `git diff`.
2. Re-read the request or implementation plan.
3. Verify each acceptance criterion.
4. Check for scope creep.
5. Check likely edge cases.
6. Check for accidental behavior changes.
7. Check that temporary/debug code was removed.
8. Check that validation evidence supports the final conclusion.

Perform an adversarial self-review:
"Assume this implementation may still be wrong. What is the most likely remaining defect?"

If a credible issue is found, resolve or report it before DONE.

## Escalation

Stop and report instead of guessing when:

- the requested behavior is materially ambiguous,
- the implementation plan conflicts with the actual codebase,
- required information is missing,
- a dependency/environment prevents meaningful validation,
- solving the issue requires changing a frozen business rule,
- repeated failure indicates that the current root-cause hypothesis is wrong.

## Testing

- Prefer targeted validation.
- Run the cheapest meaningful validation first.
- Escalate validation depth as needed.
- Do not run a full regression suite unless explicitly requested or clearly necessary for a high-risk change.

## Git

- Inspect `git status` before major work.
- Review `git diff` before completion.
- Do not force push.
- Do not rewrite shared history.
- Do not reset or delete unrelated user changes.
```

Setelah update:

```text
/reload
```

atau restart Pi.

---

# 10. Project AGENTS.md

Global file berisi behavior universal.

Project `AGENTS.md` berisi aturan teknis yang khusus untuk repository.

Contoh untuk Odoo:

```md
# Project Rules

## Stack

- Odoo 18.
- Follow existing Odoo model, view, security, ORM, and module conventions.
- Preserve compatibility with the existing module structure.

## Scope

- Do not modify unrelated addons.
- Do not introduce architectural abstractions unless the requirement needs them.
- Existing project patterns take priority over generic preferences.

## Validation

When Python changes:
- run syntax/import sanity where appropriate,
- validate the affected model/method behavior.

When XML/view changes:
- validate XML syntax,
- validate affected view/module loading.

When module behavior changes:
- perform targeted module upgrade/load validation when possible,
- validate the specific scenario affected by the change.

## Regression

- Do not run the full regression suite by default.
- Perform targeted validation for changed behavior.
- Run broader tests only when explicitly requested or when the change is high risk.

## Business Rules

- Frozen requirements in implementation plans are authoritative.
- Do not reinterpret business rules during implementation.
- If the actual codebase conflicts with a frozen rule, stop and report the conflict.
```

Project-level `AGENTS.md` dapat disesuaikan untuk setiap stack.

---

# 11. Parent Directory Rules

Pi dapat memuat `AGENTS.md` dari parent directory sepanjang path menuju current working directory.

Jadi secara teknis Anda dapat membuat:

```text
/my-project/AGENTS.md
```

untuk aturan bersama seluruh project di bawahnya.

Namun rekomendasi setup ini:

- **global universal rules:** `~/.pi/agent/AGENTS.md`
- **repo-specific rules:** `/my-project/<repo>/AGENTS.md`

Gunakan `/my-project/AGENTS.md` hanya jika memang semua child repository mempunyai aturan organisasi yang sama.

---

# 12. Folder Prompt Global

Buat:

```bash
mkdir -p ~/.pi/agent/prompts
```

---

# 13. `/execute` — Eksekusi Implementation Plan

Buat:

```bash
nano ~/.pi/agent/prompts/execute.md
```

Isi:

```md
---
description: Execute an implementation plan autonomously with validation loops
argument-hint: <path-to-plan>
---

Execute the implementation plan provided in: {{args}}

Read the entire plan before making any source-code changes.

Treat the following parts of the plan as authoritative when present:
- Objective
- Expected Behavior
- Frozen Requirements
- Out of Scope
- Constraints
- Acceptance Criteria
- Validation Plan
- Definition of Done

## Phase 1 — Inspect

Before editing:

1. Inspect the current repository state.
2. Locate all relevant implementation paths.
3. Map each important plan step to the actual codebase.
4. Validate important assumptions from the plan.
5. Identify conflicts between the plan and the actual implementation.

If there is a material conflict that changes the intended business behavior or architecture:
STOP and report BLOCKED.
Do not silently redesign the plan.

## Phase 2 — Implement

If the plan maps correctly:

1. Execute it step by step.
2. Prefer the smallest correct changes.
3. Follow existing repository conventions.
4. Do not expand scope.
5. Do not refactor unrelated code.

For a large plan, validate logical milestones incrementally rather than waiting until the end.

## Phase 3 — Validate

After a logical implementation unit:

1. Run the cheapest meaningful targeted validation.
2. Evaluate the result.
3. If it fails:
   - diagnose the failure,
   - identify the failure class,
   - update the hypothesis using evidence,
   - make the smallest corrective fix,
   - validate again.

Do not perform random trial-and-error fixes.

Maximum corrective attempts for the same failure class: 3.

If unresolved after the budget:
STOP and report BLOCKED.

## Phase 4 — Acceptance Verification

When technical validations pass:

1. Verify every acceptance criterion explicitly.
2. Verify the expected behavior, not only syntax/build success.
3. Check important edge cases listed in the plan.
4. Confirm that out-of-scope behavior was not changed.

## Phase 5 — Final Review

Run and inspect:

- git status
- git diff

Review the final diff against:
- the implementation plan,
- frozen requirements,
- acceptance criteria,
- project rules.

Perform an adversarial self-review:
assume the implementation is still wrong and identify the most likely remaining defect.

If a credible defect exists:
fix and validate it before completion.

## Final Status

Return exactly one final state:

### DONE

Only if:
- implementation is complete,
- validation passes,
- acceptance criteria pass,
- final diff review passes,
- no unresolved issue remains.

Report:
- summary,
- completed plan steps,
- changed files,
- validations run and results,
- acceptance criteria result,
- important implementation notes,
- any recommended follow-up.

### BLOCKED

Use when the task cannot safely or correctly continue.

Report:
- blocker,
- evidence,
- affected plan step,
- what was attempted,
- current repository state,
- what decision/information is required next.

Never report DONE with known failing validation.
```

> Catatan: syntax argument template dapat menyesuaikan versi Pi. Jika `{{args}}` tidak tersedia pada versi yang dipakai, panggil `/execute` lalu tempel path plan pada prompt yang di-expand, atau sesuaikan mengikuti dokumentasi `prompt-templates` versi Pi.

Usage:

```text
/execute ai/plans/fix-dashboard-filter.md
```

---

# 14. `/fix` — Bug / Issue Autonomous Fix

Buat:

```bash
nano ~/.pi/agent/prompts/fix.md
```

Isi:

```md
---
description: Investigate and fix a bug with evidence-driven validation loops
argument-hint: <bug-or-issue>
---

Fix the following issue:

{{args}}

Own the task from investigation through validated completion.

## Investigate First

Before editing:

1. Locate the relevant code.
2. Understand the current behavior.
3. Trace the execution/data path.
4. Form the most likely root-cause hypothesis.
5. Gather concrete evidence.

If confidence is low, investigate more.
Do not edit merely to test random guesses.

## Fix

Once the root cause is sufficiently supported:

1. Make the smallest correct fix.
2. Preserve unrelated behavior.
3. Follow existing project conventions.
4. Avoid unrelated refactoring.

## Validate

Run the most targeted meaningful validation.

If validation fails:

1. Diagnose the new evidence.
2. Identify whether:
   - the root cause was wrong,
   - implementation was incomplete,
   - validation setup is wrong,
   - another dependency is involved.
3. Form an updated hypothesis.
4. Make the smallest corrective change.
5. Validate again.

Maximum 3 corrective attempts for the same failure class.

## Final Verification

Before DONE:

- verify the originally reported issue,
- verify relevant acceptance behavior,
- inspect git diff,
- check for side effects,
- check for unrelated modifications,
- perform an adversarial self-review.

Return DONE only when the fix is validated.
Otherwise return BLOCKED with evidence.
```

Usage:

```text
/fix smart button menampilkan semua kader daerah, seharusnya hanya kader dengan role Pemandu
```

---

# 15. `/review` — Final Review

Buat:

```bash
nano ~/.pi/agent/prompts/review.md
```

Isi:

```md
---
description: Review current changes against requirements and find remaining defects
argument-hint: [optional requirement or plan path]
---

Review the current repository changes.

If an argument is provided, use it as the governing requirement/plan:
{{args}}

Inspect:
- git status
- git diff
- relevant surrounding implementation

Review for:

1. Requirement completeness
2. Logic correctness
3. Incorrect assumptions
4. Missing edge cases
5. Unintended behavior changes
6. Scope creep
7. Data integrity issues
8. Error handling gaps
9. Security issues where relevant
10. Temporary/debug artifacts
11. Missing validation
12. Inconsistent project conventions

Do not praise the implementation.
Act as an adversarial reviewer.

Classify findings:

- BLOCKER
- HIGH
- MEDIUM
- LOW

If no meaningful issue is found, state that clearly and summarize the evidence reviewed.
```

---

# 16. Implementation Plan Format

Implementation plan yang akan diberikan ke Pi sebaiknya menggunakan struktur:

```md
# Title

## 1. Objective

Apa yang ingin dicapai.

## 2. Current Problem

Behavior sekarang dan masalahnya.

## 3. Expected Behavior

Behavior setelah selesai.

## 4. Frozen Requirements

Keputusan yang tidak boleh ditafsirkan ulang selama implementasi.

## 5. Out of Scope

Yang secara eksplisit tidak dikerjakan.

## 6. Technical Findings

Temuan hasil analisis awal yang relevan.

## 7. Constraints

Batas teknis/bisnis.

## 8. Implementation Steps

Langkah detail dan urutan pengerjaan.

## 9. Files / Components Likely Affected

File/model/view/service/module yang diperkirakan terlibat.

## 10. Edge Cases

Kasus penting yang harus dipertimbangkan.

## 11. Acceptance Criteria

Kriteria observable yang menentukan keberhasilan.

## 12. Validation Plan

Cara memverifikasi setiap behavior.

## 13. Rollback / Safety Notes

Jika dibutuhkan.

## 14. Definition of Done

Kondisi akhir sebelum task boleh dianggap selesai.
```

Acceptance criteria sebaiknya dapat diverifikasi.

Buruk:

```text
Dashboard harus lebih bagus.
```

Lebih baik:

```text
Ketika angka "Pemandu PD KAMMI Jember = 27" diklik,
list kader hanya menampilkan 27 kader yang membentuk metric tersebut,
bukan seluruh kader PD KAMMI Jember.
```

---

# 17. Validation Ladder

Tujuan validation ladder adalah menghindari test mahal sebelum checks murah berhasil.

Contoh umum:

```text
1. syntax / parse
        ↓
2. import / build / module load
        ↓
3. affected unit/function
        ↓
4. targeted scenario
        ↓
5. acceptance criteria
        ↓
6. git diff review
```

Contoh Odoo:

```text
Python/XML sanity
        ↓
affected module load/upgrade
        ↓
affected model/domain/computation
        ↓
specific UI/data scenario
        ↓
expected record count/behavior
        ↓
git diff review
```

Jangan menjalankan seluruh regression suite setiap kali satu XML edit gagal parse.

---

# 18. Safety Extension

Pi core sengaja minimal dan tidak memaksakan permission popup.

Gunakan official/reference safety extension sebagai starting point.

Direkomendasikan:

- `permission-gate.ts`
- `protected-paths.ts`

Lokasi global:

```text
~/.pi/agent/extensions/
```

Project-local:

```text
.pi/extensions/
```

Path yang sebaiknya dilindungi:

```text
.env
.git/
*.pem
*.key
credentials/
secrets/
production-secrets/
```

Command yang sebaiknya meminta confirmation:

```text
rm -rf
sudo
git push --force
git reset --hard
git clean -fd
docker system prune
DROP DATABASE
TRUNCATE
```

**Review source extension sebelum install/copy third-party package.**

---

# 19. Cara Mengambil Official Safety Examples

Pi menyediakan contoh extension di repository resminya, termasuk:

```text
permission-gate.ts
protected-paths.ts
dirty-repo-guard.ts
sandbox/
```

Prinsip instalasinya:

1. Clone repository Pi ke lokasi tools.
2. Review source extension.
3. Copy extension yang diperlukan ke:

```text
~/.pi/agent/extensions/
```

atau gunakan `--extension` untuk testing sebelum dibuat permanent.

Jangan memasang seluruh example package jika hanya membutuhkan dua safety control.

---

# 20. Git Checkpoint

Sebelum task besar:

```bash
git status
```

Pastikan memahami uncommitted changes milik user.

Pilihan manual:

```bash
git add -A
git commit -m "checkpoint before AI implementation"
```

atau gunakan branch/worktree yang aman.

Contoh:

```bash
git checkout -b ai/fix-dashboard-filter
```

Prinsip:

> Pi tidak boleh menghapus atau me-reset perubahan user yang tidak berhubungan dengan task.

---

# 21. Model Strategy

Default:

```text
DeepSeek V4 Flash
```

Gunakan untuk:

- code exploration,
- normal bug fixing,
- routine implementation,
- targeted validation,
- simple final review.

Escalate ke model lebih kuat ketika:

- root cause confidence tetap rendah setelah eksplorasi,
- failure yang sama berulang 2–3 kali,
- perubahan menyangkut architecture,
- data integrity risk tinggi,
- security-sensitive,
- cross-module behavior kompleks.

Prinsip cost:

```text
Flash
  ↓
stuck?
  ↓
Strong model untuk diagnosis
  ↓
Flash untuk implementation/validation
```

Lebih baik daripada:

```text
Flash → fail → Flash → fail → Flash → fail → Flash...
```

---

# 22. Jangan Gunakan Subagent Secara Default

Untuk mayoritas task:

```text
1 Pi agent
+
DeepSeek V4 Flash
```

cukup.

Subagent menambah:

- context,
- token,
- duplicate code reading,
- coordination overhead.

Gunakan independent reviewer/subagent hanya untuk:

- perubahan sangat besar,
- migration,
- security,
- data integrity,
- high-risk business logic,
- perubahan architecture,
- perubahan lintas banyak module.

---

# 23. Status Task

Gunakan mental model:

```text
ANALYZING
    ↓
IMPLEMENTING
    ↓
VALIDATING
    ↓
FIXING (jika perlu)
    ↓
VALIDATING
    ↓
REVIEWING
    ↓
DONE
```

Atau:

```text
BLOCKED
```

DONE tidak boleh digunakan ketika validation masih merah.

---

# 24. Format Laporan Akhir

Pi sebaiknya memberikan laporan:

```md
## Status
DONE

## Summary
...

## Changed Files
- ...
- ...

## Validation
- PASS: ...
- PASS: ...

## Acceptance Criteria
- PASS: AC-1
- PASS: AC-2
- PASS: AC-3

## Final Diff Review
No unrelated changes detected.

## Remaining Issues
None.
```

Jika gagal:

```md
## Status
BLOCKED

## Blocker
...

## Evidence
...

## Attempts
1. ...
2. ...
3. ...

## Current State
...

## Required Next Decision
...
```

---

# 25. Workflow Daily

## Fix bug langsung

```bash
cd /my-project/kammi-odoo
pi
```

Di Pi:

```text
/fix <jelaskan bug>
```

Pi:

```text
inspect
→ root cause
→ evidence
→ minimal fix
→ targeted validation
→ corrective loop jika gagal
→ final review
→ DONE/BLOCKED
```

---

## Execute plan

Simpan plan:

```text
ai/plans/task-name.md
```

Jalankan:

```text
/execute ai/plans/task-name.md
```

Pi:

```text
read full plan
→ verify against repo
→ execute
→ validate incrementally
→ fix failures
→ acceptance verification
→ final diff review
→ DONE/BLOCKED
```

---

## Review perubahan

```text
/review ai/plans/task-name.md
```

atau:

```text
/review
```

---

# 26. Workflow Plan dari ChatGPT

Flow yang direkomendasikan:

```text
User + ChatGPT
      ↓
diskusi
      ↓
analisis
      ↓
freeze
      ↓
Pi-executable implementation plan
      ↓
save:
ai/plans/<task>.md
      ↓
Pi /execute
```

Jika Pi menemukan conflict:

```text
Pi BLOCKED report
      ↓
kembali ke ChatGPT
      ↓
analisis evidence baru
      ↓
revisi plan
      ↓
Pi /execute kembali
```

Ini menjaga Pi agar tidak mengubah keputusan bisnis secara sepihak.

---

# 27. Setup Script Manual

Buat direktori global:

```bash
mkdir -p ~/.pi/agent/prompts
mkdir -p ~/.pi/agent/extensions
```

Untuk setiap project:

```bash
cd /my-project/<nama-project>

mkdir -p ai/plans
mkdir -p ai/decisions
mkdir -p ai/reports
mkdir -p .pi/prompts
mkdir -p .pi/extensions
```

Buat:

```text
~/.pi/agent/AGENTS.md
~/.pi/agent/prompts/execute.md
~/.pi/agent/prompts/fix.md
~/.pi/agent/prompts/review.md
```

Tambahkan:

```text
<repo>/AGENTS.md
```

Set provider:

```bash
export DEEPSEEK_API_KEY="..."
```

Run:

```bash
cd /my-project/<repo>
pi
```

Reload setelah config berubah:

```text
/reload
```

---

# 28. Optional: Helper Shell Function

Jika sering pindah repo:

```bash
piproject() {
    cd "/my-project/$1" || return
    pi
}
```

Masukkan ke:

```text
~/.bashrc
```

Usage:

```bash
piproject kammi-odoo
```

---

# 29. Optional V2 — Execution Gate Extension

**Jangan dibuat dulu kecuali ditemukan kebutuhan nyata.**

Jika setelah pemakaian ternyata model:

- sering menyatakan DONE terlalu cepat,
- tidak menjalankan validation,
- lupa final diff review,
- terus loop tanpa memperhatikan failure budget,

baru buat custom TypeScript extension.

Target extension:

```text
state:
ANALYZING
IMPLEMENTING
VALIDATING
FIXING
REVIEWING
DONE
BLOCKED
```

Extension dapat mencatat:

```text
validation_attempts
failure_class
corrective_attempts
changed_files
validation_passed
diff_reviewed
```

Dan menolak completion jika:

```text
validation_passed == false
```

atau:

```text
diff_reviewed == false
```

Namun v1 sebaiknya menggunakan instruction/prompt dahulu agar Pi tetap ringan.

---

# 30. Optional V2 — Strong Model Escalation

Jika provider menyediakan beberapa model:

```text
default:
DeepSeek V4 Flash

escalation:
DeepSeek V4 Pro / stronger reasoning model
```

Trigger:

```text
- 2–3 failed evidence-driven attempts,
- root cause confidence remains low,
- architecture conflict,
- data-integrity-sensitive issue.
```

Untuk awal lakukan model switching manual.

Automatic routing baru dibuat setelah usage pattern nyata sudah terlihat.

---

# 31. Hal yang Tidak Direkomendasikan

Jangan langsung memasang:

- banyak subagents,
- auto planner,
- 20 extension community,
- reviewer di setiap edit,
- full regression setiap perubahan,
- web/MCP jika task tidak memerlukan,
- todo framework kompleks,
- model kuat untuk semua tool calls.

Karena ini meningkatkan:

- token,
- latency,
- coordination failure,
- context pollution,
- cost.

Prinsip setup:

> **minimal harness + strong execution discipline.**

---

# 32. Recommended V1 Final Stack

```text
Pi
│
├── Provider
│   └── DeepSeek V4 Flash
│
├── Global behavior
│   └── ~/.pi/agent/AGENTS.md
│
├── Project behavior
│   └── <repo>/AGENTS.md
│
├── Workflows
│   ├── /execute
│   ├── /fix
│   └── /review
│
├── Safety
│   ├── permission gate
│   ├── protected paths
│   └── git checkpoint
│
└── Planning artifacts
    └── ai/plans/*.md
```

Tidak perlu dulu:

```text
planner agent
multi-agent workflow
automatic model router
complex state engine
large plugin stack
```

---

# 33. Definition of Success untuk Setup Ini

Setup dianggap berhasil jika dalam penggunaan nyata:

1. Pi memahami task sebelum mengedit.
2. Pi jarang melakukan random fix.
3. Pi menemukan root cause dengan evidence.
4. Pi mengubah file seminimal mungkin.
5. Pi menjalankan targeted validation.
6. Pi otomatis memperbaiki validation failure yang masuk akal.
7. Pi tidak terjebak infinite loop.
8. Pi berhenti dan eskalasi jika benar-benar blocked.
9. Pi tidak menyatakan DONE terlalu cepat.
10. Pi menghasilkan diff yang dapat direview.
11. Pi dapat mengeksekusi implementation plan panjang sampai acceptance criteria selesai.
12. Penggunaan token tetap lebih rendah daripada harness/workflow yang terlalu agentic.

---

# 34. Evaluation Setelah 1–2 Minggu

Jangan menilai dari satu task.

Catat sekitar 10–20 task:

```text
Task
Type
Model
First-pass success?
Number of corrective loops
Token/cost
Files touched
Validation quality
Final result
Human correction required?
```

Ukuran yang paling penting:

```text
First-pass root cause accuracy
First-pass implementation accuracy
Corrective loops per task
Cost per successful task
Human intervention rate
Out-of-scope change rate
```

Jika problem berulang muncul, baru tambahkan extension untuk mengatasi problem nyata tersebut.

---

# 35. Checklist Setup

## VPS

- [ ] Pi terinstall.
- [ ] Pi version terverifikasi.
- [ ] `DEEPSEEK_API_KEY` dikonfigurasi.
- [ ] DeepSeek V4 Flash dapat dipilih.

## Global

- [ ] `~/.pi/agent/AGENTS.md`
- [ ] `~/.pi/agent/prompts/execute.md`
- [ ] `~/.pi/agent/prompts/fix.md`
- [ ] `~/.pi/agent/prompts/review.md`
- [ ] permission gate
- [ ] protected paths

## Project

- [ ] `<repo>/AGENTS.md`
- [ ] `ai/plans/`
- [ ] `ai/decisions/`
- [ ] `ai/reports/`
- [ ] repository menggunakan Git
- [ ] validation commands/project conventions dicatat

## Workflow

- [ ] `/fix` bekerja.
- [ ] `/execute <plan>` bekerja.
- [ ] `/review` bekerja.
- [ ] validation loop bekerja.
- [ ] failure budget dipatuhi.
- [ ] final diff selalu direview.
- [ ] DONE/BLOCKED jelas.

---

# 36. Referensi Teknis Resmi yang Diverifikasi

Blueprint ini mengikuti surface konfigurasi Pi yang tersedia pada dokumentasi resmi saat dibuat:

- Pi adalah minimal terminal coding harness dengan TypeScript Extensions, Skills, Prompt Templates, dan Themes.
- Global context file: `~/.pi/agent/AGENTS.md`.
- Pi juga membaca `AGENTS.md` / `CLAUDE.md` dari parent directory dan current directory.
- Global prompt templates: `~/.pi/agent/prompts/*.md`.
- Project prompt templates: `.pi/prompts/*.md`.
- Global extensions: `~/.pi/agent/extensions/`.
- Project extensions: `.pi/extensions/`.
- DeepSeek tersedia sebagai built-in provider.
- Credential DeepSeek dapat menggunakan `DEEPSEEK_API_KEY`.
- DeepSeek V4 Flash dan V4 Pro didukung.
- Pi menyediakan contoh extension resmi untuk permission gates, protected paths, dirty repo guard, sandbox, Git integration, subagents, dan lain-lain.
- Pi sengaja tidak memaksakan plan mode, subagents, permission popup, atau todo system sebagai core behavior.

Karena Pi berkembang cepat, sebelum membuat custom TypeScript extension V2, cek ulang extension API pada versi Pi yang sedang terinstall.

---

# 37. Keputusan Arsitektur Akhir

Untuk workflow ini:

```text
ChatGPT
=
Think
Design
Discuss
Freeze
Plan
```

```text
Pi + DeepSeek V4 Flash
=
Inspect
Diagnose
Implement
Validate
Fix
Re-validate
Review
Deliver
```

Pi bukan sekadar generator code.

Targetnya adalah:

> **autonomous, evidence-driven coding executor dengan validation loop yang disiplin, tetapi tetap ringan dan cost-efficient.**

Mulai dari V1 yang minimal.

Tambahkan automation/custom extension hanya berdasarkan failure pattern nyata setelah digunakan.
