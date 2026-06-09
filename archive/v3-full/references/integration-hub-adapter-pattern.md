# Integration Hub — Adapter Pattern (Dual-Type)

Learned during ECIH (E-Commerce Integration Hub) architecture session with tkws, 2026-06-05.

## When to Use This Pattern

Any system that pulls data from **multiple external sources** with **different auth mechanisms and data formats** — especially when sources fall into distinct categories that require fundamentally different integration strategies.

## The Architecture

```
                    ECIH Core Pipeline (ห้ามแก้)
                         ▲                    ▲
                         │                    │
              ┌──────────┴───────┐  ┌────────┴──────────────┐
              │  API Adapters    │  │  Portal Adapters      │
              │  (E-commerce)    │  │  (In-House/Offline)   │
              ├──────────────────┤  ├───────────────────────┤
              │ Auth: API Key    │  │ Auth: Username/Pass   │
              │ Protocol: REST   │  │ Protocol: Scrape/File │
              │ Data: JSON       │  │ Data: PDF/HTML/Excel  │
              │ Session: Stateless│  │ Session: Stateful     │
              │ Password rot: ❌  │  │ Password rot: ⚠️ 3mo │
              └──────────────────┘  └───────────────────────┘
                         │                    │
                         ▼                    ▼
              ┌─────────────────────────────────────┐
              │     Unified Order Schema            │
              │     (ทุก source → format เดียว)     │
              └─────────────────────────────────────┘
                              │
                              ▼
              ┌─────────────────────────────────────┐
              │     EDI Generator → Output          │
              └─────────────────────────────────────┘
```

## Why Two Types (Not One Generic Adapter)

| มิติ | API Adapter | Portal Adapter |
|------|-------------|----------------|
| Source | Seller Center API | In-House Supplier Portal |
| Auth | API Key / OAuth (ถาวร) | Username + Password (rotate ทุก 3 เดือน) |
| Method | `fetchOrders()` via REST | `scrapeOrders()` via browser/session |
| Output | JSON response | Parsed HTML/PDF/Excel |
| Session | Stateless token refresh | Stateful login session |
| Password rot. | ❌ ไม่เกี่ยว | ⚠️ 3 เดือนเปลี่ยนที |

**กฎ:** ห้ามให้ Portal adapter extend API adapter — คนละ contract, คนละ lifecycle, คนละ error handling

## Config-Driven Extensibility

เพิ่ม platform = เพิ่ม config 1 entry + adapter 1 ไฟล์ → deploy → ไม่ต้องแก้ core

```yaml
# config.yaml
adapters:
  api:
    - name: shopee
      type: api
      adapter: ShopeeAdapter
      api_key_env: SHOPEE_API_KEY
      partner_id_env: SHOPEE_PARTNER_ID
      enabled: true
    
    - name: lazada
      type: api
      adapter: LazadaAdapter
      # ... (เพิ่มเมื่อพร้อม)
      enabled: false
  
  portal:
    - name: homepro
      type: portal
      adapter: HomeproAdapter
      username_env: HOMEPRO_USERNAME
      password_env: HOMEPRO_PASSWORD
      enabled: false
```

**ถอด platform** = `enabled: false` → ไม่กระทบ adapter อื่น

## Pilot-First Strategy

1. เลือก 1 platform ที่ impact สูงสุด (เช่น Shopee — UI เปลี่ยนบ่อยสุด, RPA พังบ่อย)
2. Implement adapter ตัวแรก → พิสูจน์ interface + core pipeline
3. เพิ่ม adapter ที่เหลือตาม config — core ไม่เปลี่ยน

**ข้อดี:**
- MVP เร็ว — 2-3 วันด้วย AI agents
- Core pipeline ถูกทดสอบด้วยข้อมูลจริงก่อน scale
- เพิ่ม adapter ทีหลัง = copy template + implement adapter interface

## Related

- `epicor-dmt-integration.md` — DMT-first transport pattern (specific to Epicor)
- `jung-sa-bsf` — Part 00 RPA/Integration Chain Analysis
- ECIH: `/mnt/c/Users/tikawutw/hermes-jung-sa/ecih-E-Commerce Integration Hub/`
