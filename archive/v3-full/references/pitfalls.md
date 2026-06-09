# Pitfalls — รวมทุก pitfall จากทุกโปรเจค

## Mermaid
- ❌ ERD single-line: `Table { int id PK string name }` → ใช้ multi-line
- ❌ `<br/>` ใน `{}` decision nodes → ใช้ใน `[]` เท่านั้น
- ❌ Emoji ใน node labels → ใช้ plain text
- ❌ `→` (unicode arrow) ใน stateDiagram → ใช้ `-` หรือ `>`
- ❌ `flex justify-center` บน diagram container → Mermaid เล็ก
- ✅ ใช้ `diagram-box` class + `.mermaid { max-width: 80%; margin: 0 auto }`

## HTML Blueprint
- ❌ Tailwind CDN + `@apply` → style พัง → ใช้ plain CSS
- ❌ v2.0 reinvents v1.0 content → user ติ "เข้าใจยากกว่า"
- ✅ Phase 2 = ก๊อป v1.0 + ต่อของใหม่ — extend, never replace
- ✅ Full-width layout: `w-full px-6 lg:px-10` — ห้าม `max-w-6xl mx-auto`
- ✅ Font: Sarabun (body), Kanit (headings)
- ✅ Sidebar: `bg-slate-50`, dot-based nav, sticky footer, shadow-sm

## Blueprint Content
- ❌ แยก NFR เป็น Part 00-B → constraint ใน 00, quality ใน 05
- ❌ แยก ADR เป็น Part → ฝังใน Tech Stack "ทำไมถึงเลือก"
- ❌ Cost estimation, CI/CD ถ้า user ไม่ถาม
- ❌ ยัด 11 Parts ในไฟล์เดียวโดยทิ้ง narrative
- ✅ Narrative Bridge ทุก section transition

## Code
- ❌ Session compaction อ้างว่า "ไฟล์ถูกสร้าง" → verify ด้วย `search_files` ก่อน
- ❌ `hermes_tools.read_file` + `write_file` → corrupts files (line numbers)
- ✅ Raw Python `open()` ใน execute_code
- ❌ `patch` ซ้ำๆ บน TSX → ใช้ `write_file` เขียนใหม่ทั้งไฟล์
- ❌ `useEffect` หลัง `return` → hooks ต้องก่อน early return

## React
- ❌ Define component ใน component → event handler พัง
- ✅ Inline JSX + conditional rendering
- ❌ Navigate away จาก context → inline state switch
- ✅ Loading state ต้องมี logo — `LoadingLogo` component

## Session Flow
- ❌ วิเคราะห์ Part 00, 01, 02 ในแชทนานโดยไม่สร้าง Blueprint HTML → user อยากเห็นชิ้นงาน (ECommerceIntegrationHub: 9 Jun 2026)
- ✅ หลังจบวิเคราะห์แต่ละ Phase → สร้าง Blueprint HTML ทันที อย่ารอจนครบทุก Part
- ✅ จบแต่ละ Part → เสนอ "มีอะไรให้พิจารณาเพิ่มไหม" (user pattern: ต้องการ review ก่อนไป Part ต่อไป)
- ❌ Architecture diagrams แสดงเฉพาะ Phase 1 platform (เช่น แค่ Shopee) → user ติ "เห็นมีแต่ Shopee" (ECommerceIntegrationHub: 9 Jun)
- ✅ Diagrams ต้องแสดง full vision: ทุก platform ใน architecture — active = สีเขียวเส้นทึบ, future = greyed out เส้นประ — แม้ implement แค่เจ้าแรก

## General
- ❌ Container หดเมื่อ content เปลี่ยน → ใช้ fixed `height` + `flex-shrink-0`
- ❌ ตอบว่า "เสร็จ" โดยไม่ verify ใน browser
- ✅ QA: kill old Vite → clear cache → restart → curl → browser_console
- ❌ Windows/WSL: NTFS case-insensitive — ระวัง directory naming
- ❌ แก้ผิดไฟล์: user พูดถึง React app → แก้ .tsx, user พูดถึงเอกสาร → แก้ .html
