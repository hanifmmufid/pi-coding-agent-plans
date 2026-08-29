# PI Coding Executor Improvement Roadmap
## Fokus: Reliability `/execute` Tanpa Over-Engineering

**Versi:** 1.0  
**Tujuan:** meningkatkan kualitas eksekusi Pi agar hasil lebih konsisten, validation lebih kuat, loop lebih sedikit, dan tetap hemat token.

---

# 1. Prinsip Utama

Setup Pi saat ini sudah cukup baik sebagai baseline:

- global `AGENTS.md`
- project `AGENTS.md`
- `/fix`
- `/execute`
- `/review`
- safety gate
- DeepSeek V4 Flash sebagai default model

Karena keunggulan Pi saat ini adalah ringan, hemat token, tidak terlalu banyak agent overhead, cukup autonomous untuk coding, dan fleksibel untuk custom workflow.

Prinsip improvement:

> **Tambahkan hanya hal yang terbukti meningkatkan hasil.**

Bukan:

> menambah fitur karena terlihat menarik.

---

# 2. Target Improvement

Target utama next phase:

1. `/execute` benar-benar menyelesaikan task sesuai requirement.
2. Pi tidak terlalu cepat menyatakan `DONE`.
3. Acceptance criteria diverifikasi secara eksplisit.
4. Validation dilakukan berdasarkan evidence.
5. Corrective loop tidak random.
6. Pi tahu kapan harus stop dan `BLOCKED`.
7. Jumlah loop tetap rendah.
8. Cost/token tetap efisien.
9. Tidak ada over-engineering harness.

---

# 3. Roadmap Minimal

```text
V1 Existing Setup
      ↓
Real-world /execute testing
      ↓
Find actual failure pattern
      ↓
Improve plan + validation knowledge
      ↓
Only if needed:
completion gate
      ↓
Only if needed:
model escalation
```

---

# 4. Tahap 1 — Uji `/execute` pada Task Nyata

Sebelum custom extension baru, gunakan setup saat ini untuk **3–5 task nyata**.

Jenis task yang direkomendasikan:

### Task A — Fix kecil

Contoh:

```text
field readonly seharusnya editable
```

Tujuan:
- cek apakah Pi langsung menemukan file tepat,
- perubahan minimal,
- validation cukup,
- tidak over-explore.

### Task B — Bug dengan root cause tracing

Contoh:

```text
smart button count = 27
tetapi ketika diklik muncul 114 record
```

Tujuan:
- cek diagnosis sebelum edit,
- cek evidence root cause,
- cek jumlah corrective loop.

### Task C — Implementation Plan Menengah

Contoh:

```text
implement dashboard drilldown berdasarkan plan
```

Tujuan:
- cek apakah Pi membaca plan lengkap,
- mapping plan ke repository,
- menjalankan step satu per satu,
- melakukan validation incremental.

### Task D — Multi-file change

Contoh:

```text
model + XML + JS/controller
```

Tujuan:
- cek context management,
- scope discipline,
- final diff review.

### Task E — Edge case / conflict

Plan sengaja mempunyai asumsi yang ternyata berbeda dengan repository.

Tujuan:
- Pi harus `BLOCKED`,
- bukan improvisasi architecture baru.

---

# 5. Metrics yang Harus Dicatat

Untuk setiap task, catat:

```text
Task:
Type:
Model:
First-pass diagnosis correct?
First-pass implementation correct?
Corrective loops:
Validation executed?
Acceptance criteria verified?
Files touched:
Out-of-scope changes?
Human intervention?
Final result:
Token/cost:
```

Metrics terpenting:

```text
1. First-pass root cause accuracy
2. First-pass implementation accuracy
3. Corrective loops per task
4. Human intervention rate
5. Out-of-scope change rate
6. Validation quality
7. Cost per successful task
```

Jangan menilai hanya berdasarkan “kode akhirnya jalan” karena agent yang membutuhkan banyak loop tetap tidak efisien.

---

# 6. Tahap 2 — Perkuat Implementation Plan

Improvement terbesar sebaiknya ada pada **kualitas input `/execute`**.

Implementation plan harus menjadi:

> **executable specification**

bukan sekadar todo list.

Gunakan format:

```md
# Objective

# Current Problem

# Expected Behavior

# Frozen Requirements

# Out of Scope

# Technical Findings

# Constraints

# Implementation Steps

# Files / Components Likely Affected

# Edge Cases

# Acceptance Criteria

# Validation Plan

# Definition of Done
```

---

# 7. Acceptance Criteria Harus Observable

Jangan:

```text
Dashboard harus benar.
```

Gunakan:

```text
Ketika metric Pemandu PD KAMMI Jember menunjukkan 27,
klik pada metric tersebut harus membuka list yang hanya berisi
27 kader yang memenuhi criteria Pemandu tersebut.
```

Dengan criteria seperti itu, Pi tahu apa yang harus dibuktikan.

---

# 8. Mapping Acceptance Criteria ke Validation

Idealnya setiap acceptance criterion punya validation evidence.

```text
AC-1 → V-1
AC-2 → V-2
AC-3 → V-3
```

Contoh:

```text
AC-1:
metric dashboard = 27

V-1:
query / compute result = 27
```

```text
AC-2:
klik smart button membuka 27 record

V-2:
domain yang digunakan menghasilkan 27 record
```

```text
AC-3:
filter tidak mengubah behavior metric lain

V-3:
check targeted metrics terkait
```

---

# 9. Expected Final Report dari `/execute`

Pi seharusnya menghasilkan:

```md
## Status
DONE

## Implementation
- Step 1: PASS
- Step 2: PASS
- Step 3: PASS

## Validation
- V1: PASS
- V2: PASS
- V3: PASS

## Acceptance Criteria
- AC1: PASS — evidence: ...
- AC2: PASS — evidence: ...
- AC3: PASS — evidence: ...

## Changed Files
- ...
- ...

## Final Diff Review
PASS

## Remaining Issues
None
```

Jika tidak selesai:

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

## Required Decision
...
```

---

# 10. Tahap 2B — Project Validation Knowledge

Setiap repository sebaiknya mempunyai `AGENTS.md` yang menjelaskan validation ladder.

Contoh Odoo:

```text
1. Python/XML syntax
       ↓
2. import / module load
       ↓
3. affected model/method
       ↓
4. targeted business scenario
       ↓
5. acceptance criteria
       ↓
6. git diff review
```

Aturan:

```text
cheap validation first
expensive validation later
```

Tujuannya:
- mempercepat feedback,
- menghemat token,
- mengurangi waktu,
- memudahkan root cause saat failure.

---

# 11. Contoh Odoo Validation Rules

Tambahkan di project `AGENTS.md`:

```md
## Odoo Validation Strategy

When Python changes:
- validate syntax/import,
- validate the affected model or method,
- validate business behavior.

When XML changes:
- validate XML syntax,
- validate inherited view references,
- validate module load/upgrade.

When domain/filter logic changes:
- verify expected record count,
- verify expected records,
- verify unrelated filters are unchanged.

When computed fields change:
- verify calculation inputs,
- verify stored/non-stored behavior,
- verify recomputation triggers when relevant.

When permissions/security change:
- verify access for intended role,
- verify unintended roles do not gain access.

Always prefer targeted validation before full regression.
```

---

# 12. Corrective Loop Improvement

Loop yang benar:

```text
FAIL
 ↓
classify failure
 ↓
diagnose evidence
 ↓
new hypothesis
 ↓
minimal correction
 ↓
targeted validate
```

Loop yang salah:

```text
FAIL
 ↓
random edit
 ↓
FAIL
 ↓
random edit
```

---

# 13. Failure Classification

Pi idealnya membedakan failure menjadi:

```text
IMPLEMENTATION_ERROR
ROOT_CAUSE_WRONG
PLAN_CONFLICT
ENVIRONMENT_ERROR
VALIDATION_ERROR
DEPENDENCY_ERROR
DATA_ERROR
```

Classification membantu Pi memilih tindakan berikutnya.

---

# 14. Failure Budget

Gunakan:

> maksimal 3 corrective attempt untuk **failure class yang sama**

Bukan 3 loop seluruh task.

Jika sudah 3 kali gagal pada failure class yang sama:

```text
BLOCKED / ESCALATE
```

---

# 15. Tahap 3 — Completion Gate Extension

**Jangan dibuat sekarang kecuali ditemukan masalah nyata.**

Trigger membuat extension:

```text
Pi sering:
- menyatakan DONE tanpa validation,
- lupa acceptance criteria,
- lupa final diff,
- berhenti setelah test sebagian,
- mengabaikan unresolved warning.
```

Jika ini terjadi berulang, buat:

```text
completion-gate.ts
```

---

# 16. Tujuan Completion Gate

Extension menjaga evidence completion.

State minimal:

```text
validation_passed
acceptance_checked
diff_reviewed
unresolved_errors
```

Completion hanya boleh `DONE` jika:

```text
validation_passed == true
acceptance_checked == true
diff_reviewed == true
unresolved_errors == false
```

Jika belum:

```text
completion rejected
→ continue work
```

---

# 17. Jangan Jadikan Extension sebagai Workflow Engine Besar

Jangan membuat:

```text
planner
scout
coder
reviewer
validator
manager
supervisor
```

untuk setiap task.

Tujuan completion gate hanya:

> mencegah premature DONE.

Agent utama tetap melakukan pekerjaan.

---

# 18. Tahap 4 — Model Escalation

DeepSeek V4 Flash tetap default.

Gunakan model lebih kuat hanya jika perlu.

Trigger:

```text
- root cause confidence tetap rendah,
- 2–3 evidence-driven correction gagal,
- architecture conflict,
- security-sensitive,
- data-integrity-sensitive,
- cross-module logic kompleks.
```

Flow:

```text
DeepSeek V4 Flash
      ↓
problem sulit
      ↓
strong model
      ↓
diagnosis / solution
      ↓
DeepSeek V4 Flash
      ↓
implementation + validation
```

---

# 19. Jangan Auto Escalation Dulu

Untuk V1/V2:

```text
manual model switch
```

lebih baik.

Automatic model routing baru dibuat setelah cukup data penggunaan.

---

# 20. Hal yang Tidak Perlu Ditambahkan Sekarang

Tidak direkomendasikan:

```text
multi-agent default
auto planner
reviewer setiap step
MCP banyak-banyak
complex todo state
automatic web search
full regression automation
model router kompleks
persistent vector memory tambahan
```

Kecuali ditemukan kebutuhan nyata.

---

# 21. Kenapa Tidak Multi-Agent?

Jika hasil sama, multi-agent bisa memboroskan token karena planner, scout, coder, reviewer, dan validator masing-masing membaca ulang context.

Gunakan subagent hanya untuk high-risk / large task.

---

# 22. Optional: Independent Reviewer

Gunakan hanya untuk:

- migration,
- security,
- data integrity,
- architecture,
- perubahan lintas banyak module,
- high-risk business rule.

Flow:

```text
executor
   ↓
validation
   ↓
independent reviewer
   ↓
issue?
 ├─ yes → fix
 └─ no  → DONE
```

Bukan default.

---

# 23. Improvement Priorities

Urutan priority:

1. **Real-world `/execute` test**
2. **Better acceptance criteria**
3. **Better validation knowledge**
4. **Better final report**
5. **Completion gate if needed**
6. **Model escalation if needed**

---

# 24. Recommended V1.1

```text
Pi
│
├── DeepSeek V4 Flash
├── Global AGENTS.md
├── Project AGENTS.md
├── /fix
├── /execute
├── /review
├── acceptance-driven plans
├── project validation ladder
├── safety gate
└── git diff review
```

Tidak ada extension baru kecuali safety yang sudah ada.

---

# 25. Recommended V1.2

Jika hasil test menunjukkan premature completion:

```text
Pi
│
├── semua V1.1
└── completion-gate.ts
```

---

# 26. Recommended V1.3

Jika Flash sering stuck:

```text
Pi
│
├── semua V1.2
├── DeepSeek V4 Flash
└── stronger escalation model
```

Switch awal tetap manual.

---

# 27. Evaluation Template

| Task | Type | First Diagnosis | First Implementation | Loops | Validation | Human Fix | Cost | Result |
|---|---|---|---|---:|---|---|---:|---|
| A | small fix | PASS | PASS | 0 | PASS | No | ... | DONE |
| B | bug tracing | PASS | FAIL | 1 | PASS | No | ... | DONE |
| C | impl plan | ... | ... | ... | ... | ... | ... | ... |

Target awal yang bagus:

```text
First-pass diagnosis > 80%
Corrective loops average < 1.5
Human intervention < 20%
Out-of-scope changes ≈ 0
Validation evidence ≈ 100%
```

Angka ini target operasional, bukan benchmark absolut.

---

# 28. Kapan Setup Dianggap Sudah Matang?

Setup bisa dianggap mature jika:

1. `/fix` konsisten menyelesaikan bug kecil.
2. `/execute` menyelesaikan plan menengah tanpa human babysitting.
3. Pi tidak sering random-fix.
4. Pi mengerti kapan harus `BLOCKED`.
5. Acceptance criteria selalu diverifikasi.
6. Final diff selalu diperiksa.
7. Out-of-scope change sangat rendah.
8. Average corrective loop rendah.
9. Cost tetap terasa hemat.
10. Tidak perlu banyak manual approval.

---

# 29. Next Action yang Direkomendasikan

Jangan coding extension baru dulu.

Lakukan:

```text
1. pilih 3–5 task nyata
2. jalankan /execute
3. catat metric
4. identifikasi failure pattern
5. update plan format / AGENTS.md
6. baru putuskan apakah completion-gate perlu
```

---

# 30. Decision Summary

Arah improvement:

```text
lebih sedikit magic
lebih banyak evidence
lebih sedikit agent
lebih banyak acceptance criteria
lebih sedikit random loop
lebih banyak targeted validation
```

Target akhir:

> **Pi tetap lightweight dan hemat token, tetapi menjadi semakin reliable karena plan, validation, dan completion criteria semakin deterministic.**

Tidak perlu menjadikan Pi sistem multi-agent kompleks.

Yang dibutuhkan adalah:

> **input yang jelas + execution loop yang disiplin + evidence-based DONE.**
