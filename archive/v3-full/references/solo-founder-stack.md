# Solo Founder Technology Stack

Pattern for 1-person teams building mobile+web platforms with zero backend code.

## Core Stack

```
React 19 + Vite + Tailwind CSS 4
    │
    ├── Capacitor → iOS + Android (1 codebase)
    ├── Supabase → DB + Auth + Storage + Realtime (zero backend code)
    ├── OpenAI API → AI capabilities (via Edge Functions)
    ├── Omise → Payment (Thai PromptPay)
    └── Firebase CM → Push notifications (free, unlimited)
```

## Why This Stack for Solo Devs

| Problem (Solo Dev) | Solution |
|---------------------|----------|
| No time to write backend | Supabase handles Auth, DB, Storage, Realtime, API |
| No time to learn native mobile | Capacitor wraps existing React web app |
| No budget for servers | Free tier: Supabase (500MB DB), Vercel (100GB bandwidth) |
| Need AI but can't train models | OpenAI API — pay per request (~฿0.10/classify) |
| Need Thai payment | Omise supports PromptPay + credit cards |
| Need GPS, Camera, Push on mobile | Capacitor plugins — no native code |

## Monthly Cost (MVP)

| Service | Plan | Monthly |
|---------|------|---------|
| Supabase | Free | ฿0 |
| Vercel | Hobby | ฿0 |
| OpenAI | Pay-per-use | ~฿50 |
| Firebase CM | Free | ฿0 |
| MapLibre/OSM | Free | ฿0 |
| Omise | Per-transaction | ~฿1,000* |
| **TOTAL** | | **~฿100-1,100** |

*Omise charges per transaction — cost scales with revenue

## Project Structure

```
project/
├── apps/
│   ├── mobile/          ← React + Vite + Capacitor
│   │   ├── src/pages/
│   │   │   ├── customer/
│   │   │   └── craftsman/
│   │   └── capacitor.config.ts
│   ├── admin/           ← React + Vite (Web only)
│   └── landing/         ← Astro (SEO landing page)
├── supabase/
│   ├── migrations/      ← DB schema
│   └── functions/       ← Edge Functions (AI intake, payment, matcher)
└── 1-SRS/               ← BSF Blueprint
```

## When to Use

- Team size: 1-2 people
- Budget: Bootstrapped (no VC)
- Product: Mobile-first platform with realtime features
- Timeline: MVP in 2-4 months
- Key need: GPS, Camera, Push, Auth, DB — all from JavaScript

## When NOT to Use

- High performance requirements (WebView limitations)
- Complex native features (AR, heavy video processing)
- Team > 5 with dedicated backend devs → use Express/Prisma instead
- Already have React Native expertise → use React Native directly

## Zero-Baht MVP Variant (No Paid APIs)

When budget is strictly ฿0, replace paid services with free alternatives while keeping the same structure:

| Paid Service | Free Alternative | Trade-off |
|-------------|-----------------|-----------|
| OpenAI API (classify) | Dropdown UI — user selects category+symptom manually | ~70-95% accurate vs ~98% with AI; 2-day dev time |
| Omise (escrow) | QR PromptPay + Admin manual slip verification | No true escrow — trust-based; admin workload |
| AI Badge Verifier | Admin manual review in dashboard | Slower verification; OK for < 50 craftsmen |
| AI Guardian (chat) | Rule-based system messages (state transitions only) | No smart dispute analysis; basic monitoring |

**Key principle:** Build with adapter pattern from day one — drop in paid APIs later without rewriting. E.g., `classify()` function that calls a dropdown UI resolver in MVP, replace with OpenAI API call in Phase 2.

**Zero-Baht monthly cost:** ฿0 (Supabase Free + Vercel Hobby + Firebase CM Free + Manual processes)

## Migration Path

```
MVP (฿0):     Dropdown UI + QR Manual + Admin verify
Phase 2:      OpenAI API ($50/mo) + Omise escrow → replace adapters
Growth:       Supabase Pro ($25/mo) → Vercel Pro ($20/mo)
Scale:        Migrate heavy pages to React Native gradually
              Replace Supabase with custom Express only when needed
```
