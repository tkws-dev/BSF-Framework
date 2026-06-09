# BSF 00 — Requirements

## Purpose
ตอบ: "เราจะสร้างอะไร เพื่อใคร แก้ปัญหาอะไร"

## Inputs
- Business Problem / Pain Points
- Existing data samples (ไฟล์ Excel, PDF, email)
- Stakeholder interviews

## Actions

1. **Business Story** — เล่าเรื่อง: ใคร, ปัญหาอะไร, ทำไมต้องแก้ตอนนี้
2. **Scope** — 8-Point หรือ grid cards: IN scope vs OUT scope
3. **KPIs** — 3 การ์ด: วัดผลสำเร็จยังไง
4. **Context Diagram (DFD Lv0)** — Mermaid flowchart: external entities → system
5. **Actors & RBAC** — ตาราง: ใคร ทำอะไรได้บ้าง
6. **Functional Requirements** — FR-01..FR-N, ตาราง
7. **NFR Constraints** — เฉพาะที่กระทบ design: RBAC, Audit Trail, Tablet support
8. **Risk Register** — CRITICAL / MODERATE / MONITOR cards

## Output

| Blueprint | Companion |
|-----------|-----------|
| HTML section: content-card, KPI cards, diagram-box | `requirements.yaml` |

## Narrative Bridge → 01
"เมื่อรู้ว่าใครต้องทำอะไร — ถึงเวลาดูว่าข้อมูลไหลยังไง"
