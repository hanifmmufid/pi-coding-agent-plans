# Implementation Plan — Global Pi Frontend Configuration Improvement

**Version:** 1.0  
**Scope:** Global Pi configuration  
**Target:** Semua project yang dijalankan dengan Pi  
**Goal:** Membuat setiap task frontend/UI secara otomatis mengikuti standar visual yang modern, minimal, elegan, light-first, sidebar-first untuk application/dashboard UI, dan wajib tervalidasi secara visual sebelum `DONE`.

---

# 1. Objective

Update global configuration Pi agar user tidak perlu mengulang instruksi frontend pada setiap task.

Setelah setup ini diterapkan, instruksi sederhana seperti:

```text
Buat dashboard monitoring.
```

atau:

```text
Rapikan halaman ini.
```

atau:

```text
/fix layout mobile halaman product.
```

atau:

```text
/execute ai/plans/new-dashboard.md
```

harus otomatis memicu workflow frontend yang benar.

Pi harus otomatis:

1. mendeteksi task frontend/UI/UX,
2. memuat dan menerapkan `frontend-design` skill,
3. mengikuti design system existing jika ada,
4. menggunakan preferensi visual global jika project belum memiliki arah visual,
5. membuat actual rendered UI,
6. memvalidasi desktop dan mobile,
7. melakukan visual fixing loop bila hasil belum cukup baik,
8. tidak menyatakan `DONE` hanya karena build/test teknis pass.

---

# 2. Global Visual Preference

Default preference user untuk application/dashboard frontend:

```text
Theme:
Light-first

Navigation:
Left sidebar preferred

Style:
Modern
Minimal
Elegant
Professional
Clean
Restrained

Quality:
Production-grade
Not wireframe-like
Not generic AI-looking
```

Preferensi ini berlaku ketika:

- project baru belum memiliki design system,
- existing project belum memiliki visual direction yang kuat,
- user tidak memberikan instruksi visual spesifik.

Jika existing project sudah memiliki visual language yang jelas:

> existing product design tetap menjadi source of truth.

Global preference tidak boleh memaksa redesign yang tidak konsisten dengan existing product.

---

# 3. Frozen Requirements

1. Semua task frontend harus otomatis menggunakan frontend workflow.
2. User tidak perlu memanggil `/frontend-design` secara manual.
3. `frontend-design` skill harus dimuat sebelum implementasi frontend yang meaningful.
4. Visual quality adalah bagian dari Definition of Done.
5. Build/test teknis saja tidak cukup untuk frontend.
6. Actual rendered UI harus diperiksa jika browser/screenshot tooling tersedia.
7. Minimum visual validation:
   - desktop sekitar 1440px,
   - mobile sekitar 390px.
8. Existing product design language memiliki prioritas di atas global preference.
9. Untuk greenfield/app baru, default:
   - light theme,
   - left sidebar untuk primary app navigation.
10. Jangan membuat generic AI dashboard.
11. Jangan membuat wireframe-looking UI kecuali diminta.
12. Jangan menggunakan multi-agent frontend workflow secara default.
13. Jangan mengambil screenshot berulang tanpa meaningful visual change.
14. DeepSeek V4 Flash tetap default implementation model.
15. Stronger model hanya digunakan jika memang dibutuhkan.

---

# 4. Out of Scope

Tidak termasuk:

- global redesign otomatis semua existing project,
- auto Figma generation,
- Figma integration,
- design-playbook kompleks,
- multi-agent designer/reviewer,
- screenshot diff CI,
- full visual regression infrastructure,
- automatic model routing,
- dedicated design model,
- theme switcher global,
- branding generator.

---

# 5. Target Global Structure

Global Pi resources:

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
└── ...
```

Frontend additions:

```text
Global:
- frontend-design skill
- browser screenshot capability
- mandatory frontend rules in AGENTS.md
- frontend enforcement in /execute
- frontend enforcement in /fix
- frontend checks in /review
```

---

# 6. Step 1 — Install Global Frontend Design Skill

Install:

```bash
pi install npm:@sentiolabs/pi-frontend-design
```

Expected:

- skill tersedia global,
- setiap project dapat menggunakannya,
- tidak perlu install ulang per repository.

Validation:

- reload Pi,
- verifikasi `frontend-design` muncul sebagai available skill/resource,
- test manual sekali jika perlu.

---

# 7. Step 2 — Install Global Browser Screenshot Capability

Install:

```bash
pi install npm:@scottrbk/browser-screenshot
```

Install browser runtime:

```bash
npx playwright install chromium
```

Jika VPS membutuhkan system dependency:

```bash
npx playwright install-deps chromium
```

Expected:

- Pi dapat mengambil screenshot actual rendered frontend,
- Pi dapat menganalisis screenshot,
- screenshot dapat digunakan dalam validation loop.

---

# 8. Step 3 — Update Global AGENTS.md

File:

```text
~/.pi/agent/AGENTS.md
```

Tambahkan section berikut.

```md
## Mandatory Frontend / UI Workflow

Any task that creates, modifies, fixes, redesigns, or extends frontend/UI/UX must follow this workflow automatically.

Frontend/UI tasks include, but are not limited to:
- application pages
- dashboards
- forms
- tables
- cards
- navigation
- sidebars
- responsive layouts
- landing pages
- website pages
- frontend components
- Odoo custom frontend/UI
- visual bug fixes
- layout changes
- spacing changes
- typography changes
- color/theme changes
- styling changes
- responsive fixes

Do not wait for the user to explicitly request frontend-design workflow.

For meaningful frontend/UI work, you MUST read and apply the `frontend-design` skill before implementation.

### Global Default Visual Preference

When the project does NOT already have a clear established design language, use these defaults:

- Light theme by default.
- Prefer left sidebar navigation for application/dashboard interfaces.
- Modern.
- Minimal.
- Elegant.
- Professional.
- Clean.
- Restrained.
- Production-grade.

Do not produce:
- wireframe-like UI,
- placeholder-looking UI,
- generic AI dashboard aesthetics.

### Existing Product Rule

If the project already has an established design language:

1. Inspect existing screens/components before designing.
2. Treat the existing product as the primary visual reference.
3. Reuse its:
   - typography,
   - spacing,
   - colors,
   - components,
   - navigation,
   - form patterns,
   - table patterns,
   - interaction conventions.
4. New UI must look native to the same product.
5. Do not force the global light/sidebar preference if it would conflict with an intentional established product design.

### Greenfield Application Rule

For a new application/dashboard with no established visual system:

Default to:
- light theme,
- left sidebar primary navigation,
- very light neutral page background,
- white primary surfaces,
- subtle borders,
- restrained shadows,
- dark neutral primary text,
- muted secondary text,
- restrained accent color.

Before building many screens:
1. define visual direction,
2. define typography,
3. define spacing scale,
4. define color roles,
5. define content density,
6. define component language,
7. define responsive behavior,
8. create or update `docs/DESIGN_SYSTEM.md`.

### Design Quality Rules

Prefer quality through:
- typography hierarchy,
- spacing,
- alignment,
- proportion,
- content density,
- restrained color,
- clear interaction states.

Avoid by default:
- excessive gradients,
- decorative blobs,
- excessive rounded cards,
- card-inside-card layouts,
- excessive shadows,
- oversized hero typography,
- random visual effects,
- excessive empty space,
- weak visual hierarchy,
- flat white-on-white grouping.

### Application Navigation Preference

For application/dashboard interfaces with no established navigation pattern:

- Prefer a left sidebar as primary navigation.
- Keep the sidebar compact and scannable.
- Active state must be obvious.
- Hover state should be subtle.
- Main content should remain spacious and readable.
- On mobile, sidebar should become drawer/off-canvas or equivalent compact navigation.

Do not use marketing-style top navigation as the primary pattern for operational dashboards unless the product already uses it or the requirement explicitly asks for it.

### Odoo / Operational UI Principle

For ERP/admin/operational screens:
- preserve information density,
- prioritize usability over decoration,
- avoid turning operational UI into marketing-style layouts,
- keep tables/forms/filters/actions easy to scan.

### Mandatory Visual Validation

Frontend work is NOT DONE when code merely builds successfully.

Before declaring DONE:

1. Render/run the actual page.
2. Perform visual inspection.
3. Validate desktop layout.
4. Validate mobile layout.
5. Check:
   - typography hierarchy,
   - spacing,
   - alignment,
   - visual balance,
   - content density,
   - responsive behavior,
   - design consistency,
   - interaction clarity,
   - overflow/layout defects.
6. Fix meaningful visual weaknesses.
7. Re-render after meaningful fixes.
8. Perform final visual inspection.

If browser/screenshot tooling is available, actual rendered screenshots MUST be used.

Minimum:
- desktop around 1440px width,
- mobile around 390px width.

Do not take repeated screenshots when no meaningful visual change occurred.

Never declare a frontend task DONE without visual validation.
```

---

# 9. Step 4 — Update Global `/execute`

File:

```text
~/.pi/agent/prompts/execute.md
```

Tambahkan:

```md
## Frontend / UI Execution Enforcement

If any implementation step creates or changes frontend/UI/UX:

1. Treat it as a frontend task automatically.
2. Follow the Mandatory Frontend / UI Workflow from global AGENTS.md.
3. Load and apply the `frontend-design` skill.
4. Inspect the existing visual language before making meaningful UI changes.
5. If greenfield, apply the global default visual preference unless the plan specifies another direction.
6. Render the actual UI after implementation.
7. Validate desktop and mobile.
8. Fix meaningful visual issues before completion.
9. Include visual validation evidence in the final report.

Build, lint, or unit-test success alone is NOT sufficient to mark frontend work DONE.
```

Tujuan:

- `/execute` implementation plan otomatis mengikuti frontend workflow,
- user tidak perlu menulis instruksi visual tambahan dalam setiap plan.

---

# 10. Step 5 — Update Global `/fix`

File:

```text
~/.pi/agent/prompts/fix.md
```

Tambahkan:

```md
## Frontend / UI Fix Enforcement

If the reported issue affects frontend/UI/UX, including layout, spacing, styling, responsiveness, theme, navigation, or component appearance:

1. Automatically load and apply the `frontend-design` skill.
2. Inspect the actual rendered page when possible.
3. Identify the visual/functional root cause before editing.
4. Make the smallest correct fix.
5. Render and inspect the result.
6. Validate desktop and mobile when the issue may affect responsiveness.
7. Do not declare DONE without visual validation.
```

---

# 11. Step 6 — Update Global `/review`

File:

```text
~/.pi/agent/prompts/review.md
```

Tambahkan:

```md
## Frontend / UI Review

If the current diff includes frontend/UI changes, review both code and rendered visual result.

Check:
- consistency with existing product,
- typography hierarchy,
- spacing,
- alignment,
- content density,
- component consistency,
- responsive behavior,
- desktop layout,
- mobile layout,
- overflow,
- accessibility of primary actions,
- generic AI-looking patterns,
- wireframe/placeholder appearance,
- excessive cards/shadows/gradients,
- unnecessary visual complexity.

Frontend review is incomplete if only the source diff is reviewed while the rendered result is available.
```

---

# 12. Step 7 — Define Global Greenfield Design Template

Optional but recommended.

Create a reusable template:

```text
~/.pi/agent/prompts/design-foundation.md
```

Purpose:

- dipakai ketika project baru belum punya visual system,
- menghasilkan `docs/DESIGN_SYSTEM.md`,
- tidak perlu mendesain ulang direction per halaman.

Template should establish:

```text
Visual Direction
Theme
Typography
Color Roles
Spacing
Density
Navigation
Cards
Forms
Tables
Responsive Behavior
Motion
Do / Don't
```

Global defaults:

```text
Theme:
Light

App Navigation:
Left sidebar

Style:
Modern
Minimal
Elegant
Professional

Elevation:
Restrained

Cards:
Only for meaningful grouping

Color:
Neutral-first with restrained accent
```

---

# 13. Existing Project vs Greenfield Detection

Pi harus menggunakan aturan berikut.

## Existing Project

Jika ditemukan:
- existing pages,
- design tokens,
- component library,
- established navigation,
- established theme,

maka:

```text
inspect existing
→ follow existing
→ improve consistently
```

Jangan:

```text
global preference
→ override existing product
```

## Greenfield

Jika belum ada coherent UI:

```text
global preference
→ define design foundation
→ create DESIGN_SYSTEM.md
→ implement
```

---

# 14. Global Frontend Completion Gate

Tidak perlu extension custom pada fase ini.

Gunakan instruction gate dahulu.

Frontend `DONE` hanya valid jika:

```text
✓ code works
✓ frontend-design skill applied
✓ actual UI rendered
✓ desktop reviewed
✓ mobile reviewed
✓ visual hierarchy acceptable
✓ spacing/alignment acceptable
✓ responsive behavior acceptable
✓ no obvious overflow
✓ no wireframe appearance
✓ no unresolved meaningful visual issue
✓ final diff reviewed
```

Jika Pi sering melanggar aturan ini setelah beberapa task, baru pertimbangkan custom `completion-gate.ts`.

---

# 15. Visual Validation Loop

Global expected loop:

```text
IMPLEMENT
   ↓
RUN ACTUAL PAGE
   ↓
DESKTOP SCREENSHOT
   ↓
VISUAL CRITIQUE
   ↓
ISSUE?
 ├─ YES → FIX → RENDER AGAIN
 └─ NO
       ↓
MOBILE SCREENSHOT
       ↓
RESPONSIVE CRITIQUE
       ↓
ISSUE?
 ├─ YES → FIX → RENDER AGAIN
 └─ NO
       ↓
FUNCTIONAL CHECK
       ↓
FINAL DIFF REVIEW
       ↓
DONE
```

---

# 16. Screenshot Cost Discipline

To keep Pi efficient:

1. Default maximum initial screenshots:
   - 1 desktop,
   - 1 mobile.
2. Additional screenshot only after meaningful visual fix.
3. Do not screenshot after every tiny CSS edit.
4. Do not run multiple browser agents.
5. Do not spawn a visual reviewer subagent by default.

---

# 17. Model Strategy

Default:

```text
DeepSeek V4 Flash
```

Use for:
- normal frontend implementation,
- existing UI extension,
- frontend fixing,
- responsive fixes,
- table/form/dashboard work,
- screenshot-driven refinement.

Escalate manually to a stronger model only if:
- greenfield visual direction remains poor,
- major product design decision is needed,
- repeated visual iteration still produces mediocre output,
- complex information architecture needs redesign.

Do not auto-escalate initially.

---

# 18. Odoo Global Guidance

Because many operational interfaces may be Odoo-like, add this to global rules only as a general principle:

```md
For ERP/admin/operational interfaces:
- prioritize information density and operational clarity,
- prefer compact application layouts,
- avoid oversized marketing-style cards,
- avoid excessive whitespace,
- preserve discoverable filters/actions/tables/forms.
```

Project-specific Odoo details still belong in that repository's `AGENTS.md`.

---

# 19. Validation After Global Setup

Test the global config on at least 3 scenarios.

## Test A — Existing Frontend

Prompt:

```text
Tambahkan halaman baru yang konsisten dengan aplikasi ini.
```

Expected:
- skill auto loaded,
- existing style inspected,
- no forced redesign,
- screenshot validation executed.

## Test B — Greenfield Dashboard

Prompt:

```text
Buat dashboard admin awal untuk project ini.
```

Expected:
- light-first,
- sidebar-first,
- design foundation created,
- modern/minimal/elegant,
- desktop/mobile validated.

## Test C — Frontend Fix

Prompt:

```text
Rapikan halaman ini, layout mobile masih berantakan.
```

Expected:
- visual root cause inspected,
- frontend skill auto loaded,
- actual render checked,
- fix validated visually.

---

# 20. Acceptance Criteria

- **AC-1:** User tidak perlu memanggil `/frontend-design`.
- **AC-2:** Frontend task otomatis memakai frontend skill.
- **AC-3:** Existing project mengikuti existing visual language.
- **AC-4:** Greenfield app default ke light theme.
- **AC-5:** Greenfield dashboard default ke left sidebar.
- **AC-6:** Desktop visual validation berjalan otomatis.
- **AC-7:** Mobile visual validation berjalan otomatis.
- **AC-8:** Build success saja tidak dianggap DONE.
- **AC-9:** Visual issues diperbaiki sebelum DONE.
- **AC-10:** `/execute` frontend mengikuti workflow otomatis.
- **AC-11:** `/fix` frontend mengikuti workflow otomatis.
- **AC-12:** `/review` frontend memeriksa rendered result bila tersedia.
- **AC-13:** Token usage tetap efisien.
- **AC-14:** Tidak ada multi-agent/design tooling berlebihan.

---

# 21. Definition of Done

Global frontend configuration dianggap selesai jika:

- [ ] `frontend-design` terinstall global.
- [ ] browser screenshot capability terinstall global.
- [ ] Chromium/Playwright berfungsi.
- [ ] global `AGENTS.md` sudah diupdate.
- [ ] `/execute` sudah memiliki frontend enforcement.
- [ ] `/fix` sudah memiliki frontend enforcement.
- [ ] `/review` sudah memiliki frontend review rules.
- [ ] existing project test PASS.
- [ ] greenfield test PASS.
- [ ] frontend fix test PASS.
- [ ] desktop screenshot validation PASS.
- [ ] mobile screenshot validation PASS.
- [ ] user tidak perlu memberi frontend instruction tambahan.

---

# 22. Implementation Order

```text
1. Install frontend-design globally
2. Install browser-screenshot globally
3. Install Playwright Chromium
4. Test browser screenshot
5. Backup ~/.pi/agent/AGENTS.md
6. Update global AGENTS.md
7. Backup execute.md / fix.md / review.md
8. Update /execute
9. Update /fix
10. Update /review
11. Reload Pi
12. Run Test A
13. Run Test B
14. Run Test C
15. Evaluate token usage and visual quality
```

---

# 23. Commands

Install:

```bash
pi install npm:@sentiolabs/pi-frontend-design
pi install npm:@scottrbk/browser-screenshot
npx playwright install chromium
```

If required:

```bash
npx playwright install-deps chromium
```

Reload:

```text
/reload
```

---

# 24. Daily Usage After Setup

No special frontend command required.

Examples:

```text
Buat halaman Products.
```

```text
Tambahkan dashboard baru.
```

```text
/fix tampilan mobile tabel ini berantakan
```

```text
/execute ai/plans/customer-dashboard.md
```

Expected automatically:

```text
detect frontend
→ load frontend-design
→ inspect existing design
→ implement
→ render
→ desktop visual validation
→ mobile visual validation
→ fix if needed
→ final review
→ DONE
```

---

# 25. Non-Goals / Anti-Over-Engineering

Do NOT add yet:

- design-playbook,
- multi-agent UI team,
- visual reviewer model,
- automatic model router,
- Figma workflow,
- full browser automation suite,
- screenshot regression CI.

Only add these later if actual usage proves the need.

---

# 26. Final Architecture

```text
GLOBAL PI
│
├── DeepSeek V4 Flash
│
├── frontend-design skill
│
├── browser screenshot
│
├── AGENTS.md frontend rules
│
├── /execute frontend enforcement
│
├── /fix frontend enforcement
│
├── /review frontend validation
│
└── visual completion rules
        │
        ▼
EVERY PROJECT
        │
        ├── Existing UI
        │     → follow existing design
        │
        └── Greenfield
              → light-first
              → sidebar-first
              → DESIGN_SYSTEM.md
```

---

# 27. Final Decision

Global Pi frontend behavior yang diinginkan:

> **Setiap kali Pi menyentuh frontend, Pi otomatis bertindak seperti implementation agent yang peduli pada kualitas visual, bukan sekadar code generator.**

Default greenfield preference:

> **light, sidebar-based, modern, minimal, elegant, professional.**

Existing project preference:

> **follow the product's existing design language first.**

Frontend completion:

> **functional correctness + visual correctness + responsive validation.**
