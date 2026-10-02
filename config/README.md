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
├── AGENTS.md                    → Global execution rules (permission gate, scope, model stack, mode LEARNING/EXECUTION)
├── models.json                  → 20 model terdaftar via LiteLLM (apiKey disensor)
├── settings.json                → packages, defaultProvider, defaultModel
├── quant-tool.json              → Config tool quant_review (nut-deepseek-v4.1-flash)
├── vision-tool.json             → Config tool describe_image (yond-gpt-6-astra)
├── fovea.json                   → Config Pi Fovea (sync mode, budget)
├── npm/
│   └── package.json             → Packages terpasang (frontend-design, screenshot, fovea)
├── prompts/                     → Template prompt (/execute, /fix, /review, quant, dll)
├── extensions/                  → Extension TypeScript (permission-gate, protected-paths, quant-review-tool)
└── skills/                      → SKILL.md (frontend-design, codebase-study, trading-backtest-analysis)
```

> 🎓 **Skill pihak ketiga (tidak di-vendor):** `karpathy-guidelines` dipasang sebagai
> **git package** yang dipin ke commit, bukan disalin ke repo ini (agar tidak ada
> duplikasi konten pihak ke-3 dan versinya reproducible).

---

## ⚙️ Ringkasan Config Aktif

### models.json — 20 model (provider: LiteLLM → localhost:4000)

| Model | Akun/Provider | Peran |
|-------|---------------|-------|
| `cmd-deepseek-v4-flash` | Command Code | Terdaftar — ⚠️ kredit akun 1 habis |
| `cmd-deepseek-v4.1-flash` | Command Code | Terdaftar — ⚠️ kredit akun 1 habis |
| `cmd-deepseek-v4-pro` | Command Code | Terdaftar — ⚠️ kredit akun 1 habis |
| `cmd-qwen3.8-max` | Command Code | Terdaftar — ⚠️ kredit akun 1 habis |
| `cmd-muse-1.2-contributor` | Command Code | Terdaftar — ⚠️ kredit akun 1 habis |
| `cmd-glm-5.3-flash` | Command Code | Terdaftar — ⚠️ kredit akun 1 habis |
| `cmd2-deepseek-v4-flash` | Command Code (akun 2) | Terdaftar — ⚠️ kredit akun 2 habis |
| `cmd2-deepseek-v4.1-flash` | Command Code (akun 2) | Terdaftar — ⚠️ kredit akun 2 habis |
| `cmd2-deepseek-v4-pro` | Command Code (akun 2) | Terdaftar — ⚠️ kredit akun 2 habis |
| `cmd2-qwen3.8-max` | Command Code (akun 2) | Terdaftar — ⚠️ kredit akun 2 habis |
| `cmd2-muse-1.2-contributor` | Command Code (akun 2) | Terdaftar — ⚠️ kredit akun 2 habis |
| `cmd2-glm-5.3-flash` | Command Code (akun 2) | Terdaftar — ⚠️ kredit akun 2 habis |
| `nut-deepseek-v4.1-flash` | Nutaraline (gateway) | ⭐ Quant reviewer (`quant-tool.json`) |
| `nut-space-bunny-alpha` | Nutaraline (gateway) | Text-only |
| `nut-mimo-v2.6-flash` | Nutaraline (gateway) | Text-only |
| `yond-gpt-6-astra` | **Yonda** (gateway) | ⭐ Executor default (`settings.json`) + vision (`vision-tool.json`) |
| `yond-auto` | Yonda (gateway) | Context 1M, paling lambat |
| `yond-gpt-5.6-sol` | Yonda (gateway) | Context 1M, vision tidak akurat |
| `yond-gpt-5.6-terra` | Yonda (gateway) | Vision tidak akurat |
| `yond-gpt-5.6-luna` | Yonda (gateway) | Vision akurat |

**Kebijakan (2026-10-02):** yang **benar-benar hidup** hanya `yond-*` (5) + `nut-*` (3) — karena itu
default executor & vision dipindah ke **Yonda** dan quant reviewer ke **Nutaraline**.
Command Code **akun 1 dan akun 2 sama-sama kehabisan kredit** (`400 insufficient credits`), jadi seluruh
`cmd-*`/`cmd2-*` gagal; OpenCode Go key invalid; `nut-glm-5.3-flash` hilang dari katalog gateway.
Entri `cmd-*`/`cmd2-*` sengaja tetap terdaftar agar langsung berfungsi kembali setelah top-up kredit.

> Yang dihapus 2026-10-02: 5× `go-*` + `pi-qwen3.8-max` (key OpenCode Go invalid),
> `cmd-minimax-m3-free` + `cmd2-minimax-m3-free` (tier gratis pensiun), `nut-glm-5.3-flash` (hilang dari katalog).

### settings.json
- `defaultProvider: "litellm"`
- `defaultModel: "yond-gpt-6-astra"` (sejak 2026-10-02, karena `cmd-*` kehabisan kredit)
- Packages: frontend-design, browser-screenshot, pi-fovea, andrej-karpathy-skills (pin `@2c60614`)

### quant-tool.json (tool `quant_review`)
```json
{ "model": "nut-deepseek-v4.1-flash", "fallbacks": ["yond-gpt-6-astra"], "maxTokens": 32000, "retries": 2 }
```

### vision-tool.json (tool `describe_image`)
```json
{ "model": "yond-gpt-6-astra", "maxDimension": 1568, "jpegQuality": 85 }
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

> 📌 **Modes + Learning Mode:** `AGENTS.md` memuat section `Modes`
> (LEARNING vs EXECUTION; **default = EXECUTION**) dan `Learning Mode`
> (explanation-first: READ → TRACE → PREDICT → PROPOSE → CHANGE → TEST → EXPLAIN).
> Delta dari skill Karpathy yang bersifat selalu-on dimasukkan ke section existing
> (`Implementation`: traceability + orphan rule; `Validation Loop`: repro-first untuk bug;
> `Completion Gate`: proporsionalitas trivial vs kompleks) — **tanpa section duplikat**.
> `EXAMPLES.md` skill **tidak** disalin ke `AGENTS.md` (agar tidak membebani context).

## 🔌 Extensions (`config/extensions/`)

| File | Fungsi |
|------|--------|
| `permission-gate.ts` | Gate izin AUTO/ASK/BLOCK untuk command berbahaya + **auto-approve per pane** (toggle `AUTO` di panel tab-dashboard; state `~/.pi/agent/auto-approve.json`, audit `~/.pi/agent/auto-approve.log`) |
| `protected-paths.ts` | Proteksi path sensitif (.env, credentials, *.pem, dll) |
| `quant-review-tool.ts` | Tool `quant_review` + command `/quant` (delegasi model via LiteLLM) |
| `vision-tool.ts` | Tool `describe_image` + command `/vision` (selector model + list) |

## 🎓 Skills (`config/skills/`)

| Skill | Lokasi aktif | Fungsi |
|-------|-------------|--------|
| frontend-design | npm package | UI/UX production-grade (wajib untuk tugas frontend) |
| codebase-study | `~/.pi/agent/skills/` | Pemahaman repo baru, dokumentasi modular |
| trading-backtest-analysis | `~/.pi/agent/skills/` | Quant review scope-aware + Execution Contract |
| karpathy-guidelines | git package (pin `@2c60614`) | Referensi tambahan: contoh simplicity, surgical changes, goal-driven execution (`EXAMPLES.md`). Dipanggil on-demand via `/skill:karpathy-guidelines` |

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

Skill pihak ketiga `karpathy-guidelines` **tidak** disalin ke repo — pasang ulang dengan
perintah yang sama (pin commit) agar reproduktif:

```bash
pi install https://github.com/multica-ai/andrej-karpathy-skills@2c60614
```

> ℹ️ State runtime **tidak** ikut di-commit (bukan config):
> `~/.pi/agent/auto-approve.json` (toggle auto-approve per pane, ditulis dashboard)
> dan `~/.pi/agent/auto-approve.log` (audit perintah destruktif yang di-auto-approve).

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
