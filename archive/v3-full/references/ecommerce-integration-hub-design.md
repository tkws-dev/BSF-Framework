# ECommerceIntegrationHub — Design Decisions & Patterns

> Captured from BSF session: 9 Jun 2026 (tkws + Jung-Sa)

## Architecture Decision: No Order-Level DB

**Decision:** DB เก็บเฉพาะ summary (date, platform, order_count, total_amount, duration) — **ไม่เก็บ order detail**

**Rationale:**
- RPA ทำงานต่อจาก CSV อย่างเดียว — CSV คือ output, DB คือ audit trail
- DB เล็ก (1 row/วัน/platform) = จิ๊บ ๆ ไม่ต้อง optimize
- ถ้าอยากดู detail → เปิดไฟล์ CSV

**Pattern:**

```
[Shopee API] → fetch → normalize → Unified Order Model
                                   ├→ CSV (EDI) → RPA
                                   └→ DB (summary only)
```

## Rate Limit Analysis: Shopee 1000/hr

| Records | Pages (100/page) | Calls | % of 1000/hr limit |
|---------|-----------------|-------|-------------------|
| 2,000 | 20 | 20 | 2% |
| 20,000 | 200 | 200 | 20% |
| 100,000 | 1,000 | 1,000 | 100% |

**Finding:** ไม่ต้องเรียก order_detail แยก — order_list + response_optional_fields ให้ข้อมูลพอสำหรับ CSV export

## Unified Order Model (Adapter Output)

ทุก adapter ต้อง normalize → model นี้:

| Field | Type | Shopee Source |
|-------|------|---------------|
| external_id | string | order_sn |
| platform | string | constant "SHOPEE" |
| total_amount | float | total_amount |
| currency | string | currency |
| buyer_name | string? | buyer_username |
| shipping_address | string? | recipient_address |
| created_at | datetime | create_time |
| updated_at | datetime? | update_time |
| raw | json | full API response (preserved) |

## OAuth: Sandbox vs Production

| | Sandbox | Production |
|---|---|---|
| URL | `test-stable.shopeemobile.com` | `partner.shopeemobile.com` |
| Redirect | `localhost` OK | public domain required |
| Data | test data | real data |

**Strategy:** Dev บน sandbox → พร้อม deploy → เปลี่ยน URL + credential

## CSV: UTF-8 BOM Required

ภาษาไทยในชื่อ buyer + ที่อยู่ → CSV ต้อง UTF-8 with BOM → Excel เปิดไม่เพี้ยน

## Dual-Adapter Architecture (Future-Proof)

```typescript
interface PlatformAdapter {
  type: 'API' | 'PORTAL';       // API = REST/GraphQL, PORTAL = scrape
  fetchOrders(date: string, pageHandler: ProgressFn): Promise<UnifiedOrder[]>;
  auth(): Promise<void>;
  refreshToken(): Promise<void>;
}
```

API type: Shopee, Lazada, TikTok, Shopify
PORTAL type: Homepro, CRC, BigC, Makro (Phase 2+)

## Key Lessons

1. **เริ่ม 1 platform (Shopee)** — validate pattern ก่อนขยาย
2. **Adapter interface รองรับทั้ง API และ Portal** — ถึง Phase 1 ทำแค่ API แต่ออกแบบ interface เผื่อ Portal
3. **ไม่ต้องมี DB ใหญ่** — CSV คือ output หลัก DB ไว้ audit
4. **Progress สำคัญ** — 20K records ≈ 1.5 นาที ผู้ใช้ต้องรู้ว่าไม่ค้าง
