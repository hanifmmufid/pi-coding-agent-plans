# Pi Agent — Snapshot Config Aktif

Snapshot konfigurasi **pi coding agent** yang aktif di VPS
(`~/.pi/agent/`). Disinkronkan agar dokumentasi selalu sesuai dengan
realita konfigurasi yang berjalan.

> ⚠️ **Rahasia disensor:** `models.json` memakai placeholder `sk-ltm-XXXXXX`.
> File `.env` (COMMAND_CODE_API_KEY dll) dan token asli **tidak pernah** masuk repo ini.

---

## 📁 Struktur

```
config/
├── AGENTS.md                    → Global execution rules (permission gate, scope, model stack)
├── models.json                  → 20 model terdaftar via LiteLLM (apiKey disensor)
├── settings.json                → packages, defaultProvider, defaultModel
├── quant-tool.json              → Config tool quant_review (cmd-deepseek-v4-pro)
├── vision-tool.json             → Config tool describe_image (cmd-qwen3.8-max)
├── fovea.json                   → Config Pi Fovea (sync mode, budget)
├── npm/
│   └── package.json             → Packages terpasang (frontend-design, screenshot, fovea)
├── prompts/                     → Template prompt (/execute, /fix, /review, quant, dll)
├── extensions/                  → Extension TypeScript (permission-gate, protected-paths, quant-review-tool)
└── skills/                      → SKILL.md (frontend-design, codebase-study, trading-backtest-analysis)
```

---

## ⚙️ Ringkasan Config Aktif

### models.json — 20 model (provider: LiteLLM → localhost:4000)

| Model | Akun/Provider | Peran |
|-------|---------------|-------|
| `cmd-deepseek-v4-flash` | Command Code | Executor (generasi sebelumnya) |
| `cmd-deepseek-v4.1-flash` | **Command Code** | ⭐ Executor default (`settings.json`) |
| `cmd-deepseek-v4-pro` | **Command Code** | ⭐ Quant reviewer |
| `cmd-qwen3.8-max` | **Command Code** | ⭐ Vision model |
| `cmd-muse-1.2-contributor` | Command Code | Cadangan |
| `cmd-glm-5.3-flash` | Command Code | Cadangan |
| `cmd-minimax-m3-free` | Command Code | Cadangan |
| `cmd2-deepseek-v4-flash` | Command Code (akun 2) | Cadangan (failover akun) |
| `cmd2-deepseek-v4.1-flash` | Command Code (akun 2) | Cadangan (failover akun) |
| `cmd2-deepseek-v4-pro` | Command Code (akun 2) | Cadangan (failover akun) |
| `cmd2-qwen3.8-max` | Command Code (akun 2) | Cadangan (failover akun) |
| `cmd2-muse-1.2-contributor` | Command Code (akun 2) | Cadangan (failover akun) |
| `cmd2-glm-5.3-flash` | Command Code (akun 2) | Cadangan (failover akun) |
| `cmd2-minimax-m3-free` | Command Code (akun 2) | Cadangan (failover akun) |
| `go-deepseek-v4-flash` | OpenCode Go | Legacy executor |
| `go-deepseek-v4-pro` | OpenCode Go | Legacy escalation |
| `go-qwen3.8-max` | OpenCode Go | Legacy (text+image, flaky) |
| `go-qwen3.7-max` | OpenCode Go | Legacy alternatif |
| `go-minimax-m3` | OpenCode Go | Legacy |
| `pi-qwen3.8-max` | Console Go | Legacy vision |

**Kebijakan:** prefer `cmd-*` (Command Code) — OpenCode Go quota hampir habis.
Semua peran utama (executor, quant, vision) sudah pindah ke `cmd-*`.
Pasangan `cmd2-*` memakai akun Command Code kedua (fallback bila akun 1 limit).

### settings.json
- `defaultProvider: "litellm"`
- `defaultModel: "cmd-deepseek-v4.1-flash"`
- Packages: frontend-design, browser-screenshot, pi-fovea

### quant-tool.json (tool `quant_review`)
```json
{ "model": "cmd-deepseek-v4-pro", "fallbacks": ["cmd-deepseek-v4-flash"], "maxTokens": 32000, "retries": 2 }
```

### vision-tool.json (tool `describe_image`)
```json
{ "model": "cmd-qwen3.8-max", "maxDimension": 1568, "jpegQuality": 85 }
```

### fovea.json
```json
{ "sync": { "mode": "hidden", "scope": "session", "budget": 256 }, "tools": { "defaultBudget": 512 } }
```

---

## 📝 Prompts (`config/prompts/`)

| File | Fungsi |
|------|--------|
| `execute.md` | Prompt /execute — executor autonomous + Scope-Aware Decision Gate |
| `fix.md` | Prompt /fix — perbaikan bug dengan root-cause hypothesis |
| `review.md` | Prompt /review — review hasil + Trading Model Scope Review |
| `quant-review.md` | Prompt reviewer quant — scope-aware, structured verdict |
| `experiment-scope-template.md` | Template EXPERIMENT_SCOPE.md (Scope Bootstrap) |
| `future-improvements-template.md` | Template FUTURE_IMPROVEMENTS (out-of-scope persistence) |
| `design-foundation.md` | Fondasi design system frontend |
| `visual-review.md` | Prompt review visual frontend |
| `study-codebase.md` | Prompt workflow codebase-study |
| `refresh-codebase-docs.md` | Prompt refresh docs/codebase |

> 📌 **Frontend Hardening (plan 10):** `AGENTS.md` memuat subsection
> `Framework-Native Production Frontend` (framework-native guard + production
> states + TECHNICAL/FUNCTIONAL/VISUAL gates); `execute.md` memuat
> `Frontend Production Gate`; `fix.md` memuat `Frontend Fix Rules`;
> `review.md` memuat `Frontend Review` tiga dimensi.

## 🔌 Extensions (`config/extensions/`)

| File | Fungsi |
|------|--------|
| `permission-gate.ts` | Gate izin AUTO/ASK/BLOCK untuk command berbahaya |
| `protected-paths.ts` | Proteksi path sensitif (.env, credentials, *.pem, dll) |
| `quant-review-tool.ts` | Tool `quant_review` + command `/quant` (delegasi model via LiteLLM) |
| `vision-tool.ts` | Tool `describe_image` + command `/vision` (selector model + list) |

## 🎓 Skills (`config/skills/`)

| Skill | Lokasi aktif | Fungsi |
|-------|-------------|--------|
| frontend-design | npm package | UI/UX production-grade (wajib untuk tugas frontend) |
| codebase-study | `~/.pi/agent/skills/` | Pemahaman repo baru, dokumentasi modular |
| trading-backtest-analysis | `~/.pi/agent/skills/` | Quant review scope-aware + Execution Contract |

---

## 🔄 Cara Sinkronisasi

Jika config di VPS berubah, update snapshot ini dengan:

```bash
# dari folder repo pi-coding-agent-plans
cp ~/.pi/agent/AGENTS.md config/AGENTS.md
cp ~/.pi/agent/models.json config/models.json   # lalu sensor apiKey!
cp ~/.pi/agent/settings.json config/settings.json
cp ~/.pi/agent/quant-tool.json config/quant-tool.json
cp ~/.pi/agent/vision-tool.json config/vision-tool.json
cp ~/.pi/agent/fovea.json config/fovea.json
cp ~/.pi/agent/prompts/*.md config/prompts/
cp ~/.pi/agent/extensions/permission-gate.ts config/extensions/
cp ~/.pi/agent/extensions/protected-paths.ts config/extensions/
cp ~/.pi/agent/extensions/quant-review-tool.ts config/extensions/
```

**⚠️ Jangan lupa sensor apiKey di models.json** sebelum commit:
```python
python3 -c "
import json
d = json.load(open('config/models.json'))
def sanitize(o):
    if isinstance(o, dict):
        for k,v in o.items():
            if k.lower() in ('apikey','api_key') and v: o[k] = 'sk-ltm-XXXXXX'
            else: sanitize(v)
    elif isinstance(o, list):
        for i in o: sanitize(i)
sanitize(d)
json.dump(d, open('config/models.json','w'), indent=2)
"
```
