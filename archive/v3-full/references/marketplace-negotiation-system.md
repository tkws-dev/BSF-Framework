# Marketplace Negotiation System — 3-Party Bot-Facilitated Chat

Pattern for two-sided marketplaces where a service provider negotiates with a customer
before confirming a job. Designed for สารพัดช่าง (29 May 2026) but generalizable.

## Core Architecture

```
┌─────────────────────────────────────────┐
│          ห้องเจรจา (Negotiation Room)     │
│                                          │
│  👤 Customer    🤖 Bot    👷 Craftsman   │
│                                          │
│  Participants: 3 — customer, craftsman,  │
│  automated bot facilitator                │
└─────────────────────────────────────────┘
```

The bot is NOT an afterthought — it's an equal participant with specific responsibilities.

## Bot Responsibilities

| Stage | Bot Action |
|---|---|
| **เปิดห้อง** | Summarize job + craftsman + offer → ask for mutual consent |
| **ระหว่างเจรจา** | Silent — let humans talk (optionally inject market data) |
| **ครบ N รอบ** | Trigger "final offer" round |
| **Timeout** | Announce timeout reason → return job to market |
| **Confirm** | Congratulate + transition to work phase |
| **Expire** | Notify both parties |

### Bot Opening Message Template

```
"ระบบเชื่อมต่อสำเร็จ สารพัดช่างสวัสดีครับ 
คุณลูกค้า [name] ได้เสนองาน [category] 
และช่าง [name] เป็นคนรับงาน ด้วยข้อเสนอ [price]
พวกคุณทั้งสองยินยอมตกลงวางจ้างร่วมกันหรือไม่?"
```

The opening serves as a **consent gateway** — both parties must explicitly agree before
negotiation begins. This creates a legal/trust boundary that prevents later disputes.

## State Machine

```
POSTED ──(craftsman offers)──→ NEGOTIATING (🔶 orange pin on map)
                                    │
              ┌─────────────────────┼─────────────────────┐
              ↓                     ↓                     ↓
         ลูกค้าตกลง            ลูกค้าโต้กลับ          ลูกค้าเงียบ 10นาที
              ↓                     ↓                     ↓
         CONFIRMED            กลับ NEGOTIATING        กลับ POSTED
         (→ ACCEPTED)         (loop จนลงตัว)         (แจ้งช่าง)
```

Key design decisions:
- **No lock** — other craftsmen see 🟠 pin, know negotiation is in progress, can queue
- **Multi-round** — unlimited negotiation rounds until agreement or timeout
- **10-min timeout** — only for FIRST customer response; once engaged, no time limit
- **expires_at +10 min** — on negotiation start, extend job expiry (cap once, no accumulation)

## Queue / Tiebreaker

```
First-come-first-served by timestamp (microsecond precision)
  ↓
If timestamp collision (same microsecond):
  → Craftsman with higher badge stars in the job's category wins
```

## DB Schema

### `negotiations` table (chat log)

```sql
negotiations (
  id            UUID PK
  job_id        UUID FK → jobs          -- which job
  craftsman_id  UUID FK → profiles      -- which craftsman (constant per negotiation)
  sender_type   TEXT                     -- 'customer' | 'craftsman' | 'bot'
  message_type  TEXT                     -- 'offer' | 'chat' | 'system'
  offer_price   NUMERIC                  -- NULL unless message_type='offer'
  message       TEXT                     -- message body
  created_at    TIMESTAMPTZ
)
```

Note: `craftsman_id` stays constant through the negotiation — it identifies which
craftsman this negotiation thread belongs to, not who sent each message.
Use `sender_type` to distinguish who's speaking.

### `jobs` additions

```sql
ALTER TABLE jobs ADD COLUMN current_offer_price NUMERIC;
ALTER TABLE jobs ADD COLUMN negotiating_craftsman_id UUID → profiles;
ALTER TABLE jobs ADD COLUMN negotiation_started_at TIMESTAMPTZ;
ALTER TABLE jobs ADD COLUMN negotiation_round INT DEFAULT 0;
```

## RPC Functions (all SECURITY DEFINER)

| RPC | Signature | Action |
|---|---|---|
| `start_negotiation` | (job_id, craftsman_id, offer_price, message) → UUID | POSTED → NEGOTIATING, +10min expiry, bot opens, craftsman offer |
| `send_negotiation_message` | (job_id, craftsman_id, sender_type, message_type, offer_price, message) → UUID | Insert message, auto-update price/round |
| `confirm_offer` | (job_id) → void | NEGOTIATING → ACCEPTED, assign member, bot confirms |
| `reject_offer` | (job_id, reason) → void | NEGOTIATING → POSTED, bot announces reason |
| `get_negotiation_messages` | (job_id) → TABLE | Full chat log with sender names (JOINs profiles) |
| `negotiate_final_offer` | (job_id) → void | Bot triggers final-offer prompt after N rounds |

## Design Principles (tkws convention)

1. **Fee transparency** — 10% fee deducted from FINAL agreed price, shown as breakdown
2. **Chat log = traceability** — every message logged in `negotiations`, tied to job_id
3. **Bot = facilitator, not enforcer** — opens, closes, nudges; never decides
4. **Competitive tension via visibility** — 🟠 pin creates urgency without locking
5. **Consent-first** — both parties must explicitly agree before deal proceeds

## Pitfalls

- **Infinite loop without circuit breaker** — after N rounds (e.g. 5), bot should trigger final-offer
- **Expiry accumulation** — cap expires_at extension at +10min from original, not cumulative per negotiation attempt
- **Push notification dependency** — 10-min timeout is only fair if customer gets an actual push notification; without push, extend to 30-60 min
