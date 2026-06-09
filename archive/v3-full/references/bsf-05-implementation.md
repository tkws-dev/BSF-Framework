# BSF 05 — Implementation

## Purpose
ตอบ: "ต้องทำอะไรต่อ จากนี้"

## Actions

1. **Progress Summary** — Phase 1 (Done), Phase 2 (In Progress), Phase 3 (Planned)
2. **Task List** — structured, per SCR
3. **NFR Quality Targets** — Dashboard < 2s, Upload < 5s (ใช้วัดตอน review)

## Phase Format

```
✅ Phase 1 (Done)
   - Project scaffold, Auth, State Machine, Design approved

🔄 Phase 2 (In Progress)
   - SCR-01..06 implementation

⬜ Phase 3 (Planned)
   - Epicor ERP integration, UAT, Go-Live
```

## Output

| Blueprint | Companion |
|-----------|-----------|
| HTML: Phase cards + task list | `tasks.yaml` |

## tasks.yaml Example
```yaml
phases:
  - name: Phase 2 - Screens
    tasks:
      - id: SCR-01
        title: Data Gateway
        fr: FR-01, FR-02
        api: POST /files/upload, GET /files/history
        db: UploadFile, EDiData
```
