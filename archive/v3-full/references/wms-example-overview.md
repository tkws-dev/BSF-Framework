# MIL Smart WMS — BSF Upgrade Reference Example

> **Project:** Warehouse Management System (Inbound)
> **BSF State Before:** 6.3/10 — Strong 00-02, Missing 03-05 + ADR
> **BSF State After:** 8.7/10 — All gaps filled + Swagger + Project Setup
> **Upgrade Date:** 2026-05-27
> **SA:** tkws

---

## Original Project Artifacts (v1.0)

| Artifact | Content | BSF Step |
|----------|---------|----------|
| `Master System Blueprint v2.html` | SRS HTML with Mermaid diagrams (1005 lines) | 00, 01, 02 |
| `diagram/` | DFD Lv0, Lv1, Use Case, Sequence, State Machine (JPG) | 00, 01 |
| `interface/SCR-00 UI Tree Design.txt` | Screen tree + CRUD labels per component | 02 |
| `interface/SCR-01 to SCR-06.html` | Full screen specs with sidebar, dark mode, components | 02 |
| `excel/` | Sample EDI-INV.xlsx and EDI-PL.xlsx | 00 (evidence) |

## What Was Strong Already

- **Screen Specs (SCR-00 → SCR-06):** Professional HTML with consistent shell, CRUD labeling, dark/light mode, mock data — dev-ready UI contract
- **State Machine:** 7 states (DRAFT → PRE_ALERT → ARRIVED → UNLOADING → DISCREPANCY → VERIFIED → ERP_SYNCED) with transition logic
- **Business Rules:** Rule 1 (data integrity gate), Rule 2 (discrepancy blocker with reason code)
- **DFD Lv1:** 6 processes mapped to 3 data stores (D1/D2/D3)

## Gaps Found & Filled (BSF v2.0)

| Gap | Fix | File |
|-----|-----|------|
| No tech stack decision | Inferred from HTML specs (React + Tailwind + Node + PostgreSQL) | `BSF-00-A-Technology-Radar.md` |
| Only 2 NFRs | Expanded to 40 NFRs (Perf, Scale, Avail, Security, PDPA, Maintain, Locale) | `BSF-00-B-NFR-Checklist.md` |
| No ERD or schema | 13 entities derived from DFD data stores + screen fields | `BSF-03-Database-Design.md` |
| No API endpoints | 25+ endpoints derived from CRUD labels on each screen | `BSF-04-API-Specification.md` |
| No implementation plan | 3-phase roadmap, cost estimate, testing pyramid, CI/CD, rollback | `BSF-05-Implementation-Plan.md` |
| No decision capture | 8 ADRs covering frontend, backend, DB, auth, infra, state machine | `BSF-ADR-Log.md` |
| No Swagger spec | Full OpenAPI 3.0 YAML (1177 lines) | `swagger.yaml` |
| No dev setup guide | Prisma schema, seed data, docker-compose, folder tree | `project-setup.md` |

## Key Tech Decisions (ADRs)

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | React + TS + Vite | Component complexity (Dropzone, Drawer, Tabs) |
| ADR-003 | PostgreSQL > SQL Server | JSONB for dynamic EDI fields, Thai FTS |
| ADR-004 | Container_No as PK | Physical-first tracking (not PO/finance) |
| ADR-005 | 3 Data Stores | Separate lifecycle + security per domain |
| ADR-007 | JWT + RBAC | Stateless, role in token for UI gating |

## Upgrade Result

The final deliverable was **merged into the existing Master System Blueprint v2.html**, turning it from a 1,005-line document (Parts 1-5: Story → 00 → 01 → 02) into a **1,464-line document** (Parts 1-11: Story → 00 → 01 → 02 → **00-A → 00-B → 03 → 04 → 05 → ADR**).

Companion files placed alongside:
- `swagger.yaml` — Full OpenAPI 3.0 spec (1,177 lines)
- `project-setup.md` — Prisma schema, seed data, docker-compose, folder tree (836 lines)

### Lesson Learned: Always Merge, Never Split

The first attempt created a separate `bsf-upgrade/` subdirectory with 9 standalone markdown files. The SA (tkws) rejected this approach — feedback was that it "cut out the storytelling" and felt "too technical" without the narrative context from the original document.

**Correct approach:** Add new parts at the END of the existing SRS with **Narrative Bridge** sections between old and new content. This preserves the story arc:
```
Part 1: Origin & Strategy (Story)
  ↓
Parts 2-5: BSF 00-02 (Requirements → UI)
  ↓  ← Narrative Bridge: "เมื่อออกแบบหน้าจอครบแล้ว..."
Parts 6-11: BSF 00-A → 05 + ADR (Tech)
```
