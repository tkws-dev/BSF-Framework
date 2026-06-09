# สารพัดช่าง Negotiation System — Design & Implementation

## Design Decisions (tkws — 29 May 2026)

### Flow
```
POSTED → ช่างกดรับงาน → NEGOTIATING (3-party chat) → CONFIRMED → IN_PROGRESS
```

### 3-Party Chat
- **ลูกค้า** (customer)
- **ช่าง** (craftsman)
- **🤖 Bot อัตโนมัติ** (ระบบสารพัดช่าง)

Bot responsibilities:
| Stage | Bot ทำอะไร |
|---|---|
| เปิดห้อง | แนะนำตัว + สรุปงาน + สรุปข้อเสนอ + ขอ consent |
| ระหว่างเจรจา | เงียบ — ให้คนคุยกัน |
| Break loop | แทรก "final offer" หลัง N รอบ |
| Timeout | "ลูกค้าไม่ตอบกลับภายใน 10 นาที" |
| ตกลงสำเร็จ | "ยินดีด้วย! งาน CONFIRMED" |
| งานหมดอายุ | แจ้งทั้งคู่ |

### Rules (tkws)
| # | Rule |
|---|---|
| 1 | **คิวเจรจา**: first-come-first-served timestamp + tiebreaker = badge stars |
| 2 | **Fee โปร่งใส**: 10% จากราคาตกลงสุดท้าย แสดง breakdown |
| 3 | **Chat log**: `negotiations` table ผูก `job_id` สืบย้อนได้ |
| 4 | **Timeout 10 นาที**: เริ่มนับตั้งแต่ช่างส่งข้อเสนอ → ลูกค้าต้องตอบภายใน 10 นาที |
| 5 | **กันหมดอายุ**: `expires_at` +10 นาทีตอนเริ่มเจรจา (cap ครั้งเดียว) |
| 6 | **10 นาทีแค่เปิดประตู**: หลังจากทั้งคู่กำลังเจรจา — ไม่มีกรอบเวลา |

## DB Schema

### `negotiations` Table
```sql
negotiations (
  id UUID PK
  job_id UUID FK → jobs
  craftsman_id UUID FK → profiles
  sender_type TEXT — customer | craftsman | bot
  message_type TEXT — offer | chat | system
  offer_price NUMERIC — มีค่าเฉพาะ type=offer
  message TEXT
  created_at TIMESTAMPTZ
)
```

### `jobs` additions
```sql
ALTER TABLE jobs ADD COLUMN current_offer_price NUMERIC;
ALTER TABLE jobs ADD COLUMN negotiating_craftsman_id UUID;
ALTER TABLE jobs ADD COLUMN negotiation_started_at TIMESTAMPTZ;
ALTER TABLE jobs ADD COLUMN negotiation_round INT DEFAULT 0;
-- Add NEGOTIATING to state CHECK constraint
```

### RPC Functions (SECURITY DEFINER)
| RPC | Purpose |
|---|---|
| `start_negotiation(job_id, craftsman_id, offer_price, message)` | POSTED → NEGOTIATING, +10min expiry, 🤖 Bot เปิดห้อง |
| `send_negotiation_message(...)` | Insert message, auto-update offer_price/round |
| `confirm_offer(job_id)` | NEGOTIATING → ACCEPTED, assign member |
| `reject_offer(job_id, reason)` | NEGOTIATING → POSTED, 🤖 Bot แจ้ง |
| `get_negotiation_messages(job_id)` | Full chat log with sender_name |
| `negotiate_final_offer(job_id)` | 🤖 Bot triggers final offer prompt |

## Frontend Pattern: Inline Chat in Card

### tkws Rule: DO NOT navigate to a separate page
The chat lives inside the existing 60/40 card's `w-2/5` right panel.
User explicitly rejected page navigation — everything stays in `CraftsmanMapPage`.

### Implementation: 3-state switch in w-2/5
```
state === 'info'   → original job info (breadcrumb, description, price, accept button)
state === 'loading' → logo + spinner 3s
state === 'chat'   → NegoChat component (messages + input + cancel button)
```

States: `negotiating = false` → info mode
        `negoLoading = true` → loading mode (3 seconds)
        `negotiating = true && !negoLoading` → chat mode

### Job Summary Card
When negotiating, a semi-transparent card appears at bottom-left of map:
```jsx
<div className="absolute bottom-20 left-4 z-[1100]">
  <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl ...">
    {/* category icon + name + distance + price + "กำลังเจรจา" status */}
  </div>
</div>
```

## Implementation Pitfalls\n\n### Pitfall 1: Don't strip existing config objects when rewriting\nWhen rewriting CraftsmanMapPage to add negotiation, the original `STYLES` object had 5 variants.\nStripping it to 2 variants (minimal+dark) broke map display and removed `topBarBg` field.\n**Always preserve the full original structure of all config objects, interfaces, and state variables.**\n\n### Pitfall 2: Patch tool misalignment on TSX\nChaining multiple `patch` operations on TSX files can:\n- Insert imports in the middle of component bodies (e.g., `import LoadingLogo` after `const BRAND = theme.primary`)\n- Delete `const [loading, setLoading] = useState(true)` when matching partial strings\n- Create unbalanced JSX divs from ternary closing tags\n**For multi-section rewrites: use `write_file` with the complete file, not chained patches.**\n\n### Pitfall 3: useEffect after early return\nReact hooks must come BEFORE any conditional `return` in a component.\nPlacing `useEffect` after `if(!center) return (...)` causes silent runtime errors.\n\n### Pitfall 4: Never report success without browser verification\nUser rejected a claim that the page worked when it had parse errors.\nAlways: kill old process → clear Vite cache → restart → curl HTTP 200 → browser navigate → check console for JS errors.\n\n## Loading State Standard (tkws)
**Every loading state MUST show the system logo.**
A shared `LoadingLogo` component exists at `src/components/LoadingLogo.tsx`:
```tsx
<LoadingLogo text="กำลังโหลด..." size="sm|md|lg" />
```
Applied to: AuthGuard, AdminDashboard, CategoryManagement, UserManagement, CraftsmanMapPage (negoLoading + route loading).
