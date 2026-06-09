# BSF 04 — API Specification

## Purpose
ตอบ: "UI เรียก API อะไร ส่งอะไร ได้อะไรกลับ"

## Dependencies
- 02 (แต่ละ SCR ต้องการข้อมูลอะไร)
- 03 (ตารางที่ API ต้อง query)

## Actions

1. **Route Groups** — จัดกลุ่มตาม SCR (ไม่ใช่ตาม HTTP method)
2. **Endpoint Cards** — แต่ละกลุ่ม: SCR-01 → POST /files/upload, GET /files/history
3. **Auth & RBAC** — Role matrix: endpoint × role
4. **Error Handling** — Unified error: `{ code, message, details[] }`

## API Grouping (by Screen)

```
SCR-01: /files/upload (POST), /files/history (GET)
SCR-02: /dashboard/overview (GET), /dashboard/urgent (GET)
SCR-03,04: /containers (GET), /containers/:id (GET), /containers/:id/status (PATCH)
SCR-05: /local-portal/deliveries (POST), /local-portal/deliveries/:id/sign (PATCH)
SCR-06: /verification/pending (GET), /verification/:id/approve (POST)
```

## Output

| Blueprint | Companion |
|-----------|-----------|
| HTML: API cards จัดกลุ่มตาม SCR + Auth diagram | `openapi.yaml` |

## openapi.yaml Example
```yaml
paths:
  /api/v1/containers:
    get:
      summary: List all containers
      security: [{ bearerAuth: [] }]
      parameters:
        - name: status
          in: query
          schema: { type: string }
```

## Narrative Bridge → 05
"เมื่อทุกอย่างพร้อม — ถึงเวลาวางแผนสร้าง"
