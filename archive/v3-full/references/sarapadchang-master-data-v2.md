# Supabase Master Data + Category Hierarchy v2 (29 May 2026)

## Structure
```
migrations/
  001_master_schema.sql     ← tables + RLS + functions + base profiles
  002_master_categories.sql ← 10 L1 / 53 L2 / 46 L3 (109 rows)
  003_create_job_rpc.sql    ← SECURITY DEFINER RPC
  004_cancel_job_rpc.sql
  005_expire_job_rpc.sql
  006_accept_job_rpc.sql

seed_jobs.sql  ← 150 test jobs (SAMPLE — outside migrations/)
```

## Key Patterns

### Deterministic UUIDs
```python
import uuid
ns = uuid.UUID('c1000000-0000-0000-0000-000000000000')
cat_id = str(uuid.uuid5(ns, '110'))  # 'แอร์' L2 under 'ช่างซ่อมเครื่องใช้ไฟฟ้า'
```
Same code every time → same UUIDs → FK references survive re-import.

### Category Hierarchy (3-level via parent_id)
- L1: `parent_id IS NULL` — 10 หมวด "ช่าง..."
- L2: `parent_id = <L1_id>` — 53 ประเภท/อุปกรณ์
- L3: `parent_id = <L2_id>` — 46 อาการ (เฉพาะบาง L2)

### Master vs Sample Separation
- **Master** = สิ่งที่ระบบต้องมี (schema, categories, profiles) → ใน `migrations/`
- **Sample** = ข้อมูลตัวอย่างช่วยให้เห็นภาพ (jobs) → แยกไฟล์นอก `migrations/`

### RPC Functions (SECURITY DEFINER)
All write operations use RPC to bypass RLS (works with Dev Login's anon key):
- `create_job(p_customer_id, p_category_id, p_description, p_price, p_latitude, p_longitude, p_expires_at) → UUID`
- `accept_job(p_job_id, p_member_id) → void`
- `cancel_job(p_job_id) → void`
- `expire_job(p_job_id) → void`

Call via `fetch()` directly, NOT `supabase.rpc()`:
```ts
fetch(`${SUPA_URL}/rest/v1/rpc/create_job`, {
  method: 'POST',
  headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ p_customer_id, p_category_id, ... }),
})
```

### Dev Login UUIDs (must be valid UUIDs)
- Super Admin: `d0000000-0000-0000-0000-000000000001`
- Craftsman: `d0000000-0000-0000-0000-000000000002`
- Customer: `d0000000-0000-0000-0000-000000000003`

### DB Columns Added
- `jobs.expires_at TIMESTAMPTZ` — auto-expire after 3/6 hours
- `categories.description TEXT` — for future AI matching
- Removed: `jobs.symptom_id` (merged into categories hierarchy)
