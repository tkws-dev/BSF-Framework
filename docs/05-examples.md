# Examples

Real-world examples of BSF in action.

---

## Example 1: Home Inspection Platform

**Problem**: No standardized platform for home inspection in Thailand.
**BSF Version**: v4.0 (Multi-Agent)

### Phase 0 — Discovery
```
Strategy:  8,000M THB market, 200K+ home transfers/year
           No dedicated inspection platform exists
Legal:     Inspector requires กว. (engineering license)
           PDPA applies to home photos
Finance:   Break-even at 400 inspections/year
           Revenue: 20% commission on 3K-8K tickets

Decision: GO ✅
```

### Phase 1 — Blueprint Highlights
```
Actors:    Customer, Inspector, Admin
States:    Booking → Paid → Assigned → Inspecting → Report → Done
Screens:   12 screens across 3 roles
           Mobile-first, dark theme
```

### Phase 2 — Build
```
Stack:     React + Vite + TypeScript + Supabase
Tables:    users, inspectors, inspections, reports, checklists
Dev:       3 agents — frontend, backend, integration
```

---

## Example 2: Warehouse Management System (WMS)

**Problem**: Replace paper-based warehouse operations.
**BSF Version**: v3.0 (Production)

### Key Decisions
- Real-time dashboard with WebSocket
- Barcode scanning via mobile camera
- Role-based access: Picker, Packer, Supervisor, Admin
- Integration with existing ERP via REST API

### Blueprint Stats
- 8 actors, 15 states, 22 screens
- 18 database tables
- 34 API endpoints

---

## Example 3: E-Commerce Integration Hub

**Problem**: Connect multiple e-commerce platforms (Shopee, Lazada) to ERP.
**BSF Version**: v3.0 (Retrospective — code existed, created blueprint after)

### Approach
- Adapter pattern for each platform
- Event-driven sync (webhook + polling)
- Transformation layer for data mapping
- Error queue with retry logic

---

## Example 4: Service Marketplace (SarapadChang)

**Problem**: Match customers with craftsmen for home services.
**BSF Version**: v3.0 (Iterative — multiple BSF cycles)

### Evolution
- v1: Simple job board (Post → Accept → Complete)
- v2: Map-based discovery (Leaflet, radius filter)
- v3: Negotiation system (chat, offers, counter-offers)
- Each iteration used BSF to extend the blueprint

---

## Pattern: How to Read These Examples

Every example follows the same structure:

1. **Problem** — What pain does it solve?
2. **Phase 0** (v4) — Is it worth building?
3. **Phase 1** — What should we build?
4. **Phase 2** — How to build it?
5. **Result** — What was delivered?

---

## Next

→ [`06-evolution.md`](06-evolution.md) — How BSF evolved v1 → v4
