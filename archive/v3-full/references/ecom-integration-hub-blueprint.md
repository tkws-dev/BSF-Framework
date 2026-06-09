# ECommerceIntegrationHub — Project Reference

> Created: 9 Jun 2026 | Status: Phase 1 Complete — Awaiting Stakeholder Approval

## Project Summary

Replace RPA UI scraping with API-based e-commerce order fetching. Phase 1: Shopee pilot.

Path: `/mnt/c/Users/tikawutw/hermes-jung-sa/ECommerceIntegrationHub/`

## Architecture

```
Dashboard → Unified Order Model → [Route] → Adapter Layer → Platform APIs
                                            ✅ Shopee (Phase 1)
                                            ⏳ Lazada/TikTok/Shopify (Phase 2+)
```

Key decisions:
- **Adapter pattern** — each platform gets its own adapter implementing same interface
- **Unified Order Model** — all adapters normalize to same schema before CSV export
- **DB stores summaries only** — order detail lives in CSV (EDI output for RPA)
- **No real-time** — manual fetch (button), Phase 2 may add cron schedule

## Blueprint v1.0 Structure

```
1-SRS/
├── Master Blueprint.html          ← Phase 1 (00+01+02), dark theme, Mermaid diagrams
└── companions/
    ├── requirements.yaml          ← FR-01→14, NFR, Risk, Data Stores
    ├── state-machine.yaml         ← 9 states + Unified Order Model fields
    └── components.yaml            ← 5 screens (SCR-01→05) + props + interactions
```

## Tech Stack (Phase 2 will define)

- Frontend: React + Vite (same as other projects)
- Backend: Express + Prisma
- Database: PostgreSQL (Supabase free tier)
- CSV: UTF-8 BOM for Thai Excel compatibility

## API Research Sources

Shopee API v2 details in `ecommerce-platform-apis.md`:
- Auth: HMAC-SHA256 + OAuth
- Pagination: cursor-based, max 100/page
- Rate limit: 1000 req/hr
- Sandbox URL: `https://partner.test-stable.shopeemobile.com`

## Dependencies (Blocking)

1. Shopee Sandbox account — user needs to register Open Platform + create app → partner_id + partner_key
2. EDI CSV format — user will provide the expected format for RPA downstream

## Pitfalls to Remember

- Architecture diagrams MUST show all 4 platforms (Shopee ✅, others ⏳ greyed/dashed) even though Phase 1 only implements Shopee
- User prefers "ECommerceIntegrationHub" full name — no abbreviation "ECIH"
- Diagrams use solid lines for Phase 1 (active), dashed for Phase 2+ (planned)
- Dark theme: background #0d0d1a, cards #16213e, brand #6D214F
