# BSF 02 — Interface UI

## Purpose
ตอบ: "ผู้ใช้เห็นอะไร กดอะไร ข้อมูลมาจากไหน"

## Dependencies
- 00 (Actors, FR) — ใครใช้หน้าจอนี้
- 01 (State Machine) — state อะไรแสดงบนหน้าจอ

## Actions

1. **UI Screen Tree** — Mermaid: root → SCR-01..06 → sub-screens
2. **CRUD Labels** — [C][R][U][D] บนทุก element
3. **SCR-01 ถึง SCR-N** — หนึ่ง HTML ต่อหนึ่งหน้าจอ:
   - Purpose + User Persona
   - Component description + data mapping
   - Key Features
   - Placeholder สำหรับ prototype image
4. **Design System** — Colors, Fonts, Components mindset

## SCR Naming
```
SCR-01 — Data Gateway    📡
SCR-02 — Dashboard       📊
SCR-03 — Pallet Plan     📦
SCR-04 — Unload          🚛
SCR-05 — Local Portal    📱
SCR-06 — Verification    ✅
```

## Output

| Blueprint | Companion |
|-----------|-----------|
| HTML: SCR cards + UI Tree diagram | `components.yaml` |

## Narrative Bridge → Phase 2
"หลังจากผู้ใหญ่อนุมัติ Design ทั้งหมด — ถึงเวลาเลือกเทคโนโลยีและสร้างระบบจริง"
