# Inventory Transfer Tool — Project Reference

## Overview

Standalone project (แยกจากสารพัดช่าง) — Batch Inventory Transfer สำหรับ Epicor ERP

## Stack (Phase 2 TBD)

- Frontend: React + Vite + Tailwind v4 + TypeScript
- Backend: Supabase (DB + Edge Functions)
- Integration: Epicor REST API v2 (OData)
- Auth: Dev Login (localStorage bypass) ก่อน Google OAuth

## Project Path

```
/mnt/c/Users/tikawutw/hermes-jung-sa/InventoryTransferTool/
└── 1-SRS/
    ├── Master Blueprint.html    ← Phase 1 (00-02)
    └── companions/              ← TBD in Phase 2
```

## Key Architecture Decisions

1. **Morning Pull → Workday → Confirm Push** — Pull OnHand จาก Epicor มาเก็บ local, user เลือก/ย้ายระหว่างวัน, push กลับตอน confirm (ไม่ต้องรอเย็น)
2. **Transfer, NOT Adjustment** — ใช้ Epicor `Inv.TransferSvc` (ของย้าย bin, total onhand เท่าเดิม) — ไม่ใช้ Inv.Adjustment เพราะไม่ใช่การตัดสต๊อก
3. **Delta Push** — Push เฉพาะรายการที่เปลี่ยนแปลง, มี idempotency key ป้องกัน duplicate
4. **3 Data Stores**: D1 OnHand Snapshot (ephemeral, pull เช้า), D2 Transfer Cart (draft → confirmed), D3 Transfer History (immutable)

## Business Constraints

- ~10K+ OnHand rows per sync
- User: Admin (full) + Issue Person (create transfer only)
- Epicor REST API v2 — OData endpoints
- Desktop-only (no mobile/tablet), Chrome/Edge
- Zero license cost (ฟรีเท่านั้น)

## Epicor API Endpoints (Documented)

| Action | Endpoint | Notes |
|--------|----------|-------|
| Pull OnHand | `GET /api/v2/Erp.Inv.PartBin` | OData: `$select`, `$filter`, `$top` |
| Push Transfer | `POST /api/v2/Erp.Inv.TransferSvc` | Batch with delay between calls |

## BSF Blueprint Status

- Phase 1 (00-02): ✅ Complete — `1-SRS/Master Blueprint.html`
- Phase 2 (03-05): Not started
