# Dev Agent Handoff — delegate_task Parallel Implementation

> Pattern from MIL Smart WMS Phase 1 (actual implementation: 6 agents, ~4,000 lines in ~10 minutes wall-clock)
> ใช้เมื่อ BSF Spec เสร็จสมบูรณ์และผ่านการ Approve แล้ว — ถึงเวลาส่ง Dev Agents ลงมือ Code

## Role Model: Jung-Sa = เลขา Orchestrator

```
tkws (Boss) ──▶ Jung-Sa (เลขา) ──▶ Dev Agents (Workers)
                       │
               วิเคราะห์โจทย์       สร้าง BSF Spec
               แบ่งงาน + แยก Context   delegate_task
               Review + Merge       ส่งผลให้ Boss
```

Jung-Sa ไม่ใช่ Dev — Jung-Sa คือเลขาที่:
- รู้ spec ทุกส่วน (เพราะเป็นคนเขียนเอง)
- แบ่งงานให้ Dev Agents ทำขนานกัน
- **ส่งเฉพาะ context ที่ Dev Agent นั้นต้องรู้** (ไม่ส่ง SRS ทั้ง 5,000 บรรทัด)
- Review + Merge ผลลัพธ์
- ส่ง Boss ดูรอบสุดท้าย

## Parallel Implementation Pattern

### Step 1: สร้าง Project Skeleton เอง (ไม่ delegate)

ก่อน delegate ต้องมีโครงสร้างพื้นฐานให้ Agents ต่อยอด:
- `docker-compose.yml`
- `package.json` + config files
- `prisma/schema.prisma`
- Folder structure
- `.env.example`

Agents จะเขียนโค้ดลงในโครงสร้างที่มีอยู่แล้ว — ถ้าไม่มี skeleton, Agents จะไม่รู้ว่าจะเขียนไฟล์ที่ไหน

### Step 2: Batch 1 — 3 Agents ขนาน

เลือก 3 งานที่ independence สูงสุด — ไม่ต้องรอกัน:

```
Batch 1: ┌── Agent A: DB Seed + Prisma Schema
         ├── Agent B: Auth (Login, JWT, RBAC Middleware)
         └── Agent C: SCR-01 Frontend (Login Page + Upload Dropzone)
```

**Context isolation rule:** Agent แต่ละตัวได้เฉพาะ spec ที่ตัวเองต้องทำ:
- Agent A: แค่ Schema + Seed Script (ไม่ต้องรู้ API)
- Agent B: แค่ Auth Section (User table, JWT spec, RBAC matrix)
- Agent C: แค่ SCR-01 HTML spec + Upload API endpoints

### Step 3: Review + Fix

หลัง Batch 1 เสร็จ — ตรวจ:
- Consistency: Agent A สร้าง field name ตรงกับ Agent B ที่เรียกใช้ไหม
- Build: TypeScript compile ผ่านไหม
- Integration: Agent C เรียก API path ตรงกับ Agent B หรือเปล่า

**🔴 Critical: Frontend-Backend API Contract Verification**

After merging both frontend and backend work, test the full login flow before showing the user:

1. **Verify API response shape:** `curl` the login endpoint, compare the JSON shape against what `useAuth.tsx` expects
   - Response envelope: does backend wrap with `{success, data}`? Does frontend unwrap it?
   - Token field: `accessToken` or `token`?
   - User fields: `displayName` or `fullName`? `id` as number or string?
2. **Verify all frontend-called endpoints exist:** Search frontend for `api.get(` / `api.post(` — cross-check every path against backend routes
   - Common missing: `GET /auth/me` (for token refresh on page load)
3. **Verify User interface matches:** The `User` type in `useAuth.tsx` must match exactly what the backend returns — mismatched fields cause silent `undefined` in sidebar/dashboard
4. **Test login end-to-end** before declaring done:
   ```bash
   curl -s -X POST http://localhost:4000/api/v1/auth/login \
     -H 'Content-Type: application/json' \
     -d '{"username":"admin","password":"password123"}'
   ```
   Then verify the frontend can store the token and navigate past the login page.

### Step 4: Batch 2 — 3 Agents ขนาน (ต่อจาก Batch 1)

```
Batch 2: ┌── Agent A: SCR-01 Backend (Upload API + Merge Logic)
         ├── Agent B: SCR-02 Frontend (Dashboard + Timeline)
         └── Agent C: SCR-02 Backend (Dashboard Query API)
```

### Step 5: Final Review + Present

- TypeScript compile check (tsc --noEmit)
- ตรวจ file structure ครบถ้วน
- สรุปสิ่งที่ทำ + method วิธีรันให้ Boss

## Context Generation Template

เมื่อจะ delegate แต่ละ Agent, context ต้องประกอบด้วย:

### 1. Project Root Path
```
The project is at /mnt/c/Users/tkws/hermes-jung-sa/wms-warehouse management system/
```

### 2. Files to Create (exact paths)
```
Create these files using write_file:
1. server/src/services/file.service.ts
2. server/src/controllers/file.controller.ts
...
```

### 3. Relevant Spec (เฉพาะส่วนที่ Agent นี้ทำ)

อย่าส่ง SRS ทั้ง 5,000 บรรทัด — ส่งเฉพาะ:
- Screen spec HTML ที่เกี่ยวข้อง (SCR-01 → ไฟล์ SCR-01.html)
- API endpoints ที่ Agent นี้ต้อง implement
- DB schema เฉพาะ table ที่เกี่ยวข้อง

### 4. Existing File References
บอก Agent ว่ามีไฟล์อะไรอยู่แล้วที่ต้อง import หรือ update เช่น:
```
The Prisma schema has models: User, Supplier, ShipmentMaster...
Auth middleware imports from '../middleware/auth.middleware'
```

### 5. What NOT to Touch
```
DO NOT modify: docker-compose.yml, client/package.json
DO NOT install new npm packages without asking
```

### Frontend-Backend Dependency

Frontend needs API endpoints before it can call them.
Strategy: define endpoints in Batch 1 (Backend agent), then Batch 2 (Frontend agent) uses them.

### ⚠️ Route/Sidebar Conflict — Use a Dedicated Wiring Agent
  the filesystem first** — `find <project-root> -type f | head -40` — before assuming
  no work has been done.
- Before starting a new phase, verify what already exists on disk. Phase 1 may have
  been completed by the Dashboard agent while you were talking in Telegram.
- Use `session_search` to find the originating session context, then verify the
  actual state via filesystem. Don't trust \"what you remember\" — trust what's on disk.
- When starting work, state your working directory explicitly at the beginning so
  future sessions (and other agents) can pick up from the same place.

### Phase Tracking Convention

After completing a phase, create a lightweight status file so any session
(Telegram, Dashboard, CLI) can discover where the project stands:

```
<<project-root>/.jung-sa-phase
```

Contents: single line with current phase and completion date:

```
Phase 1: Core Foundation — COMPLETE 2026-05-27
```

This file is checked before any new work begins. If it exists and matches
the expected state, continue to the next phase instead of restarting.

## Mock Server Rapid Prototyping

เมื่อ environment ไม่มี PostgreSQL หรือ Docker (`sudo` ไม่พร้อม, Docker ไม่ได้ติดตั้ง):

1. **สร้าง mock-server.ts** ใน `server/src/` — Express server ตัวเดียวที่ให้ API ครบ
2. **Mock data arrays แทน DB** — containers[], uploads[], users[] ฯลฯ
3. **Frontend เป็น Single HTML** — inline JS + Tailwind CDN + FontAwesome CDN — ไม่ต้องใช้ Vite/Webpack เลย
   - ข้อดี: เปิด URL ได้ทันที ไม่ต้อง build
   - ข้อเสีย: ไม่มี TypeScript, Hot Reload, tree shaking
4. **Serve static HTML จาก Express** — `app.use(express.static(path.join(__dirname, 'public')))`
5. **API + Frontend อยู่ที่ Port เดียว** — ไม่มี CORS issue

### เมื่อไรควรใช้ Mock Server

| When | Why |
|------|-----|
| Environment ไม่มี DB/Sudo/Docker | ✅ Mock server ไม่ต้องพึ่งพาอะไร |
| Demo / POC ก่อน Build จริง | ✅ ผู้ใช้เห็น UI ได้ทันที |
| Frontend dev ต้องทดสอบ API | ✅ Backend จริงอาจยังไม่เสร็จ |
| **แต่** ใช้เท่าที่จำเป็น | ❌ โค้ด mock server ไม่สามารถ reuse ใน production ได้ |
| | ❌ Business logic simulation ไม่ cover edge cases ทั้งหมด |

### Mock → Real Migration Path

```bash
# 1. ติดตั้ง PostgreSQL จริง
sudo apt install postgresql
sudo service postgresql start

# 2. เปลี่ยน Prisma provider กลับเป็น postgresql
sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma

# 3. Migrate + Seed
npx prisma migrate dev
npx prisma db seed

# 4. เปลี่ยนจาก mock-server → real server
# หยุด mock, รัน express จริง
```

## WSL + /mnt/c/ npm Workaround

**ปัญหา:** npm install ใน `/mnt/c/Users/...` (Windows NTFS) ล้มเหลว — packages ถูกประกาศว่าติดตั้งแล้วแต่ไม่มีใน `node_modules/`
**สาเหตุ:** npm v11+ มีปัญหาเรื่อง symlinks บน WSL+NTFS mount
**Fix:** คัดลอกโปรเจคไปที่ `~/` (WSL native ext4) แล้วรัน npm install ที่นั่น

```bash
# Copy โดยไม่เอา node_modules (ใช้ Python เพื่อประสิทธิภาพ)
python3 << 'EOF'
import shutil, os
src = "/mnt/c/Users/tkws/hermes-jung-sa/wms-warehouse management system"
dst = os.path.expanduser('~/"wms-warehouse management system"')
shutil.copytree(src, dst, ignore=shutil.ignore_patterns('node_modules'))
print(f"Copied to {dst}")
EOF

# แล้ว install ที่ WSL home
cd ~/"wms-warehouse management system"/server && npm install
cd ~/"wms-warehouse management system"/client && npm install
```

## Cross-Session Awareness

### Cross-Session Blindness
Always check the filesystem before assuming nothing has been done.
The user may have approved and started work in another session (Dashboard/CLI)
and you won't know unless you look at the actual files.

### Context Overload
Don't send the full SRS to a Dev Agent — they can't hold 5,000 lines of context.
Send only the 2-3 files + relevant spec section they need.

### Missing File Paths
If you don't tell the agent the exact file path, they'll guess — and guess wrong.
Every "create" instruction must include the absolute path.

### No Shared Memory
Dev Agents have zero memory of previous conversations.
Every delegate_task call is a fresh start — include ALL context they need.

### Foreign-Language Contamination
Subagents default to English. If the user communicates in Thai (or any non-English
language), add to every delegate task context: "All responses must be in Thai (ภาษาไทย).
Do not output English unless the user explicitly requests it." Without this, subagent
summaries come back in English and leak into the parent's final response.
### Frontend-Backend Dependency

Frontend needs API endpoints before it can call them.
Strategy: define endpoints in Batch 1 (Backend agent), then Batch 2 (Frontend agent) uses them.

### ⚠️ Route/Sidebar Conflict — Use a Dedicated Wiring Agent

When parallel agents all build screens, every agent wants to add its own route and
sidebar entry. If each agent writes to `routes/index.tsx` and `Sidebar.tsx`, the
last agent to write wins → earlier routes are lost.

**✅ Pattern: 2-Phase Batch**

Phase A (Screen Builders — do NOT touch shared files):
```
Agent 1: Build SCR-03 (pallet-plan/*.tsx, pallet.service.ts) — NO routing
Agent 2: Build SCR-04 (unload/*.tsx, transaction.service.ts) — NO routing
```

Phase B (Wiring Agent — touches ONLY shared files):
```
Agent 3: Read routes + sidebar → Add entries for SCR-03 + SCR-04 → tsc check
```

Each screen agent's context must explicitly say: "Do NOT modify routes/index.tsx
or Sidebar.tsx." The wiring agent is the only one that touches shared files.

If you have screens and wiring in the same batch of 3, split into 2 sub-batches:
screen builders first, then wiring when they complete. Never run them in parallel.

### Model Cost
delegate_task uses the same model as the parent — if the parent is on a paid model,
all 3 parallel children also bill. For a ~$10/hr model, 3 agents × 5 min = $2.50 per batch.
For large implementations, consider whether to use a cheaper model for worker agents.
