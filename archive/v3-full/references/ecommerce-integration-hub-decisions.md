# ECommerceIntegrationHub — Project Decisions (2026-06-09)

Restart of the ECIH project. Previous version was deleted; this is a fresh start with refined scope.

## Project Identity

- **Full Name:** ECommerceIntegrationHub — ห้ามย่อเป็น ECIH
- **Purpose:** แทน RPA UI scraping ด้วย API-based e-commerce data fetching
- **Output:** CSV (EDI format) → RPA ไปทำงานต่อตามเดิม
- **Workspace:** `/mnt/c/Users/tikawutw/hermes-jung-sa/ECommerceIntegrationHub/`

## Core Architecture Decision

ระบบนี้คือ **Input Layer Replacement** — เปลี่ยนเฉพาะท่อนที่ RPA เคย scrape UI ให้มาใช้ API:

```
[เดิม] RPA scrape UI ทีละเจ้า → CSV → ERP
[ใหม่] API fetch ทีละเจ้า → CSV (EDI) → RPA → ERP (ไม่แตะ)
```

## Adapter Pattern

Dual-type adapters — ออกแบบ interface ให้รองรับทั้ง 2 ประเภทตั้งแต่แรก:

```typescript
interface PlatformAdapter {
  type: 'API' | 'PORTAL';
  fetchOrders(date: string): Promise<UnifiedOrder[]>;
  auth(): Promise<void>;
  normalize(raw: PlatformResponse): UnifiedOrder;
}
```

| Type | Platforms | Method |
|------|-----------|--------|
| API | Shopee, Lazada, TikTok, Shopify | REST / GraphQL |
| Portal | Homepro, CRC, BigC, Makro | Playwright + file parsing |

## MVP Scope (Shopee Pilot)

| ✅ IN | ❌ OUT |
|-------|--------|
| Shopee API (sandbox first) | Other platforms (Phase 2+) |
| ดึง order รายวัน + เมื่อวาน (2 preset) | Date range picker |
| Progress indicator ขณะ fetch | Real-time dashboard |
| Summary card หลัง fetch | Status breakdown (รอ ERP) |
| Export CSV (EDI) | PDF reports |
| สรุปย้อนหลัง (DB เล็ก) | Full order detail in DB |
| Dev Login bypass | Production auth (Phase 2) |

## DB Decision

**เก็บเฉพาะ summary + platform config** — ไม่เก็บ order detail:

| เก็บใน DB | ไม่เก็บ |
|-----------|---------|
| Platform credential (encrypted) | Full order records |
| Fetch summary (date, platform, count, amount) | Order items |
| OAuth tokens | Buyer details |

Rationale: CSV คือ output จริง — RPA รับไปต่อ DB เล็กไว้ดูสรุปย้อนหลังพอ

## Functional Requirements (สรุปจาก BSF 00)

| ID | Requirement |
|----|------------|
| FR-01 | เพิ่ม platform ผ่าน UI (เลือก Shopee → กรอก credential) |
| FR-02 | เปิด/ปิด platform โดยไม่ลบ credential |
| FR-03 | OAuth authorize + รับ access_token |
| FR-04 | Auto-refresh token เมื่อหมดอายุ |
| FR-05 | ดึง order list (cursor pagination) |
| FR-06 | Normalize response → Unified Order Model |
| FR-07 | แสดง order ในตาราง |
| FR-08 | แสดงยอดรวม |
| FR-09 | Export CSV |
| FR-10 | Dev Login bypass |
| FR-11 | Summary Card หลัง fetch (count, amount, time) |
| FR-12 | ดูประวัติสรุปย้อนหลัง |
| FR-13 | Progress indicator ขณะ fetch ("หน้า 45/200") |
| FR-14 | Date toggle — วันนี้ / เมื่อวาน |

## NFR Constraints

| ID | Constraint |
|----|------------|
| NFR-01 | Credential encrypt ก่อนลง DB |
| NFR-02 | Audit trail — บันทึกทุก fetch/export |
| NFR-03 | Single user (Admin) — no concurrency |
| NFR-04 | CSV UTF-8 with BOM (Excel ไม่เพี้ยน ภาษาไทย) |

## CSV Format (จาก FR)

Format B — มี item detail:

```
order_id, product_name, sku, quantity, unit_price, total_amount, date
```

## Key Dependencies (Pre-Dev)

1. **Shopee Sandbox** — พี่ต้องสมัคร Open Platform → สร้าง app → ได้ partner_id + partner_key
2. **EDI Format** — รอพี่ส่ง format CSV ที่ RPA คาดหวัง

## Session-specific Notes

- 2026-06-09: BSF 00 completed (100%) — ready for 01 Core Function
- User prefers: 2-preset date toggle (today/yesterday), not full date picker
- User prefers: manual fetch for MVP, schedule in Phase 2
- User never used Shopee sandbox before — will need guidance during dev
