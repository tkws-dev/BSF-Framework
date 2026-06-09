# BSF Retrospective Mode

## When
- โค้ดมีแล้ว, ยังไม่มี Blueprint
- "dev ก่อน spec", "ช่วยทำสรุป BSF ให้"

## Process

1. **Read source code FIRST** — `search_files` → `read_file` บนทุกไฟล์
2. **อย่าเชื่อ session compaction** — ไฟล์ที่ compaction บอกว่า "สร้างแล้ว" อาจไม่มีอยู่จริง
3. **Map code → BSF**:
   - `package.json` → Tech Stack
   - `prisma/schema.prisma` → 03 Database
   - `src/routes/` → 04 API
   - `src/components/` → 02 Interface
4. **Mark status**: "Done" (in code) vs "Planned" (designed, not coded)
5. **Skip inapplicable steps**: static site → ไม่มี DB/API → adapt เป็น State/Persistence

## Output
- `Master Blueprint.html` — retrospective documentation
- Phase 1 = what's built, Phase 2+ = what's planned
