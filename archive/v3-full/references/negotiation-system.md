# Negotiation System — Architecture & Implementation

## Overview
Built May 2026 for สารพัดช่าง. A 3-party negotiation chat between customer, craftsman, and an automated Bot, triggered when a craftsman accepts a job. The negotiation replaces the right panel (w-2/5) of the existing 60/40 card overlay.

## Design Decisions (from discussion with tkws)

| Decision | Detail |
|---|---|
| Rounds | Unlimited — chat-style, no hard cap |
| Bot role | Opens conversation, facilitates, breaks loop at N rounds |
| Visibility | Other craftsmen see orange pin (NEGOTIATING), job NOT hidden |
| Queue | timestamp (microsecond) → tiebreaker: badge stars |
| Fee | 10% from negotiated final price, transparent breakdown |
| Timeout | 10 min for FIRST customer response. After engagement: no limit |
| Expiry protection | `expires_at` +10min when negotiation starts (no accumulation) |
| Re-entry | Same craftsman can retry after timeout, fresh loop |

## State Machine

```
POSTED → NEGOTIATING → CONFIRMED (→ ACCEPTED → IN_PROGRESS)
              ↓
         timeout/reject → POSTED
```

## Database

**Table `negotiations`:**
```sql
id UUID PK, job_id UUID FK, craftsman_id UUID FK,
sender_type TEXT (customer/craftsman/bot),
message_type TEXT (offer/chat/system),
offer_price NUMERIC, message TEXT, created_at TIMESTAMPTZ
```

**Columns added to `jobs`:**
- `current_offer_price NUMERIC`
- `negotiating_craftsman_id UUID`
- `negotiation_started_at TIMESTAMPTZ`
- `negotiation_round INT`

**RPCs (all SECURITY DEFINER):**
- `start_negotiation(job_id, craftsman_id, offer_price, message)` — POSTED→NEGOTIATING, +10min expires, Bot opens
- `send_negotiation_message(...)` — insert message, auto-update price/round
- `confirm_offer(job_id)` — →ACCEPTED, assign member, Bot confirms
- `reject_offer(job_id, reason)` — →POSTED, Bot announces
- `get_negotiation_messages(job_id)` — full chat log with sender names
- `negotiate_final_offer(job_id)` — Bot triggers after N rounds

Migration: `supabase/migrations/010_negotiations.sql`

## UI Implementation Pattern

The negotiation chat lives INSIDE the existing 60/40 card overlay in CraftsmanMapPage. NO separate page or route.

**Key pattern:** The right panel (w-2/5 flex flex-col) switches content via ternary:
```
{negoLoading ? <LoadingSpinner/> : negotiating ? <Chat/> : <JobInfo/>}
```

**Container locking:** Use `height:420` (not minHeight) + `flex-shrink-0` on BOTH left and right panels. Without this, the card shrinks when chat content is shorter than job info.

**Job summary card:** Overlay on the LEFT mini map (60% panel) at `absolute bottom-3 left-3 right-3 z-[50]` with `bg-black/50 backdrop-blur-sm`.

## Pitfalls

- ❌ Don't navigate to a new page — everything stays in the same card overlay
- ❌ Don't wrap the card in a ternary — the card container is ALWAYS visible; only the right panel content switches
- ❌ Container height must be FIXED (`height:420`) not `minHeight:400`, else it collapses during loading
- ❌ Both left and right panels need `flex-shrink-0`
- ❌ Job summary card must have `z-[50]`+ to overlay the mini map's MapContainer
