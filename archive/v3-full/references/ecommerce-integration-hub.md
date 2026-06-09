# ECommerceIntegrationHub — Project Reference

## Overview

API-first E-Commerce integration platform — replaces RPA UI scraping with direct API connections.
Phase 1: Shopee pilot (sandbox). Architecture designed for multi-platform (Lazada, TikTok Shop, Shopify) via adapter pattern.

## Path

```
/mnt/c/Users/tikawutw/hermes-jung-sa/ECommerceIntegrationHub/
├── 1-SRS/
│   ├── Master Blueprint.html              ← Phase 1 (00+01+02)
│   ├── Development Blueprint (Phase 2).html ← 03+04+05 (in progress)
│   └── companions/
│       ├── requirements.yaml
│       ├── state-machine.yaml
│       └── components.yaml
└── app/                                   ← React + Vite frontend
    ├── src/
    │   ├── App.tsx                        ← BrowserRouter + Routes
    │   ├── components/Sidebar.tsx         ← SarapadChang-style: Workflow + Backoffice sections
    │   └── pages/
    │       ├── DevLogin.tsx               ← SCR-05: localStorage bypass
    │       ├── FetchDashboard.tsx         ← SCR-03: platform selector, date toggle, progress, summary, CSV export
    │       ├── PlatformList.tsx           ← SCR-01: cards grid
    │       ├── PlatformForm.tsx           ← SCR-02: dynamic form per auth type
    │       ├── SummaryHistory.tsx         ← SCR-04: table
    │       ├── DesignSystem.tsx           ← Colors, typography, components showcase
    │       └── ApiDocs.tsx (in App.tsx)   ← API endpoint reference
    ├── index.html
    ├── vite.config.ts
    └── package.json
```

## Architecture

```
Central Dashboard → Unified Order Model → Adapter Layer → Platform APIs
                                            Shopee (HMAC+OAuth)
                                            Lazada (HMAC-SHA256)
                                            TikTok (OAuth 2.0)
                                            Shopify (API Key)
```

## Tech Stack (Frontend)

| Layer | Tech |
|-------|------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| CSS | Tailwind v4 + @tailwindcss/vite |
| Routing | react-router-dom v7 |
| Icons | Font Awesome 6 (CDN) |
| Dev Login | localStorage bypass (useState + parent callback) |

## Design System

- **Theme:** Dark (`#0d0d1a` background, `#16213e` cards)
- **Brand:** `#6D214F` / Accent: `#EE4D2D` (Shopee orange)
- **Sidebar:** SarapadChang-style — `bg-slate-900`, collapsible Backoffice section
- **Defined in:** `@theme` block in `index.css`

## Key Patterns

1. **Dev Login to Dashboard redirect:** Use `useState` initialized from `localStorage.getItem`, pass `onLogin` callback. Parent sets state on callback, triggers re-render.
2. **Sidebar collapsible sections:** `useState(boolean)` + chevron rotation via `rotate-180`.
3. **Fetch simulation:** `for` loop with `setTimeout` promise to simulate cursor pagination.

## Port

- Dev server: `http://localhost:5173`

## Dependencies (Pending)

- Shopee Sandbox credentials (partner_id, partner_key, shop_id)
- EDI CSV format
