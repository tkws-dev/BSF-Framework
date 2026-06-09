# WMS Blueprint Evolution — v1.0 → Phase 2

## Background

MIL Smart WMS blueprint went through an evolution that exposed key BSF anti-patterns. This document captures the lessons.

## Correct Pattern: Phase-Based Delivery

```
Master System Blueprint.html (v1.0)
├── Part 1: Origin — 8-Point Scope, Data Architecture
├── Part 2: BSF 00 — KPIs, Context Diagram, Use Case, FR/NFR
├── Part 3: BSF 01 — DFD Lv1, Sequence, State Machine
├── Part 4: Prep BSF 02 — UI Tree & CRUD Map
└── Part 5: BSF 02 — SCR-01 to SCR-06 full specs
    ↑
    APPROVED by stakeholder — DO NOT TOUCH
    ↓
Development Blueprint (Phase 2).html  ← SEPARATE file
├── Narrative bridge: "v1.0 approved → this answers Dev questions"
├── Part 6: Technology Stack — 3-column grid, decisions woven in
├── Part 7: Database — ER Diagram + table cards per screen
├── Part 8: API — endpoints grouped by SCR, not by HTTP method
└── Part 9: Next Steps — 3-phase summary (Done/Progress/Pending)
```

## Anti-Pattern: "v2.0 ที่ยัดทุกอย่างแต่เล่าเรื่องไม่ได้"

What went wrong:
- Created a NEW v2.0 that replaced v1.0's narrative content with dry tables
- Tried to fit 11 BSF parts into a single document by compressing existing content
- Added standalone NFR section, ADR section, traceability matrix — when v1.0 already covered these in its flow
- Used tables instead of grid cards — lost the visual-first principle
- Lost the narrative bridges between sections

User feedback: "เวอร์ชั่นใหม่ดูเข้าใจยากกว่าเยอะเลยครับ... เวอร์ชั่นแรกเข้าใจง่ายและเนื้อหาชัด"

## Key Rules for Phase 2 Documents

1. **NEVER replace v1.0** — if user is satisfied with v1.0, it becomes immutable
2. **EXTEND, don't reinvent** — new content goes in a separate Phase 2 file
3. **Same visual style** — Kanit+Sarabun fonts, content-card, diagram-box, grid cards
4. **Part numbering continues** — Part 6, 7, 8, 9...
5. **Narrative bridge first** — remind reader what v1.0 established
6. **"สิ่งที่ Dev ต้องรู้" drives content** — not BSF framework compliance
7. **Omit what's already covered** — NFR in v1.0 Part 2? Don't repeat. FR table exists? Don't add traceability matrix.
8. **API by screen** — group endpoints by SCR-01..06, not by GET/POST/PATCH
9. **Decisions woven in** — "ทำไมถึงเลือก X" + "สิ่งที่ต้องแลก" in Tech Stack, not separate ADR section
10. **Roadmap brief** — 3 phases max (Done/In Progress/Pending), no cost estimation unless asked
