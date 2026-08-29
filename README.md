# PI Coding Agent — Implementation Plans & Blueprints

Kumpulan blueprint, roadmap, dan implementation plan untuk membangun & meng-improve
**pi coding agent** (terminal coding harness) di VPS — dari setup dasar hingga
workflow trading/ML yang scope-aware dengan delegasi model nyata.

> **Bahasa dokumen:** Indonesia (sesuai preferensi komunikasi).
> **Prinsip utama:** semua improvement di-**merge** ke konfigurasi yang ada, bukan replace.

---

## 📋 Daftar Dokumen

| # | Dokumen | Fokus |
|---|---------|-------|
| 01 | [Coding Executor Setup Blueprint](01_PI_Coding_Executor_Setup_Blueprint.md) | Fondasi pi: agent executor autonomous (inspect → implement → validate → fix → review → DONE/BLOCKED) |
| 02 | [Coding Executor Improvement Roadmap](02_PI_Coding_Executor_Improvement_Roadmap.md) | Roadmap beruntun semua improvement pi |
| 03 | [Frontend Quality & Visual Validation](03_PI_Frontend_Quality_Visual_Validation_Implementation_Plan.md) | Workflow frontend: skill `frontend-design`, validasi visual 1440px/390px |
| 04 | [Global Frontend Config](04_PI_Global_Frontend_Config_Improvement_Plan.md) | Config global frontend: light-first, left sidebar, DESIGN_SYSTEM.md |
| 05 | [Dual-Model Frontend Vision Validation](05_PI_Dual_Model_Frontend_Vision_Validation_Implementation_Plan.md) | Delegasi screenshot ke vision model (`describe_image`) |
| 06 | [Vision Review Budget & Anti-Loop](06_PI_Vision_Review_Budget_Anti_Loop_Improvement_Plan.md) | Budget max 2 vision calls/task, FUNCTIONAL_QUALITY, MINOR tidak trigger loop |
| 07 | [Codebase Understanding Study Workflow](07_PI_Codebase_Understanding_Study_Workflow_Improvement_Plan.md) | Skill `codebase-study`: pemahaman repo baru secara cepat & hemat token |
| 08 | [Migrate Memgraph → Pi Fovea](08_PI_Migrate_Memgraph_to_Fovea_Implementation_Plan.md) | Ganti `pi-code-graph + Memgraph` dengan `pi-fovea` (lightweight awareness) |
| 09 | [Scope-Aware Quant Analyst (Qwen 3.8 Max)](09_PI_Qwen38Max_Scope_Aware_Quant_Analyst_Improvement_Plan.md) | Skill `trading-backtest-analysis`: quant review scope-aware + Execution Contract |
| 📁 | [Config Snapshot Aktif](config/README.md) | Snapshot konfigurasi pi yang berjalan (models, prompts, extensions, skills) |

---

## 🚀 Ringkasan Improvement

### 1. Executor Autonomous (01–02)
Pi bekerja sebagai executor yang mandiri:
- **Inspect** → **Implement** → **Validate** → **Fix** → **Review** → **DONE/BLOCKED**
- Maksimal 3 corrective attempts per failure class, lalu BLOCKED
- Permission gate (AUTO/ASK/BLOCK) + protected paths (`.env`, `credentials/`, dll)

### 2. Frontend Quality (03–06)
- Skill `frontend-design` wajib untuk tugas UI/UX
- Global default: light theme, left sidebar, produksi-grade
- **Validasi visual wajib**: desktop 1440px + mobile 390px via screenshot
- **Dual-model vision**: executor text-only delegasi screenshot ke vision model (`describe_image`)
- **Anti-loop budget**: max 2 vision calls/task; MINOR issues tidak trigger review ulang

### 3. Codebase Awareness (07–08)
- Skill `codebase-study` + dokumentasi modular di `docs/codebase/`
- **Pi Fovea** menggantikan Memgraph: `fovea_sketch` → `fovea_focus` → `fovea_dwell` → `fovea_impact`
- Source code tetap sumber kebenaran utama

### 4. Scope-Aware Quant Analyst (09)
- **Delegasi model nyata** via tool `quant_review` (LiteLLM), bukan role-play
- Scope Authority Priority: user → frozen plan → EXPERIMENT_SCOPE.md → AGENTS.md → quant rec
- `EXPERIMENT_SCOPE.md` di-bootstrap otomatis oleh executor (bukan reviewer — conflict of interest)
- **Execution Contract**: review selesai → eksekusi IN_SCOPE langsung, FUTURE_IMPROVEMENTS dipersist
- Review budget: default 1 / max 2 per milestone

---

## ⚙️ Model Stack (via LiteLLM proxy)

| Peran | Model | Provider |
|-------|-------|----------|
| Executor default | `go-deepseek-v4-flash` | OpenCode Go |
| Escalation | `go-deepseek-v4-pro` | OpenCode Go |
| **Quant reviewer** | `cmd-deepseek-v4-pro` (+fallback `cmd-deepseek-v4-flash`) | Command Code |
| **Vision** | `cmd-qwen3.8-max` | Command Code |

Preferensi: `cmd-*` (Command Code) diutamakan karena plan OpenCode Go hampir habis.
Qwen 3.8 Max (Command Code) stabil untuk vision; flaky untuk packet quant besar,
jadi quant review memakai DeepSeek V4 Pro (Command Code).

---

## 📁 Struktur Config Aktif

```
~/.pi/agent/
├── AGENTS.md                    → Global execution rules (permission gate, scope, model)
├── models.json                  → 11 model terdaftar (go-*, pi-*, cmd-*)
├── settings.json                → packages: frontend-design, browser-screenshot, vision-tool, fovea
├── quant-tool.json              → Config tool quant_review (cmd-deepseek-v4-pro)
├── vision-tool.json             → Config tool describe_image (cmd-qwen3.8-max)
├── extensions/
│   ├── permission-gate.ts       → AUTO/ASK/BLOCK gate
│   ├── protected-paths.ts       → Proteksi .env, credentials, dll
│   └── quant-review-tool.ts     → Tool quant_review + command /quant
├── prompts/
│   ├── execute.md / fix.md / review.md
│   ├── quant-review.md          → Prompt reviewer scope-aware
│   ├── experiment-scope-template.md
│   └── future-improvements-template.md
└── skills/
    ├── frontend-design/         → UI/UX production-grade
    ├── codebase-study/          → Pemahaman repo baru
    └── trading-backtest-analysis/SKILL.md  → Quant review scope-aware
```

---

## 🔧 Quick Reference

```bash
# Sesi pi interaktif
pi

# Ganti model
/model

# Config quant reviewer (tool quant_review)
/quant show
/quant config model cmd-deepseek-v4-pro

# Config vision (tool describe_image)
/vision show
/vision config model cmd-qwen3.8-max

# Reload extension & config setelah perubahan
/reload
```

---

## 📁 Config Snapshot Aktif

Folder [`config/`](config/README.md) berisi snapshot konfigurasi pi yang sedang
berjalan di VPS (`~/.pi/agent/`): AGENTS.md, models.json (11 model), settings,
quant-tool, vision-tool, fovea, prompts, extensions, dan skills.
Rahasia (apiKey) disensor.

---

## 📌 Status Terakhir

- **9/9 plan** terimplementasi & terverifikasi end-to-end
- Quant review: **real model delegation** (bukan role-play), header transparan `[quant_review by litellm/<model>]`
- Vision & quant sudah 100% memakai model `cmd-*` (Command Code)
- Lihat `server-docs/16-pi-coding-agent-setup.md` untuk dokumentasi setup lengkap
