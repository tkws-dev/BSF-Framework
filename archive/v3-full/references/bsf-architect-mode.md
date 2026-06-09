# BSF Architect Mode

## Full Flow

```
User Request → Identify Project → BSF 00 → 01 → 02 → [APPROVE] → BUILD UI → 03 → 04 → 05
                                       │                        │
                                    Phase 1              ⚠️ Build Screens
                                 (Stakeholder)            ก่อนทำ Phase 2!
```

⚠️ **MANDATORY GATE: After Phase 1 approval, BUILD ACTUAL UI FIRST.**
Do NOT jump to Phase 2 blueprint (03-05). The stakeholder just approved screens in 02 — they want real working UI next, not more documentation. Build all SCR screens as a working React app immediately. Only after the user sees and interacts with real screens, then continue to Phase 2 blueprint. Violating this causes frustration, wasted sessions, and rework. See `pitfalls.md`.

## Phase 1: Stakeholder Deliverable (BSF 00-02)

**Goal:** ให้ผู้ใหญ่เห็นภาพ — "เราจะสร้างอะไร, หน้าตาเป็นยังไง"

→ โหลด `bsf-00-requirements.md`, `bsf-01-core-function.md`, `bsf-02-interface.md`

**Output:** `Master Blueprint.html` (single HTML — Tailwind + Mermaid + FontAwesome)

**Narrative arc:**
1. Business Story → ปัญหาจริง, คนจริง, ข้อมูลหน้างาน
2. Requirements → KPIs, Scope, Actors, FR
3. Core Function → DFD, Sequence, State Machine
4. Interface UI → SCR screens, CRUD map

**Narrative Bridge pattern (ทุก transition):**
1. ทวนสิ่งที่เพิ่งรู้ — "หลังจากที่เราเห็น..."
2. บอกว่าทำไมถึงต้องไปขั้นตอนนี้ — "...ถึงเวลา..."
3. สร้าง momentum — "เพื่อให้..."

**Confirmation Gate:** Stakeholder sign-off → **BUILD UI** → แล้วค่อยเข้า Phase 2

**After Approval — Build Screens (MANDATORY):**
1. Scaffold React + Vite project (use `react-project-init` skill)
2. Build all SCR screens as working components with real UI
3. Open in browser — let stakeholder see and interact
4. Only when stakeholder is happy with real screens → proceed to Phase 2 blueprint

## Phase 2: Developer Deliverable (BSF 03-05)

**Prerequisite:** Real UI screens built and approved from Phase 1.

**Goal:** ให้ Dev รู้ว่าสร้างยังไง — Tech, DB, API, Roadmap

→ โหลด `bsf-03-database.md`, `bsf-04-api.md`, `bsf-05-implementation.md`

**เริ่มด้วย:** Technology Stack — Dev ต้องรู้ก่อนว่าใช้ React, Express, Prisma, PostgreSQL

**Tech Stack format:** 3-column grid cards (Frontend/Backend/Infra) + "ทำไมถึงเลือก" inline (ไม่แยก ADR)

**กฎสำคัญ:**
- Phase 1 ห้ามแตะหลังอนุมัติ
- Phase 2 = ก๊อป v1.0 ทั้งหมด + ต่อของใหม่ — narrative style เดียวกัน
- ถ้า v1.0 ถูก stakeholder อนุมัติแล้ว → สร้าง Phase 2 เป็นไฟล์ใหม่ `Development Blueprint (Phase 2).html`
- อย่าสร้าง v2.0 ที่ reinvent v1.0 — extend, never replace

## Dual Output

ทุก Part ผลิต 2 ไฟล์พร้อมกัน:

| Blueprint | Companion |
|-----------|-----------|
| ER Diagram + คำอธิบาย | `schema.prisma` |
| API cards จัดกลุ่มตาม SCR | `openapi.yaml` |
| State Machine diagram | `state-machine.yaml` |
| Roadmap | `tasks.yaml` |

Companion ต้องเป๊ะ — validation rules, error codes, RBAC, state transitions — explicit
