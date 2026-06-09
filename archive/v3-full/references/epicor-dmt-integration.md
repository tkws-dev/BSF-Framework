# Epicor DMT Integration Pattern

Learned during ECIH (E-Commerce Integration Hub) architecture session with tkws, 2026-06-04.

## The Pattern: DMT First, REST Later

When building a pipeline that feeds orders into Epicor ERP, use this phased approach:

```
Phase 1 (MVP):  API → Normalize → Generate EDI (Excel/CSV) → DMT pickup folder
Phase 2 (Future): API → Normalize → Generate EDI → REST API → Epicor (replace DMT transport)
```

### Why Phase 1 = DMT

| Factor | DMT | REST |
|--------|-----|------|
| Business continuity | ใช้ทางเดิมที่ RPA ใช้อยู่ — 0 disruption | ต้องเปลี่ยน process ใน Epicor |
| Format validation | DMT error report ในตัว — debug ง่าย | ต้อง build validation เอง |
| Epicor dependency | ไม่ต้องแตะ Epicor เลย | ต้องรู้ Epicor API + auth |
| Risk | ต่ำ — transport layer เท่านั้นที่เปลี่ยน | สูง — ต้องจัดการทั้ง format + transport พร้อมกัน |
| Speed | Batch | Near real-time |

### The Key Insight

**ECIH's job is data accuracy, not transport speed.** Focus Phase 1 on getting the data right — correct columns, correct format, correct mapping from 4 different platform schemas to one DMT template. Once the format is verified and stable (Phase 2), changing the transport layer (EDI file → HTTP POST) is trivial — all the normalization and mapping logic gets reused.

### What ECIH Actually Does

```
Input:  Raw orders from Shopee, Lazada, TikTok, Shopify (via their APIs)
Output: EDI files (Excel/CSV) matching Epicor DMT template
Handoff: DMT pickup folder → Epicor imports → SO → Inventory → Pick → Ship → Invoice
```

ECIH ends at the EDI file. Everything after DMT import (SO creation, inventory, pick list, shipment, invoice) is Epicor's job — same as before with the old RPA.

### DMT Template Discovery

Before designing the EDI generator:
1. Get a sample Excel/CSV file that DMT currently imports successfully
2. Map columns: Which fields from each platform map to which DMT columns?
3. Identify required vs optional columns
4. Note any DMT-specific formatting (date formats, number formats, required prefixes)

### Related

- `integration-hub-adapter-pattern.md` — Dual-type adapter architecture (API vs Portal) for multi-source integration hubs
- `jung-sa-bsf` — Part 00 RPA/Integration Chain Analysis section
- ECIH Blueprint: `/mnt/c/Users/tikawutw/hermes-jung-sa/ecih-E-Commerce Integration Hub/1-SRS/Master Blueprint.html`
