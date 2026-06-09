# สารพัดช่าง Category Hierarchy — Full Design

## Design Decision (29 May 2026)

Merged `symptoms` table into `categories` — single table with `parent_id` for 3-level hierarchy.
"ช่าง" prefix on all L1 names to align with brand "สารพัดช่าง".

## Schema

```sql
categories (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,           -- clean text, no emoji
  icon TEXT,                    -- FontAwesome class (fa-snowflake, fa-bolt, ...)
  parent_id UUID REFERENCES categories(id),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  description TEXT,             -- nullable, for future AI analysis
  created_at TIMESTAMPTZ
)
```

## Full Hierarchy

```
L1 (10)                           L2 (53)                      L3 (46)

ช่างซ่อมเครื่องใช้ไฟฟ้า (fa-plug)    แอร์ (fa-snowflake)          แอร์ไม่เย็น, น้ำยาแอร์หมด,
                                   ตู้เย็น (fa-temperature-low)   แอร์มีเสียงดัง, แอร์น้ำรั่ว,
                                   เครื่องซักผ้า (fa-shirt)       แอร์ไม่ติด, ล้างแอร์...
                                   ทีวี (fa-tv)
                                   ไมโครเวฟ (fa-satellite-dish)  ไมโครเวฟไม่ร้อน, ไม่ติด...
                                   พัดลม, หม้อหุงข้าว,
                                   เครื่องเสียง

ช่างระบบไฟฟ้า (fa-bolt)            ไฟดับ/ไฟตก (fa-lightbulb)     เฉพาะห้อง, ทั้งบ้าน, ไฟกระพริบ
                                   เบรกเกอร์/ฟิวส์ (fa-bolt)      ตัดบ่อย, เปลี่ยน, ร้อน
                                   ปลั๊กไฟ/สวิตช์ (fa-plug)
                                   ติดตั้งไฟ/โคมไฟ, เดินสายไฟ

ช่างประปา (fa-faucet)             ท่อตัน/ท่อแตก (fa-faucet-drip) ท่อน้ำตัน, ท่อแตก, ระบายตัน
                                   ปั๊มน้ำ (fa-water)             ไม่ทำงาน, เสียงดัง, แรงดันตก
                                   เครื่องทำน้ำอุ่น, ก็อกน้ำ,
                                   ชักโครก

ช่างก่อสร้างและต่อเติม (fa-hammer) ต่อเติม/ก่อสร้าง (fa-hard-hat) ต่อเติมห้อง, ทุบ/รื้อ, เทพื้น
                                   ทาสี (fa-paint-roller)         ภายใน, ภายนอก, สีลอก
                                   ปูกระเบื้อง, ผนัง/ฝ้า,
                                   พื้น/บันได, ประตู/หน้าต่าง

ช่างอเนกประสงค์ (fa-toolbox)       ประกอบเฟอร์นิเจอร์ (fa-chair)
                                   ติดตั้ง/แขวนของ (fa-screwdriver)
                                   งานเชื่อม/โลหะ (fa-fire)
                                   งานจิปาถะ (fa-tools)

ช่างทำความสะอาด (fa-broom)        ทำความสะอาดบ้าน (fa-house-chimney)
                                   ทำความสะอาดคอนโด (fa-building)
                                   ทำความสะอาดออฟฟิศ (fa-city)
                                   ซักโซฟา/เบาะ/พรม (fa-couch)
                                   หลังก่อสร้าง (fa-broom-ball)

ช่างหลังคาและกันซึม (fa-house)     หลังคารั่ว (fa-house-crack)    รั่ว/น้ำหยด, กระเบื้องแตก,
                                   กันซึมดาดฟ้า (fa-droplet-slash) ฝ้าเพดานรั่ว
                                   เปลี่ยนกระเบื้อง (fa-rotate)
                                   รางน้ำฝน (fa-water-ladder)

ช่างกำจัดแมลง (fa-bug)            กำจัดปลวก (fa-bug-slash)       ขึ้นบ้าน, ขึ้นเฟอร์, ขึ้นโครงสร้าง,
                                   กำจัดมด (fa-ant)                ตรวจเช็ค
                                   กำจัดแมลงสาบ (fa-spray-can)
                                   กำจัดยุง/แมลงวัน (fa-mosquito)
                                   กำจัดหนู, กำจัดงู, กำจัดเห็บ/หมัด

ช่างสวน (fa-tree)                 ตัดหญ้า (fa-seedling)
                                   ตัดแต่งกิ่งไม้ (fa-scissors)
                                   แต่งสวน/จัดสวน (fa-flower-daffodil)
                                   กำจัดวัชพืช, ดูแลสนามหญ้า

ช่างขนย้าย (fa-truck)             ขนย้ายบ้าน (fa-house)
                                   ขนย้ายคอนโด (fa-building)
                                   ขนย้ายออฟฟิศ (fa-city)
                                   ขนย้ายเฟอร์นิเจอร์ชิ้นใหญ่ (fa-couch)
```

## UI Integration

### CreateRequestModal (5 steps)
1. เลือก L1 (5-cols grid + search)
2. เลือก L2 (3-cols grid)
3. เลือก L3 (checkbox multi-select, skip if none)
4. รายละเอียด (textarea 10+ chars)
5. ราคา + เวลาหมดอายุ (3/6 hrs)

### Map Filter
- Checkboxes แสดง L1 categories
- นับจำนวนงานใต้ L1 ผ่าน L1→L2 mapping
- `selCats` = `Set<L1_id>`, filter = `job.category_id ∈ (L2_children_of_selected_L1)`

## Seed Files
- `supabase/seed_categories_v2.sql` — 109 rows (10+53+46)
- `supabase/seed_jobs.sql` — 148 jobs with L2 category_ids
