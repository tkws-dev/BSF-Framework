# MIL Smart WMS — Development Environment

## Project Location

```
/mnt/c/Users/tikawutw/hermes-jung-sa/wms-warehouse management system/
```

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Database | SQLite (dev) / PostgreSQL (prod) | Prisma ORM, change 1 line in schema.prisma for prod |
| Backend | Express + TypeScript | Run with `tsx`, NOT `ts-node` |
| Frontend | React + Vite + Tailwind | Port 5173 |

## Server Startup

```bash
cd ~/"wms-warehouse management system"/server

# Kill existing server on port 4000
lsof -ti:4000 | xargs kill -9 2>/dev/null

# Start with DATABASE_URL (REQUIRED — schema uses env("DATABASE_URL"))
DATABASE_URL='file:/home/tikawutw/"wms-warehouse management system"/server/prisma/dev.db' npx tsx src/index.ts
```

**⚠️ New:** Server entry is `src/index.ts` (not `src/server.ts`). Must set `DATABASE_URL` env var — Prisma schema reads `env("DATABASE_URL")`. Without it, every request fails with "Environment variable not found: DATABASE_URL".

**⚠️ Missing dependency:** `axios` is NOT in `package.json` — it was added via `npm install axios` after initial setup. If you see `MODULE_NOT_FOUND: axios`, run:
```bash
cd ~/"wms-warehouse management system"/server && npm install axios
```

## Prisma + SQLite Setup

### First-time setup (for new devs)

```bash
cd server
npm install
npx prisma migrate dev    # creates SQLite DB at prisma/dev.db
npx prisma db seed        # loads 6 users, 10 containers, 31 items
npm run dev               # starts server on :4000
```

### Schema

Located at `prisma/schema.prisma` — 13 models: User, Supplier, ShipmentMaster, ShipmentItem, UploadFile, EDiData, ContainerPhoto, ReceivingTransaction, ReceivingLine, LocalDelivery, LocalDeliveryLine, ERPSyncLog, AuditLog.

**ShipmentItem** fields: id, containerNo, partNumber, partName, invoiceQty, actualQty, uom, volumeCbm, palletQtyCalculated, discrepancyCode, discrepancyReason, createdAt, updatedAt.

**LocalDeliveryLine** fields: id, deliveryId, partNumber, partName, invoiceQty, actualQty, uom, createdAt.

User model uses `passwordHash` (bcrypt), not plaintext `password`.

### Schema Migration (adding new fields)

When adding fields to existing models:
```bash
npx prisma db push --accept-data-loss   # push schema changes (SQLite)
npx prisma db seed                       # re-seed data
```
Then restart server with `DATABASE_URL` set.

### Resetting DB

```bash
npx prisma migrate reset --force  # nukes DB, re-runs migrations, re-seeds
```

### Recovering from corrupted node_modules (after filesystem operations)

If `npx prisma generate` or `npx tsx` fails with MODULE_NOT_FOUND:
```bash
rm -rf node_modules package-lock.json
npm install
npx prisma generate
# Then start server
```

### Data Gateway Upload Guide

Component: `client/src/pages/data-gateway/DataGatewayPage.tsx`
Includes a detailed Thai upload guide card explaining:
- EDI-INV vs EDI-PL file types
- Batch upload requirement (must upload both + PDF together)
- Container_No as merge key
- Daily batch workflow tip
- "View Upload History" button scrolling to history section

### Production switch (SQLite → PostgreSQL)

Change 2 lines in `prisma/schema.prisma`:
```diff
- provider = "sqlite"
- url      = "file:./dev.db"
+ provider = "postgresql"
+ url      = env("DATABASE_URL")
```
Then `npx prisma migrate dev` against the PG instance.

### WSL npm workaround

npm on `/mnt/c` (Windows mount) often fails with "operation rejected" during rename. Workaround:
```bash
cp -r /mnt/c/Users/tikawutw/hermes-jung-sa/wms-warehouse management system/server /tmp/wms-server
cd /tmp/wms-server
npm install              # works on native ext4
cp -r node_modules prisma src /mnt/c/Users/tikawutw/hermes-jung-sa/wms-warehouse management system/server/
```
Keep the project on /mnt/c for Windows access; use /tmp only for npm install.

## Users & Authentication

Users are stored in the SQLite database (seeded via `prisma/seed.ts`):

| ID | Username | Password | Role | Display Name |
|----|----------|----------|------|-------------|
| 0 | `admin` | `password123` | ADMIN | 🛡️ Admin (Super User) |
| 1 | `vipada_pbmc` | `password123` | PBMC | วิภาดา (PBMC) |
| 2 | `somchai_msb` | `password123` | MSB | สมชาย (MSB) |
| 3 | `anake_req` | `password123` | REQUESTER | อเนก (Requester) |
| 4 | `prapas_rec` | `password123` | RECEIVING | ประภาส (Receiving) |
| 5 | `nop_prod` | `password123` | PROD | นพ (Production) |

**⚠️ Note:** Admin user is NOT in `prisma/seed.ts`. If DB is reset, recreate admin with:
```bash
cd ~/"wms-warehouse management system"/server
DATABASE_URL="file:..." npx tsx add-admin.ts
```

### Adding a User

Edit `prisma/seed.ts` — add to the `users` array, then:
```bash
npx prisma db seed
```

Or via Prisma Studio:
```bash
npx prisma studio    # opens web UI at localhost:5555
```

### RBAC Pattern (in `src/server.ts`)

```js
function rbac(...roles) {
  return (req, res, next) => {
    // ADMIN bypass — super user skips all role checks
    if (req.user.role === 'ADMIN') return next();
    if (!roles.includes(req.user.role)) return res.status(403).json({ ... });
    next();
  };
}

// Usage on endpoints:
app.get('/api/v1/some-endpoint', auth, rbac('PBMC', 'MSB'), handler);
```

### Auth Endpoint

```
POST /api/v1/auth/login
Body: { "username": "...", "password": "..." }
Response: { accessToken, refreshToken, user: { id, username, displayName, role } }
```

JWT secret: `dev-se...2026` (defined at top of server.ts)

## Frontend UI Patterns

### Theme: Mitr Font (changed from Kanit 2026-05-27)

All text uses **Mitr** font (Google Fonts, looped Thai, 6 weights). Implementation:
- `tailwind.config.js`: `kanit: ['Mitr', 'sans-serif'], sarabun: ['Mitr', 'sans-serif']`
- `globals.css`: body default is `font-kanit`
- `index.html`: Google Fonts link for Mitr weights 300-700
- **Pitfall:** After changing tailwind config, MUST restart Vite with `--force` or old font persists

### Error States (Professional Thai)

**Never show raw error messages.** All error states use professional Thai text:
- Connection errors: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้" + "กรุณาตรวจสอบว่าเซิร์ฟเวอร์กำลังทำงานอยู่ที่ port 4000"
- Data errors: "ไม่สามารถโหลดข้อมูลได้ในขณะนี้" + "ระบบกำลังพยายามดึงข้อมูล — หากปัญหายังคงอยู่ กรุณาลองใหม่อีกครั้ง"
- Button text: "ลองใหม่" (not "Try Again")

### Getting Started Guide

Dashboard has a collapsible `<details>` card showing the 5-step workflow:
1. 📡 Data Gateway (PBMC) — Upload EDI-INV + EDI-PL
2. 📦 Pallet Plan (PBMC/MSB) — Calculate pallets, QR codes
3. 🚛 Unload Workspace (RECEIVING) — Photo + Tally + E-Sign
4. 📱 Local Portal (REQUESTER) — Local delivery with OCR
5. ✅ Central Verification (PBMC) — Chain of custody, ERP sync

Component: `client/src/pages/dashboard/GettingStartedGuide.tsx`

### Workflow Guide (Admin Page)

Full comprehensive guide at `/workflow-guide` (ADMIN only). Component: `client/src/pages/admin/WorkflowGuidePage.tsx`
8 sections: Business Context (8-Point Scope grid), Technology Stack (3-column cards), NFR Targets, 6-Step Workflow cards, State Machine (8 states), RBAC table, API Quick Reference (12 endpoints), Getting Started for devs.

### SCR Naming Standard

All 6 screens use `SCR-XX — Name` with emoji in 3 places:
- **Sidebar:** `Data Gateway` (label), `📡` (icon), `/data-gateway` (path)
- **Header.tsx pageTitles:** `'/data-gateway': 'SCR-01 — Data Gateway'`
- **BSF sidebar:** `📡 SCR-01 — Data Gateway`

SCR-01 Data Gateway → SCR-02 Dashboard → SCR-03 Pallet Plan → SCR-04 Unload → SCR-05 Local Portal → SCR-06 Verification

**http://localhost:4000/admin** — Real-time view of all DB data (users, containers, items, audit logs). No login required. Renders server-side HTML with Tailwind.

## Ports

| Service | Port |
|---------|------|
| Mock Server | 4000 |
| Frontend (Vite) | 5173 |

## Testing API

```bash
# Login
curl -s -X POST http://localhost:4000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"password123"}'

# Health check
curl -s http://localhost:4000/api/v1/health
```

## Login Troubleshooting

When login fails silently (no error message, stays on login page), work through this checklist:

### 1. Test API directly first

```bash
# Verify mock server auth works
curl -s -X POST http://localhost:4000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"password123"}'

# Verify Vite proxy works
curl -s -X POST http://localhost:5173/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"password123"}'
```

If API returns 200 with `{success:true, data:{accessToken, user}}` — the backend is fine, problem is in frontend code.

### 2. Check frontend-API contract match

The #1 cause of silent login failure is **mismatch between API response shape and frontend expectations**.

**Backend responds (standard envelope):**
```json
{"success": true, "data": {"accessToken": "...", "user": {"id":5, "username":"admin", "displayName":"Admin (Super User)", "role":"ADMIN"}}}
```

**Frontend `api.ts` response interceptor** unwraps this automatically:
```ts
api.interceptors.response.use((response) => {
  if (response.data && 'success' in response.data && 'data' in response.data) {
    response.data = response.data.data;  // unwrap to { accessToken, user }
  }
  return response;
});
```

After unwrapping, `useAuth.tsx` reads:
```ts
const { data } = await api.post('/auth/login', { username, password });
setToken(data.accessToken);  // NOT data.token
setUser(data.user);
```

**`/auth/me` endpoint** — `GET /api/v1/auth/me` (authenticated) returns `req.user` from JWT. This endpoint NOW EXISTS (added 2026-05-27). On page refresh, `fetchUser()` calls `/auth/me` to restore session from stored token.

**Common frontend bugs in `useAuth.tsx`:**

| Bug | Symptom | Fix |
|-----|---------|-----|
| `data.token` instead of `data.accessToken` | Token never saved to localStorage; login looks like it worked but `isAuthenticated` stays `false` | Use `data.accessToken` |
| `/auth/me` endpoint missing from backend | Token cleared on every page refresh — user gets bounced back to `/login` | Ensure `GET /auth/me` route exists in `auth.routes.ts` |
| User interface mismatch (`fullName` vs `displayName`) | Sidebar shows empty name or `undefined` | Match frontend `User` interface to backend response: `{ id: number, username, role, displayName }` |
| `RoleRoute` doesn't include `ADMIN` in `allowedRoles` | Dashboard shows "Access Denied" even after successful login | Add `user.role !== 'ADMIN' &&` bypass in `RoleRoute.tsx` |
| `.ts` file contains JSX | Vite esbuild fails with `Expected ">" but found "value"` | Rename to `.tsx` |

### 3. Vite HMR silently ignores hook/route changes

After fixing code, if the browser still behaves as if old code is running, check what Vite is actually serving:

```bash
# Compare served code vs source
curl -s http://localhost:5173/src/hooks/useAuth.tsx | grep -o 'atob\|/auth/me'
```

If the served code doesn't match your edits, Vite HMR missed the change. **Cache clear alone (`rm -rf node_modules/.vite`) is NOT sufficient** for hooks and route component files — a full Vite restart is needed:

```bash
kill $(ss -tlnp | grep 5173 | grep -oP 'pid=\\K\\d+')
cd ~/"wms-warehouse management system"/client && npm run dev
```

Wait for Vite to restart (check `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/` returns 200), then verify the served code matches.

**`.ts` → `.tsx` rename:** Vite esbuild will fail on JSX in `.ts` files with `Expected ">" but found "value"`. Rename the file to `.tsx`. Vite may cache the old `.ts` resolution — a full restart is needed.

### 4. Full debugging flow

```
API test (curl) → API proxy test (curl) → Read frontend source → Fix mismatch
→ Restart Vite (not just HMR) → Verify served code → Browser test
```

## Admin Role Permission Audit

When adding/changing roles or when admin can't access pages, audit ALL 3 layers:

### Layer 1: Frontend Route Guards (`routes/RoleRoute.tsx`)

```tsx
// ❌ Broken — ADMIN not in any allowedRoles list
if (!user || !allowedRoles.includes(user.role)) { ... }

// ✅ Fixed — ADMIN bypass
if (!user || (user.role !== 'ADMIN' && !allowedRoles.includes(user.role))) { ... }
```

### Layer 2: Sidebar Navigation (`components/layout/Sidebar.tsx`)

**⚠️ Most commonly missed!** Even if Route Guard lets admin through, sidebar menu filtering hides navigation links:

```tsx
// ❌ Broken — ADMIN doesn't match any menu item's roles array
menuItems.filter((item) => user && item.roles.includes(user.role))

// ✅ Fixed — ADMIN sees ALL menus
menuItems.filter((item) => user && (user.role === 'ADMIN' || item.roles.includes(user.role)))
```

### Layer 3: Backend RBAC (`server/src/server.ts`)

```js
function rbac(...roles) {
  return (req, res, next) => {
    // ✅ Already has ADMIN bypass
    if (req.user.role === 'ADMIN') return next();
    if (!roles.includes(req.user.role)) return res.status(403).json({ ... });
    next();
  };
}
```

### Audit Checklist

When admin says "เข้าไม่ได้" or "มองไม่เห็น":

- [ ] Can admin call the API directly? → `curl` with admin token
- [ ] Does `RoleRoute.tsx` allow ADMIN? → check `allowedRoles` + bypass
- [ ] Does `Sidebar.tsx` show the menu for ADMIN? → check `roles` filter
- [ ] Does mock server `rbac()` have admin bypass? → check middleware
- [ ] After code fixes, did Vite actually serve the new code? → `curl` verify

**Pattern to avoid:** Fixing only RouteRole but missing Sidebar filter → admin can type URLs but sees empty sidebar with no links.
