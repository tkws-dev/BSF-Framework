# BSF Upgrade Mode

## When
- v1.0 อนุมัติแล้ว, ต้องการ Phase 2
- User พอใจกับ v1.0 — "เข้าใจง่าย, เนื้อหาชัด"

## Golden Rule: EXTEND, never REPLACE

❌ **ห้าม:**
- สร้าง v2.0 ที่ reinvent v1.0
- บีบอัด v1.0 เป็นตารางแห้งๆ
- เปลี่ยน visual style
- ใส่ content ที่ไม่เกี่ยวกับเนื้องาน (NFR แยก, ADR แยก, cost estimation)

✅ **ต้อง:**
- ก๊อป v1.0 ทั้งก้อน + ต่อของใหม่
- Style เดียวกัน — fonts, colors, cards, diagram-box
- Narrative bridge เชื่อม: "หลังจากผู้ใหญ่อนุมัติ Design..."
- Part numbering ต่อจาก v1.0

## Files

**Option A:** v1.0 immutable → สร้าง `Development Blueprint (Phase 2).html`

**Option B:** รวม → `Master System Blueprint v2.0.html` = v1.0 clone + new parts

เลือกตาม user preference

## New Content (Phase 2)

| Part | เนื้อหา |
|------|--------|
| Tech Stack | 3-column grid (FE/BE/Infra) + "ทำไมถึงเลือก" inline |
| 03 Database | ER Diagram + table cards ตาม SCR |
| 04 API | Endpoints จัดกลุ่มตาม SCR |
| 05 Roadmap | Done / In Progress / Planned |

## Anti-Pattern (Real Case — WMS v2.0)

❌ ยัด 11 Parts, บีบ v1.0 เป็นตาราง, ทิ้ง narrative, ใส่ cost estimation
→ User: "เข้าใจยากกว่าเยอะเลยครับ"
