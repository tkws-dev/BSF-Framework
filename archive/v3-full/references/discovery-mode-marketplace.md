# Discovery Mode — Marketplace / Platform Pre-BSF Framework

> **When to use:** User brings a new platform/marketplace idea (on-demand services, matching,
> two-sided market, gig economy). Use BEFORE jumping to BSF 00.

## Discovery Flow

```
🧠 Idea Drop
    │
    ▼
🔍 Competitive Landscape Map (research + analysis)
    │
    ▼
🏗️ Framework Building — organize into layers/pillars
    │
    ▼
🔐 Trust & Safety Deep-Dive (MANDATORY for marketplace)
    │
    ▼
🤖 AI/ML Opportunity Scan (where can AI intermediate?)
    │
    ▼
💬 Chat-as-Interface Design (3-party chat + state machine)
    │
    ▼
📣 Content-First Launch Strategy (audience before product)
    │
    ▼
📦 Component Inventory (enumerate everything to build)
    │
    ▼
🎯 MVP Scoping — what's Phase 1 vs Blueprint
    │
    ▼
✅ Ready for BSF 00
```

## Structured Discovery Questions

### Phase 1: Core Mechanics
1. **Matching logic** — Radius? Skill-based? Bid? Real-time vs request-bid?
2. **Supply side** — Verification model (Light/Medium/Heavy), onboarding, quality control
3. **Revenue model** — Commission vs subscription vs lead-fee vs freemium
4. **Scale/Geography** — City-first strategy, expansion corridor

### Phase 2: Competitive Research

Research competitor verification models across tiers:

| Tier | Examples | Verification | Key Lesson |
|------|---------|-------------|------------|
| Global Light | Thumbtack | Background check only | Quality suffers, trust breaks |
| Global Medium | TaskRabbit | BG check + ID + photo | OK for general tasks |
| Asia Heavy | Urban Company | ID + BG + skill test + training + uniform | High trust, high cost |
| Thai Light | Facebook groups | None | Zero accountability |
| Thai Medium | Grab, LINE MAN | ID + license + face + location | Good for transport |

### Phase 3: Layer Framework

For marketplace platforms, organize analysis into safety/trust layers:

```
Layer 7: INSURANCE — platform-backed guarantees
Layer 6: EMERGENCY — panic button, call center, safety timeout
Layer 5: REPUTATION LOCK — rating tied to verified identity
Layer 4: ESCROW — payment held by platform until completion
Layer 3: DYNAMIC VERIFY — location tracking + photo check-in during job
Layer 2: STATIC VERIFY — ID + photo + background check at onboarding
Layer 1: PLATFORM AS WITNESS — all interactions logged, no off-platform comms
```

### Phase 4: AI Middle Layer Pattern (4 Engines)

For platforms where users describe needs in natural language — AI intermediates every interaction:

```
USER INPUT (text/photo/voice)
       │
       ▼
┌──────────────┐
│  AI INTAKE   │  classify + extract entities + urgency + estimate
│  Engine      │  "แอร์ไม่เย็น ขึ้น E3" → หมวด:แอร์-ซ่อมบอร์ด 🔴
└──────┬───────┘
       │ structured request (category, urgency, required skills)
       ▼
┌──────────────┐
│  AI BADGE    │  verify worker skill documents → activate/deactivate badges
│  Verifier    │  ตรวจเอกสารช่าง → badge:แอร์-ACTIVE → รับงานแอร์ได้
└──────┬───────┘
       │ skill-gated supply pool (only badge-active workers visible)
       ▼
┌──────────────┐
│  AI MATCHER  │  match by: verified badges + radius + rating + availability
│  Engine      │  ranked list, not just closest distance
└──────┬───────┘
       │ matched candidates
       ▼
┌──────────────┐
│  AI GUARDIAN │  lives in every job chat — state machine driver + safety net
│  (in Chat)   │  track GPS, detect anomalies, serve facts for disputes
└──────────────┘
```

**AI Intake capabilities (MVP):**
- Classify job type from free-text/story/voice
- Extract key entities (appliance model, error codes, symptoms)
- Urgency scoring (🔴🟡🟢)
- Skill mapping → required worker badges
- Price estimation range
- Auto-summarize for worker readability

**AI Badge Verifier capabilities:**
- OCR + classify submitted documents (ใบเซอร์, วุฒิบัตร, รูปผลงาน)
- Auto-approve low-risk badges, flag ambiguous cases for human review
- Periodic re-verification (badge expiry, document renewal)
- Dedup detection: same person creating multiple accounts → face matching
- Badge granularity: per-category (ไฟฟ้า, ประปา, แอร์, ...) — not one-size-fits-all

### Phase 5: Badge System Design

Tiered trust badges for supply-side:

| Badge | Condition | Permissions |
|-------|-----------|------------|
| 🥉 Bronze | KYC passed (ID + Photo) | View jobs, cannot accept |
| 🥈 Silver | Bronze + AI-verified skill badge ≥1 | Accept jobs in verified category only |
| 🥇 Gold | Silver + 20 jobs + rating ≥4.5 | Priority matching, top of search |
| 💎 Pioneer | First 50 fully verified workers | 0% commission for 3 months |

### Phase 6: 3-Party Chat as Core State Machine

In marketplace platforms, **chat is not a feature — it is the operating system**. Every job passes through states, and the chat room is where those transitions are announced, logged, and actioned.

**Chat participants:** 👤 Customer + 👷 Worker + 🤖 AI

**Job Lifecycle = Chat State Machine:**

```
CREATED ──→ MATCHING ──→ ACCEPTED ──→ EN_ROUTE ──→ ARRIVED
   │            │            │            │            │
   🤖           🤖           🤖           🤖           🤖
   classify   broadcast   confirm     track ETA   start timer
                                                       │
                                              IN_PROGRESS ──→ COMPLETED ──→ PAID ──→ REVIEWED
                                                   │              │           │          │
                                                   🤖             🤖          🤖         🤖
                                                monitor        verify     release    request
                                                               location   escrow     rating
```

**AI has 3 roles in every chat:**
- **Coordinator** — announces state transitions, ETA, match found, payment released
- **Guardian** — detects anomalies (over-time, off-geofence, abusive language, off-platform payment)
- **Memory** — full audit trail; during disputes, retrieves exact timeline + GPS log + messages

**AI Personality Design (critical for user trust):**
- 🟢 Optimistic but not fake — "เจอช่างให้แล้วนะครับ อีก 15 นาทีถึง 🏍️"
- 🟡 Neutral in disputes — "ระบบบันทึกว่าช่างถึงหน้างานเวลา 14:33 — ลูกค้ากดยืนยันเวลา 14:35" (facts only, no judgment)
- 🔴 Assertive on safety — "ระบบตรวจพบสิ่งผิดปกติ กรุณายืนยันว่าปลอดภัย"
- 📊 Data-driven — "ช่างสมชายมี Rating 4.9 ⭐ จาก 47 งาน"

**Dispute Resolution Philosophy (tkws convention):**
> "เราไม่ตัดสิน เราเสิร์ฟความจริง" — AI presents verified facts (timestamps, GPS, chat log, photos). Humans weigh the evidence and decide. AI is impartial, never takes sides.

**Technical architecture:**
- WebSocket for real-time chat + state transitions
- AI reads every message → classifies intent → may trigger state change
- Not every message hits LLM — rule-based triggers for state transitions, LLM only for NL understanding and response generation

### Phase 7: Content-First Launch Strategy

**Principle:** Don't wait for the product to build an audience — build the audience FIRST, then launch to people who are already waiting.

**Content × Platform Flywheel:**
```
Content → Audience → Users → Data → Content (loop)
   ↑                                      │
   └──────────────────────────────────────┘
```

**Channel strategy:**

| Channel | Content Type | Purpose |
|---------|-------------|---------|
| TikTok | Short clips — "ช่างสอนซ่อม", "ภัยช่างเถื่อน", AI explainers | Viral reach, mass awareness |
| YouTube | Long-form — How-to, Case Study, Behind the Scenes | SEO, authority building |
| Facebook | Page + Group "สารพัดช่าง ชลบุรี" | Community, trust, direct engagement |
| LINE OA | Push notifications — promos, updates, onboarding | CRM, retention |

**Content pillars:**
- 📚 EDUCATE — "รู้ก่อนจ้าง" (pricing guides, warning signs, how AI matching works)
- 🛡️ TRUST — "ปลอดภัยกว่า" (badge verification process, escrow explainer, case studies)
- 👷 COMMUNITY — "ช่างคือฮีโร่" (day-in-the-life, badge journey, craftsman pride)
- 🤖 AI TALK — "เบื้องหลัง AI" (how AI classifies, verifies badges, resolves disputes)

**Pre-Launch Timeline:**
- Month 1-2: Content only — build followers, collect early-adopter signups
- Month 2-3: Teaser phase — announce platform, recruit craftsman early adopters
- Month 3-4: Soft Launch — content audience becomes first users

### Phase 8: Growth & Acquisition Mechanics

**Dual-Sided Referral System:**
- 👤 Customer referral: "ชวนเพื่อน → ได้เครดิต 100 บาท"
- 👷 Craftsman referral: "ชวนเพื่อนช่าง → ลด commission 1 เดือน"
- Built-in from MVP, not an afterthought

**Landing Page (Pre-Launch Essential):**
- `sarapadchang.com` — single page, SEO-optimized
- QR code → deep link to App Store / Play Store
- Trust signals: badge system explainer, verified reviews
- B2B inquiry form for factory/industrial partnerships
- Tech: Next.js static or Astro — 1-2 days to build

**In-App Voice/Video Call (Phase 2):**
- Customer shows the problem live before worker arrives
- Worker estimates tools/materials needed → fewer return trips
- Safety: no phone number exchange (PDPA-compliant)
- Trust: see each other's face before opening the door

### Phase 9: Component Inventory & Prioritization

Before writing a single line of code, enumerate EVERY component:

| # | Component | Type | Users | Priority |
|---|-----------|------|-------|----------|
| 1 | Customer App | Mobile (RN) | Customers | 🔴 MVP |
| 2 | Craftsman App | Mobile (RN) | Craftsmen | 🔴 MVP |
| 3 | Admin Dashboard | Web (React) | Internal Team | 🔴 MVP |
| 4 | API Gateway | Backend | All | 🔴 MVP |
| 5 | AI Intake Engine | AI Service | Customers | 🔴 MVP |
| 6 | AI Badge Verifier | AI Service | Admin+Craftsmen | 🟡 Phase 2 |
| 7 | AI Matcher | AI Service | All | 🔴 MVP |
| 8 | AI Guardian | AI Service | All | 🟡 Phase 2 |
| 9 | Chat Service (WebSocket) | Backend | All | 🔴 MVP |
| 10 | Payment/Escrow | Backend | All | 🔴 MVP |
| 11 | Location Service | Backend | All | 🔴 MVP |
| 12 | Push Notification | Backend | All | 🔴 MVP |
| 13 | Database (PostgreSQL) | Infra | — | 🔴 MVP |
| 14 | File Storage (S3/R2) | Infra | — | 🔴 MVP |
| 15 | Cache (Redis) | Infra | — | 🟡 Phase 2 |
| 16 | TikTok/YT/FB/LINE | Content | Public | 🟢 Pre-Launch |
| 17 | Landing Page | Web | Public | 🟢 Pre-Launch |
| 18 | CI/CD Pipeline | DevOps | Dev | 🟡 Phase 2 |
| 19 | Monitoring (Grafana+Sentry) | DevOps | Dev | 🟡 Phase 2 |

**Workspace structure for multi-app marketplace (tkws standard):**
```
hermes-jung-sa/[project]/
├── 1-SRS/              ← Blueprint & Spec
│   ├── bsf/            ← BSF detail docs
│   ├── companions/     ← swagger.yaml, project-setup.md
│   ├── diagrams/       ← ERD, DFD, Sequence
│   ├── interfaces/     ← SCR-00 to SCR-N
│   └── sample-data/
├── apps/
│   ├── customer/       ← Mobile App (React Native)
│   ├── craftsman/      ← Mobile App (React Native)
│   └── admin/          ← Web Dashboard (React)
├── server/             ← Backend API + Services
├── content/            ← Content Strategy & Assets
├── docs/               ← Additional documentation
├── docker-compose.yml
├── .env.example
└── README.md           ← Vision, Features, Phases overview
```

### Phase 10: Geography Selection Strategy

First-city selection is make-or-break for marketplace launches:

**Evaluation criteria:**
| Factor | Why It Matters |
|--------|---------------|
| Demand density | Enough jobs to prove liquidity |
| Competition gap | Weak incumbents = easier entry |
| Supply availability | Enough potential workers nearby |
| Expansion corridor | Natural path to next cities |
| Founder familiarity | Local knowledge = faster iteration |

**Example — Chonburi (สารพัดช่าง case):**
- 🏭 Demand: 20+ industrial estates, 100K+ workers needing home services
- 🏖️ Urban pockets: Sriracha, Pattaya, Bangsaen, Mueang — dense, high spending power
- 📍 Expansion path: Chonburi → Rayong → Chachoengsao → EEC → Bangkok
- 🧪 Right size: 1.5M population — testable, not fighting Grab in Bangkok
- 🏠 Founder lives there — deep local knowledge

### Phase 11: MVP Scoping

| Blueprint Only | MVP Must-Have |
|----------------|---------------|
| Insurance integration | ID + Photo Verify |
| Emergency API | Escrow Payment |
| AI matching algo | Radius + Province Search |
| Multi-language | Thai-only UI |
| Admin dashboard | Basic rating system |

### Phase 12: Zero-Baht MVP Strategy (Bootstrapped Solo Founder)

When the user has **฿0 budget** for paid APIs (OpenAI, Omise escrow, etc.):

**Two-Track Approach:** Build MVP with free alternatives, but prepare API adapter interfaces for seamless upgrade later.

| Feature | Free MVP Substitute | Phase 2 Paid Upgrade |
|---------|-------------------|----------------------|
| AI Classify | Dropdown category picker (5 categories + symptoms) | OpenAI API — swap adapter |
| AI Badge Verify | Admin manual document review | OpenAI Vision API — swap adapter |
| AI Guardian | Rule-based system messages (state transitions, warnings) | OpenAI API — LLM in chat |
| True Escrow | QR PromptPay + Admin verify slip manually | Omise API — automated escrow |
| Maps | MapLibre GL JS + OpenStreetMap (free tiles) | Google Maps (if needed) |

**Adapter Pattern:** Every paid API is behind an interface. Phase 1 ships a free implementation. Phase 2 swaps one config value.

```
Phase 1:  DropdownClassifier implements CategoryResolver
Phase 2:  OpenAIClassifier implements CategoryResolver  ← same interface
```

**MVP definition (for user education in Thai):**
- MVP = Minimum Viable Product = "ของที่ฟีเจอร์น้อยที่สุด แต่ใช้แก้ปัญหาให้คนได้จริง"
- NOT "ของกั๊ก" — it's the smallest thing that delivers real value
- Examples: Facebook started as Harvard-only profiles. Airbnb started as renting an air mattress.
- Goal: Ship in 2 months → get real users → learn what to build next

## Common Pitfalls

- ❌ **Chicken-Egg:** Launch without seeded supply side → empty marketplace
  - ✅ Seed 20-30 workers before launch, zero commission for early adopters
- ❌ **Commission too early:** Take % before liquidity exists → supply flees
  - ✅ Soft Launch (month 1-3): 0%, Growth (4-6): 5-10%, Mature (7+): 15-20%
- ❌ **Self-declare skills:** Workers claim they can do everything → bad matches
  - ✅ AI-verified badges gate every category
- ❌ **Hardcoded categories:** New service type requires migration
  - ✅ Flexible schema: `categories` table with `parent_id` + JSON attributes
- ❌ **Platform as broker only:** Match and disappear → disputes unresolvable
  - ✅ Platform stays in every transaction: chat, payment, dispute resolution
- ❌ **Chat as afterthought:** Treating chat as a messaging feature bolted on later → no state machine, no AI guardian, disputes become he-said-she-said
  - ✅ Chat IS the platform — AI lives in every room, every message drives state transitions
- ❌ **No landing page:** Mobile-only, no web presence → zero SEO, no B2B inquiries, no trust signals before app download
  - ✅ Single-page site (SEO + QR deep-link + trust signals) — 1-2 days to build, essential for pre-launch
- ❌ **Wrong first city:** Picking Bangkok because it's biggest → burned by competition before proving model
  - ✅ Mid-size city with demand density + competition gap + founder local knowledge → validate first, expand later
- ❌ **No content before product:** Launch app to empty app store → zero users, immediate churn, expensive paid acquisition
  - ✅ 2-3 months of content → audience → early adopters → soft launch to warm market
- ❌ **AI that judges:** AI makes final dispute decisions → user rebellion, trust destroyed, regulatory nightmare
  - ✅ AI serves verified facts only — humans weigh evidence and decide. AI is witness, not judge.

## Transition to BSF

When discovery is complete and user says "พร้อม" or "เริ่ม spec ได้":
→ Move to Architect Mode: BSF 00 → 00-A → 00-B → 01 → ...

Carry forward from discovery into BSF:
- Safety layers → NFR Security section + Risk Register
- Badge system → Database schema (users, badges, verifications tables)
- AI pipeline → Architecture section + external service dependencies
- Escrow → Payment integration requirements
- Competitor gaps → Differentiator documentation in Part 1 (Story)
