# สารพัดช่าง Dev Environment (updated 29 May 2026)

## Database

### Master Data (migrations/)
| # | ไฟล์ | เนื้อหา |
|---|------|--------|
| 001 | `master_schema.sql` | Tables, indexes, RLS, auth trigger, admin functions, 3 base profiles |
| 002 | `master_categories.sql` | 109 rows — 10 L1 → 53 L2 → 46 L3 (hierarchy via parent_id) |
| 003 | `create_job_rpc.sql` | SECURITY DEFINER RPC for Dev Login INSERT bypass |
| 004 | `cancel_job_rpc.sql` | SECURITY DEFINER RPC for Dev Login UPDATE bypass |
| 005 | `expire_job_rpc.sql` | Auto-expire jobs |
| 006 | `accept_job_rpc.sql` | Accept job (now superseded by negotiation) |
| 007 | `badges_v2.sql` | Badge stars 1-5 + status system |
| 008 | `promote_badge_rpc.sql` | Auto-promote badges |
| 009 | `get_badge_categories_rpc.sql` | Get badge categories for a user |
| 010 | `negotiations.sql` | 🆕 Negotiation table + 6 RPCs + NEGOTIATING state |

### Sample Data
| ไฟล์ | เนื้อหา |
|------|--------|
| `seed_jobs.sql` | 148 test jobs, all with proper L2 category_ids |

### Key Schema Notes
- **No `symptoms` table** — replaced by 3-level category hierarchy using `parent_id`
- **No `symptom_id` on jobs** — only `category_id` pointing to L2
- **`expires_at` column** on jobs (added 29 May)
- **`description` column** on categories (for future AI matching)
- **Category UUIDs are deterministic** (uuid5 with namespace + code) — same IDs on every import
- **RLS on jobs has INSERT + UPDATE policies** — but Dev Login needs SECURITY DEFINER RPCs to bypass

### Dev Login + RLS Pattern
Dev Login bypasses Supabase Auth → `auth.uid()` = NULL → direct INSERT/UPDATE fails silently.
**Always use SECURITY DEFINER RPCs for writes when Dev Login is active:**
- `supabase.rpc('create_job', {...})` — create job
- `supabase.rpc('cancel_job', { p_job_id })` — cancel job

## Frontend

### Font System
- CSS custom properties: `--font-heading` and `--font-body` set on `document.documentElement`
- Hook: `lib/fontSize.ts` → `useFontSize()` returns `{ bodySize, headingSize, setFontSize }`
- Slider in DisplaySettings panel controls 14-24px range
- All text elements use `style={{ fontSize: 'var(--font-heading)' }}` instead of Tailwind text-* classes

### Category Hierarchy in UI
- **CreateRequestModal**: 5-step wizard — 1L1→2L2→3L3(symptoms)→4Description→5Price+Time
- L2 without L3 children → auto-skip to Description
- **Map filter**: L1 checkboxes with counts, filter routes through L1→L2 mapping with `l1ToL2` Map

### Page Structure
- `CustomerMapPage.tsx` — map + tab bar + inline CreateRequestModal overlay
- `CreateRequestPage.tsx` — renamed to `CreateRequestModal`, renders as overlay (not separate page)
- `BottomTabBar.tsx` — tab bar + center button
- `DisplaySettings.tsx` — combined panel: map style, color, font slider
- `Header.tsx` — single button instead of separate map/color pickers

## Server Restart & Verification (CRITICAL — updated 29 May 2026)

**⚠️ NEVER tell user code works without verifying in browser first.**

Restart sequence:
```bash
# 1. Kill old Vite (specific port, NOT pkill -f vite)
ss -tlnp | grep 5200 | grep -oP 'pid=\K\d+' | xargs -r kill

# 2. Clear Vite cache (WSL /mnt/c/ stale cache issue)
rm -rf apps/mobile/node_modules/.vite

# 3. Restart
cd apps/mobile && npx vite --port 5200 --force &

# 4. Verify
sleep 8 && curl -s -o /dev/null -w "%{http_code}" http://localhost:5200/
# Expect: 200
```

**Browser verification (after restart):**
1. `browser_navigate` to the modified page
2. `browser_console` — check for JS errors (must be 0)
3. If page shows login form → set Dev Login localStorage and reload
4. Only when page renders with sidebar + content → tell user

## Shared Components

### LoadingLogo
Path: `apps/mobile/src/components/LoadingLogo.tsx`
Usage: `<LoadingLogo text="กำลังโหลด..." size="sm|md|lg" />`
- Shows logo.png in white rounded container + animated bouncing dots (brand color)
- Applied to: AuthGuard, AdminDashboard, CategoryManagement, UserManagement, CraftsmanMapPage

## Key UI Patterns
- **Modal overlay**: `absolute inset-0 z-[2000] backdrop-blur-sm bg-black/20` + `stopPropagation` on card
- **Filter checkboxes**: `Set<string>` state, `l1ToL2` Map for hierarchy routing, counts per L1
- **Reverse geocode**: Nominatim OSM — `useReverseGeocode(lat, lng)` hook with cancellation
- **Supabase Presence**: `channel.on('presence', {event:'sync'}, ...)` for online user count

## 🔴 CRITICAL: Verify Before Telling User to Test
**NEVER tell the user to refresh/test without first self-verifying.** User got frustrated 2026-05-29 multiple times when told to Ctrl+Shift+R only to find stale UI or build errors.
Workflow for every change:
1. Make changes
2. Kill old Vite process: `ss -tlnp | grep PORT | grep -oP 'pid=\K\d+' | xargs -r kill`
3. Clear Vite cache: `rm -rf node_modules/.vite`
4. Start Vite: `npx vite --port PORT`
5. Verify: `curl -s -o /dev/null -w "%{http_code}" http://localhost:PORT/` → must be 200
6. Check browser: `browser_navigate → browser_console` → 0 JS errors
7. ONLY THEN tell user to refresh

## Loading States — ALWAYS Show Logo
**Rule (29 May 2026):** Every loading state in the app MUST show the system logo (`/logo.png`).
Use the shared `LoadingLogo` component at `src/components/LoadingLogo.tsx`:
```tsx
<LoadingLogo text="กำลังโหลด..." size="sm|md|lg" />
```
- `sm`: admin panels, inline loading; `md`: full-page; `lg`: initial auth load
- Do NOT use bare spinner or text-only loading states
- AuthGuard MUST show LoadingLogo, not `return null`

## Negotiation System (v1 — 29 May 2026)
### DB
- `negotiations` table: id, job_id, craftsman_id, sender_type (customer/craftsman/bot), message_type (offer/chat/system), offer_price, message, created_at
- `jobs` new columns: current_offer_price, negotiating_craftsman_id, negotiation_started_at, negotiation_round
- State machine: POSTED → NEGOTIATING → ACCEPTED (via confirm_offer) or back to POSTED (via reject_offer)
- `expires_at` +10 min when negotiation starts (capped, non-cumulative)

### RPCs (all SECURITY DEFINER, granted to anon+authenticated)
| RPC | Purpose |
|---|---|
| `start_negotiation(job_id, craftsman_id, offer_price, message)` | Bot opens + craftsman offer → NEGOTIATING |
| `send_negotiation_message(job_id, craftsman_id, sender_type, message_type, price, msg)` | Insert chat message |
| `confirm_offer(job_id)` | Customer accepts → ACCEPTED, assigns member |
| `reject_offer(job_id, reason)` | Returns to POSTED, bot announces |
| `get_negotiation_messages(job_id)` | Full chat log with sender names |
| `negotiate_final_offer(job_id)` | Bot triggers final-offer prompt |

### Frontend — CraftsmanMapPage Negotiation Flow
- All negotiation stays INLINE in the existing 60/40 card (NOT a separate page)
- Right panel (`w-2/5 flex flex-col`) switches between: Job Info ↔ Loading (3s) ↔ NegoChat
- State variables: `negotiating`, `negoLoading`, `negoMsgs`, `negoInput`
- Job summary card appears at `absolute bottom-20 left-4` (bg-slate-900/70 backdrop-blur) when negotiating
- `NegoChat` is an inline component within the same file
- Polls `get_negotiation_messages` every 3s while negotiating
- Bot message rendered as centered brand-colored bubble
- Customer/craftsman messages as left/right aligned bubbles

## Supabase CLI Notes
- Connected via `sbp_...` access token
- **`$$` dollar quoting fails in inline queries** — use `-f file.sql` flag or `$func$` delimiter
- **WSL IPv6**: Direct DB connection fails; use Management API via `--linked` flag
