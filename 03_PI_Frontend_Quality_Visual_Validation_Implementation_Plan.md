# Implementation Plan — Pi Frontend Quality & Visual Validation Workflow

**Version:** 1.0  
**Goal:** Membuat Pi otomatis memperlakukan setiap pekerjaan frontend/UI sebagai pekerjaan yang harus memiliki kualitas visual production-grade, konsisten dengan design system existing, responsive, dan tervalidasi secara visual sebelum boleh dinyatakan `DONE`.

---

# 1. Objective

Setelah implementation selesai, setiap task frontend harus otomatis:

1. Mendeteksi bahwa task termasuk frontend/UI/UX.
2. Memuat dan mengikuti `frontend-design` skill.
3. Mengikuti design language existing jika project sudah memiliki UI.
4. Membentuk design foundation jika project greenfield.
5. Menghasilkan UI yang modern, minimal, elegan, profesional, production-grade, bukan wireframe dan bukan generic AI UI.
6. Menjalankan halaman aktual.
7. Melakukan visual validation menggunakan screenshot.
8. Memeriksa desktop dan mobile.
9. Melakukan fixing loop jika ada kekurangan visual.
10. Tidak menyatakan `DONE` hanya karena build/test teknis pass.

---

# 2. Current State

Setup Pi saat ini sudah memiliki:

- global `AGENTS.md`
- project `AGENTS.md`
- `/fix`
- `/execute`
- `/review`
- permission gate
- protected paths
- DeepSeek V4 Flash sebagai default model
- autonomous fix/validation loop

Gap saat ini: frontend quality belum menjadi first-class completion requirement.

---

# 3. Expected Behavior

User cukup memberi instruksi normal:

```text
Buat halaman dashboard monitoring.
```

atau:

```text
Rapikan halaman profile ini.
```

atau:

```text
/execute ai/plans/dashboard-v2.md
```

Tanpa harus menambahkan:

```text
pakai frontend-design
buat modern minimalis
cek mobile
ambil screenshot
review UI
```

Expected flow:

```text
Frontend task detected
        ↓
Load frontend-design skill
        ↓
Inspect existing UI/design system
        ↓
Define visual direction if needed
        ↓
Implement
        ↓
Run actual page
        ↓
Desktop screenshot
        ↓
Visual critique
        ↓
Fix if needed
        ↓
Mobile screenshot
        ↓
Responsive critique
        ↓
Fix if needed
        ↓
Functional validation
        ↓
Final visual review
        ↓
DONE
```

---

# 4. Frozen Requirements

1. Frontend quality adalah bagian dari Definition of Done.
2. Pi tidak boleh menganggap frontend selesai hanya karena build/syntax/server pass.
3. Setiap frontend task harus menggunakan `frontend-design` skill.
4. User tidak perlu memanggil `/frontend-design` manual.
5. Existing project harus mengikuti existing design language.
6. Greenfield project harus memiliki coherent design foundation.
7. Minimal visual validation:
   - desktop viewport
   - mobile viewport
8. Screenshot ulang hanya jika ada meaningful visual change/fix.
9. Tidak menggunakan multi-agent frontend workflow secara default.
10. Tidak menambah design tooling berlebihan pada fase ini.
11. DeepSeek V4 Flash tetap default implementation model.
12. Stronger model hanya digunakan bila memang perlu.

---

# 5. Out of Scope

Fase ini tidak mencakup:

- Figma integration
- auto Figma generation
- multi-agent designer + reviewer
- design-playbook workflow kompleks
- full browser automation framework
- visual regression CI
- screenshot diff CI
- automatic model routing
- dedicated frontend reviewer model
- redesign seluruh existing application
- perubahan branding tanpa requirement

---

# 6. Implementation Components

Komponen utama:

```text
1. Global frontend-design skill
2. Browser screenshot capability
3. Mandatory global frontend rules
4. /execute frontend enforcement
5. /fix frontend enforcement
```

Optional per project:

```text
6. docs/DESIGN_SYSTEM.md
```

---

# 7. Step 1 — Install Frontend Design Skill

Install global:

```bash
pi install npm:@sentiolabs/pi-frontend-design
```

Tujuan:

- memberi Pi design guidance lebih kuat
- menghindari generic AI UI
- meningkatkan perhatian pada typography, spacing, hierarchy, composition, density, dan aesthetic direction

Validation:

```text
Pi dapat melihat skill `frontend-design`.
```

---

# 8. Step 2 — Install Browser Screenshot Capability

Install:

```bash
pi install npm:@scottrbk/browser-screenshot
```

Install Chromium:

```bash
npx playwright install chromium
```

Jika dependency Linux belum ada:

```bash
npx playwright install-deps chromium
```

Validation:

1. Jalankan sample frontend/local page.
2. Ambil screenshot desktop.
3. Pastikan screenshot berhasil.
4. Pastikan Pi dapat membaca/menganalisis screenshot.

---

# 9. Step 3 — Update Global AGENTS.md

File:

```text
~/.pi/agent/AGENTS.md
```

Tambahkan:

```md
## Mandatory Frontend Workflow

Any task that creates, modifies, fixes, redesigns, or extends frontend/UI/UX must use the `frontend-design` skill.

This includes:
- new pages
- dashboards
- forms
- tables
- cards
- navigation
- responsive layouts
- landing pages
- website pages
- custom Odoo frontend/UI
- visual bug fixes
- spacing changes
- typography changes
- color changes
- layout changes
- styling changes

Do not wait for the user to explicitly invoke `/frontend-design`.

When a task matches frontend/UI work, you MUST read and apply the `frontend-design` skill before implementation.

### Visual Quality Target

Frontend work must aim for:
- modern
- minimal
- elegant
- professional
- visually complete
- production-grade
- coherent
- polished

Do not produce wireframe-like or placeholder-looking UI unless explicitly requested.

Avoid generic AI-generated aesthetics.

Avoid by default:
- excessive gradients
- decorative blobs
- unnecessary cards
- excessive rounded containers
- excessive shadows
- oversized hero typography
- random visual effects
- excessive empty space
- inconsistent spacing
- weak visual hierarchy

Prefer quality through:
- typography
- spacing
- alignment
- hierarchy
- proportion
- content density
- restrained color usage
- clear interaction states

### Existing Product

For an existing product:
1. Inspect existing screens/components before designing.
2. Identify the current visual language.
3. Reuse existing layout, typography, colors, spacing, components, buttons, forms, tables, navigation, and interaction conventions.
4. New UI must look native to the same product.
5. Do not introduce a separate design language without explicit instruction.

### Greenfield Product

For a greenfield project with no established visual system:
1. Define a coherent visual direction before coding.
2. Define typography, spacing scale, color roles, content density, component language, radius philosophy, shadow philosophy, navigation pattern, and responsive behavior.
3. Create or update `docs/DESIGN_SYSTEM.md`.
4. Use that design system consistently.

### Mandatory Visual Validation

Frontend work is NOT DONE when code merely builds successfully.

Before declaring DONE:
1. Run/render the actual page.
2. Perform visual inspection.
3. Validate desktop layout.
4. Validate mobile layout.
5. Check typography hierarchy, spacing, alignment, visual balance, responsive behavior, design consistency, interaction clarity, content density, and obvious overflow/layout defects.
6. Fix meaningful visual weaknesses.
7. Re-render after meaningful fixes.
8. Perform final visual inspection.

If screenshot/browser tooling is available, visual validation MUST use the actual rendered UI.

Minimum visual validation:
- desktop around 1440px width
- mobile around 390px width

Do not take repeated screenshots when no meaningful visual change occurred.

Never declare a frontend task DONE without visual validation.
```

---

# 10. Step 4 — Odoo-Specific Frontend Rules

Tambahkan ke project `AGENTS.md` Odoo:

```md
## Odoo Frontend / Backend UI

When creating or modifying Odoo UI:

- Preserve Odoo's operational information density.
- Reuse existing Odoo interaction conventions.
- Reuse existing project-specific UI patterns.
- Do not turn backend/admin screens into marketing-style pages.
- Avoid oversized cards and excessive whitespace.
- Do not sacrifice usability for decoration.
- Tables, filters, forms, kanban, breadcrumbs, search controls, buttons, and actions should feel native to the existing Odoo environment.
- Custom dashboards may improve visual hierarchy, but should remain operational and information-dense.
- Inspect existing Odoo/project screens before introducing new visual patterns.
```

---

# 11. Step 5 — Update `/execute`

File:

```text
~/.pi/agent/prompts/execute.md
```

Tambahkan:

```md
## Frontend Tasks

If any implementation step creates or changes frontend/UI/UX:

1. Follow the mandatory frontend workflow from AGENTS.md.
2. Load and apply the `frontend-design` skill before implementation.
3. Inspect the current product design language if one exists.
4. Render the actual UI after implementation.
5. Perform visual validation.
6. Validate at desktop and mobile viewport.
7. Fix meaningful visual issues before completion.
8. Include visual validation evidence in the final report.

Build/test success alone is not sufficient for frontend completion.
```

---

# 12. Step 6 — Update `/fix`

File:

```text
~/.pi/agent/prompts/fix.md
```

Tambahkan:

```md
## Frontend/UI Fixes

If the reported issue is visual, layout, responsive, styling, or frontend related:

- load and apply the `frontend-design` skill,
- inspect the actual rendered page,
- identify the visual root cause,
- make the smallest correct visual fix,
- validate the actual rendered result,
- check desktop and mobile behavior when relevant,
- do not declare DONE without visual inspection.
```

---

# 13. Step 7 — Optional DESIGN_SYSTEM.md

Untuk greenfield:

```text
docs/DESIGN_SYSTEM.md
```

Minimal isi:

```md
# Design System

## Visual Direction
Modern, minimal, elegant, calm, professional.

## Typography
...

## Color Roles
...

## Spacing
...

## Content Density
...

## Border Radius
Restrained.

## Shadows
Rare. Prefer borders, spacing, and background contrast.

## Cards
Use only when meaningful grouping requires containment.

## Forms
...

## Tables
...

## Navigation
...

## Responsive Behavior
...

## Motion
Subtle and functional only.

## Do
- strong hierarchy
- consistent spacing
- restrained color
- intentional density

## Don't
- excessive gradients
- blobs
- unnecessary cards
- oversized typography
- random effects
```

Existing project tidak wajib membuat file ini jika design system sudah jelas dari UI/code existing.

---

# 14. Frontend Validation Loop

```text
IMPLEMENT
   ↓
RUN PAGE
   ↓
DESKTOP SCREENSHOT
   ↓
VISUAL CRITIQUE
   ↓
ISSUE?
 ┌───────┴────────┐
 YES              NO
 ↓                 ↓
FIX             MOBILE SCREENSHOT
 ↓                 ↓
RENDER          RESPONSIVE CRITIQUE
 ↓                 ↓
REVIEW         ISSUE?
              ┌───┴───┐
             YES      NO
              ↓        ↓
             FIX    FINAL REVIEW
              ↓        ↓
            RENDER    DONE
```

---

# 15. Visual Review Checklist

## Layout
- alignment konsisten
- grid masuk akal
- whitespace cukup tetapi tidak berlebihan
- composition seimbang

## Typography
- hierarchy jelas
- font sizes proporsional
- title tidak oversized
- readable line length

## Spacing
- spacing konsisten
- tidak terlalu rapat
- tidak ada random gap
- vertical rhythm konsisten

## Components
- button hierarchy jelas
- cards intentional
- form consistent
- table readable
- states jelas

## Color
- restrained
- contrast cukup
- accent intentional
- tidak ramai

## Responsiveness
- tidak horizontal overflow
- layout tidak collapse buruk
- action tetap accessible
- text tetap readable
- table/form punya mobile behavior yang masuk akal

## Product Consistency
- cocok dengan existing app
- tidak terasa seperti produk berbeda
- tidak introduce visual language baru tanpa alasan

---

# 16. Frontend Acceptance Criteria

Gunakan bila relevan:

```text
VA-1
UI mengikuti existing product design language atau frozen design system.

VA-2
Tidak ada bagian yang terlihat seperti wireframe/placeholder.

VA-3
Typography hierarchy jelas.

VA-4
Spacing dan alignment konsisten.

VA-5
Card/container hanya digunakan jika meaningful.

VA-6
Desktop layout visually balanced pada sekitar 1440px.

VA-7
Mobile layout usable pada sekitar 390px tanpa horizontal overflow.

VA-8
Primary actions mudah dikenali.

VA-9
Tidak ada excessive gradients, decorative blobs, atau random visual effects.

VA-10
Final visual screenshot review selesai.
```

---

# 17. Frontend Definition of Done

Frontend task hanya boleh `DONE` jika:

```text
✓ implementation complete
✓ functional validation passes
✓ follows existing design language or design system
✓ frontend-design skill applied
✓ actual page rendered
✓ desktop visually reviewed
✓ mobile visually reviewed
✓ no obvious overflow/responsive defect
✓ typography hierarchy acceptable
✓ spacing/alignment acceptable
✓ no wireframe/placeholder appearance
✓ final visual inspection passed
✓ final diff reviewed
```

---

# 18. Final Report Requirement

Untuk frontend task:

```md
## Visual Validation

Desktop:
PASS / FAIL
Evidence:
...

Mobile:
PASS / FAIL
Evidence:
...

Design consistency:
PASS / FAIL

Responsive:
PASS / FAIL

Visual issues found and corrected:
- ...

Remaining visual issues:
None / ...
```

---

# 19. Model Strategy

Default:

```text
Pi + DeepSeek V4 Flash
```

Cocok untuk:
- implementing existing design
- extending established UI
- fixing frontend
- responsive correction
- dashboard/page creation dengan design system jelas

Pertimbangkan stronger model hanya jika:
- greenfield design direction sulit
- visual output tetap mediocre setelah evidence-driven iteration
- high-impact product design decision
- design system besar perlu dibuat dari nol

Recommended:

```text
Strong model
→ define initial visual direction / key screen
→ freeze design system

DeepSeek V4 Flash
→ implement subsequent pages
→ visual validate
```

---

# 20. Safety / Cost Rules

1. Jangan screenshot berulang tanpa meaningful change.
2. Minimum 1 desktop + 1 mobile screenshot.
3. Screenshot tambahan hanya setelah fixing meaningful issue.
4. Jangan spawn frontend reviewer subagent default.
5. Jangan install browser/design package tambahan tanpa kebutuhan nyata.
6. Jangan tambah design-playbook pada fase ini.
7. Pertahankan single-agent execution selama hasil memadai.

---

# 21. Validation Plan

Lakukan 3 pilot task.

## Pilot 1 — Existing UI Extension

```text
Tambahkan satu halaman/dashboard baru ke existing application.
```

Expected:
- existing UI diinspect
- frontend-design dipakai
- hasil konsisten
- desktop + mobile validated

## Pilot 2 — Frontend Fix

```text
Rapikan spacing/layout halaman existing yang berantakan.
```

Expected:
- rendered page diinspect
- visual root cause identified
- minimal visual fix
- screenshot validation

## Pilot 3 — Greenfield Page

```text
Buat dashboard awal project baru.
```

Expected:
- visual direction ditentukan
- `docs/DESIGN_SYSTEM.md` dibuat/update
- page polished
- desktop/mobile pass

---

# 22. Success Criteria

Implementation dianggap sukses jika:

1. User tidak perlu meminta `/frontend-design` manual.
2. Task frontend otomatis memicu design workflow.
3. Existing UI tetap konsisten.
4. Greenfield UI punya design foundation.
5. Pi tidak berhenti hanya setelah build pass.
6. Desktop visual review dilakukan.
7. Mobile visual review dilakukan.
8. Visual issues difix sebelum DONE.
9. Hasil tidak terlihat seperti wireframe.
10. Hasil tidak terlihat generic AI-generated.
11. Token usage tetap efisien.
12. Tidak ada multi-agent/design tooling berlebihan.

---

# 23. Implementation Order

```text
1. Install frontend-design
2. Install browser-screenshot
3. Install Playwright Chromium
4. Test screenshot capability
5. Update global AGENTS.md
6. Update /execute
7. Update /fix
8. Update Odoo project AGENTS.md
9. Reload Pi
10. Test Pilot 1
11. Test Pilot 2
12. Test Pilot 3
13. Evaluate results
```

---

# 24. Commands Summary

```bash
pi install npm:@sentiolabs/pi-frontend-design
pi install npm:@scottrbk/browser-screenshot
npx playwright install chromium
```

Jika diperlukan:

```bash
npx playwright install-deps chromium
```

Reload:

```text
/reload
```

---

# 25. Daily Usage After Implementation

Tidak perlu special command.

Contoh:

```text
Buat halaman dashboard monitoring program.
```

Pi otomatis:

```text
frontend detected
→ frontend-design
→ inspect design
→ implement
→ render
→ screenshot desktop
→ review
→ screenshot mobile
→ review
→ fix if needed
→ DONE
```

Untuk implementation plan:

```text
/execute ai/plans/dashboard-v2.md
```

Untuk frontend bug:

```text
/fix sidebar pada mobile overlap dengan content
```

---

# 26. Decision Summary

Final architecture:

```text
Pi
│
├── DeepSeek V4 Flash
├── frontend-design skill
├── browser screenshot
├── global frontend workflow
├── existing-design inspection
├── optional DESIGN_SYSTEM.md
├── desktop visual validation
├── mobile visual validation
└── fixing loop
```

Prinsip akhir:

> **Frontend tidak selesai ketika code berhasil dibuat. Frontend selesai ketika behavior benar dan hasil aktualnya terlihat production-grade.**
