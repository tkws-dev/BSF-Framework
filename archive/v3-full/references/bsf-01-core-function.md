# BSF 01 — Core Function

## Purpose
ตอบ: "ข้อมูลไหลยังไง ผ่าน process อะไร states อะไร"

## Dependencies
- 00 (Requirements) — ต้องรู้ FR แล้ว

## Actions

1. **DFD Level 1** — Mermaid flowchart: process 1.0-6.0 → data stores D1-D3
2. **Sequence Diagram** — Mermaid: user → UI → API → DB → response
3. **State Machine** — Mermaid stateDiagram-v2: lifecycle ทุก state + transitions
4. **Data Store Cards** — 3 การ์ด: D1, D2, D3 — แต่ละอันเก็บอะไร ใช้กับ SCR ไหน
5. **Screen Strategy** — รายชื่อหน้าจอ: SCR-01..06, ใครใช้, CRUD อะไร

## Output

| Blueprint | Companion |
|-----------|-----------|
| HTML: DFD, Sequence, State Machine diagrams + cards | `state-machine.yaml` |

## state-machine.yaml Format
```yaml
states:
  - name: DRAFT
    transitions:
      - to: PRE_ALERT
        guard: "EDI parsed & validated"
  - name: PRE_ALERT
    transitions:
      - to: IN_TRANSIT
        guard: "Vessel departed"
# ...
```

## Narrative Bridge → 02
"เมื่อรู้ว่าข้อมูลไหลยังไง — ถึงเวลาออกแบบหน้าจอ"
