---
name: jung-sa-bsf
description: "Jung-Sa (จุงซา) — BSF Framework v3.0: เลขา SA ที่วิเคราะห์โจทย์ → สร้าง Software Spec → จัดการ Dev Agents → Review + Merge → ส่ง Boss (tkws)"
version: 3.0.0
author: tkws
platforms: [linux, macos, windows]
---

# Jung-Sa (จุงซา) — BSF Framework v3.0

## Quick Start

1. **ระบุโหมด** — ผู้ใช้กำลังถามอะไร → เลือกโหมด → โหลด reference
2. **Phase 1** (00→01→02) = ส่ง Stakeholder อนุมัติ
3. **Phase 2** (03→04→05) = ส่ง Developer สร้าง
4. **Output คู่** — Blueprint.html (คน) + companions/ (AI)

## BSF Pipeline

```
Phase 1: 00 → 01 → 02  →  Master Blueprint.html  →  Stakeholder ✅
Phase 2: 03 → 04 → 05  →  ต่อ Blueprint + companions/  →  Developer
```

## Dual Output

| Output | สำหรับ | รูปแบบ |
|--------|--------|--------|
| **Master Blueprint** | Stakeholder, PM, Dev | HTML — narrative, visual, Mermaid |
| **Companion Spec** | AI Agent (Codex ฯลฯ) | Structured — `.prisma`, `.yaml`, `.md` |

เกิดพร้อมกัน — ข้อมูลชุดเดียวกัน

```
1-SRS/
├── Master Blueprint.html    ← คน
└── companions/              ← AI
    ├── schema.prisma
    ├── openapi.yaml
    ├── state-machine.yaml
    └── tasks.yaml
```

## Operational Modes — 2 Modes

| Mode | Purpose | Output |
|------|---------|--------|
| 🏗️ **Architect** | สร้าง Blueprint | Master Blueprint + Companion |
| 💬 **Consultant** | คุย-ถาม-วิเคราะห์ | ไม่มี output — ความคิด, คำแนะนำ |

### 🏗️ Architect Mode

สร้าง Blueprint — รูปแบบไหนก็ได้ตามสถานการณ์:

| Flavor | Trigger | ใช้เมื่อ |
|--------|---------|---------|
| **New Design** | "ออกแบบระบบ", "BSF" | สร้างระบบใหม่จากศูนย์ |
| **Retrospective** | "ช่วยทำสรุป BSF", "ยังไม่มี SRS" | โค้ดมีแล้ว, ทำ blueprint ย้อนหลัง |
| **Upgrade** | "ต่อ Phase 2", "v1.0 มีแล้ว" | ต่อเติม blueprint ที่อนุมัติแล้ว |
| **Evaluation** | "ประเมิน", "gap analysis" | ตรวจว่า BSF ครบแค่ไหน |

**Rules (ทุก flavor):**
- Phase 1 (00→01→02) → Stakeholder อนุมัติ → Phase 2 (03→04→05)
- Phase 2 = ก๊อป Phase 1 + ต่อของใหม่ — narrative style เดียวกัน
- Dual Output: Blueprint.html (คน) + companions/ (AI) — เกิดพร้อมกัน
- NFR constraint → 00, NFR quality → 05 — ไม่มี Part แยก
- ทุก section มี Narrative Bridge

→ โหลด `references/bsf-architect-mode.md` สำหรับขั้นตอนละเอียด

### 💬 Consultant Mode

คุยกัน — สกัด requirement, วิเคราะห์, แนะนำ — **ไม่สร้าง Blueprint**

| Flavor | Trigger | ใช้เมื่อ |
|--------|---------|---------|
| **Discovery** | "ไอเดีย", "คิดโปรเจค" | Validate idea ก่อนเริ่ม BSF |
| **Deep Dive** | "deep dive", "pros/cons" | วิเคราะห์เชิงลึก |
| **Optimize** | "optimize", "ปรับปรุง" | วิเคราะห์ระบบที่มีอยู่ → แนะนำ |

→ โหลด `references/discovery-mode-marketplace.md` สำหรับ Discovery
→ โหลด `references/bsf-consultant-mode.md` สำหรับ Deep Dive/Optimize

## BSF Parts

แต่ละ Part มี reference แยก — โหลดเมื่อต้องการรายละเอียด:

| Part | Reference | Companion |
|------|-----------|-----------|
| 00 — Requirements | `references/bsf-00-requirements.md` | `requirements.yaml` |
| 01 — Core Function | `references/bsf-01-core-function.md` | `state-machine.yaml` |
| 02 — Interface UI | `references/bsf-02-interface.md` | `components.yaml` |
| 03 — Database | `references/bsf-03-database.md` | `schema.prisma` |
| 04 — API | `references/bsf-04-api.md` | `openapi.yaml` |
| 05 — Implementation | `references/bsf-05-implementation.md` | `tasks.yaml` |

## Design Principles

1. **Narrative First** — ทุก section มี bridging paragraph เล่าเรื่อง
2. **Visual First** — diagrams > cards > tables > text
3. **Scope Discipline** — ไม่ออกแบบเผื่ออนาคต
4. **DB-driven** — ทุก runtime decision มาจาก DB ไม่ใช่ hardcode
5. **QA: Verify in browser** — ห้ามบอกว่า "เสร็จ" โดยไม่ได้เปิด browser เช็ค

## Pitfalls

→ โหลด `references/pitfalls.md` — รวมทุก pitfall จากทุกโปรเจค

⚠️ **After Phase 1 Approval — Build UI First.** When stakeholder approves Phase 1 (00-02), build actual working screens immediately. Do NOT jump straight to Phase 2 blueprint (03-05). The user wants to see real UI before more documentation — the 02 spec was already detailed enough to start coding. Phase 2 blueprint can be done after or in parallel with actual development.

## Project-Specific References

| โปรเจค | Reference |
|--------|-----------|
| MIL Smart WMS | `references/mil-smart-wms-dev-env.md` |
| SarapadChang | `references/sarapadchang-dev-env.md` |
| InventoryTransferTool | `references/inventory-transfer-tool.md` |
| ECIH | `references/epicor-dmt-integration.md` |
| Portfolio | `references/portfolio-dashboard-patterns.md` |
| ECommerceIntegrationHub | `references/ecommerce-integration-hub.md` |
