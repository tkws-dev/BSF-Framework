# BSF to Kanban — Decomposition Pattern

> How to bridge BSF output (SRS, Screen Specs, API Spec) into executable Kanban cards
> สำหรับเมื่อ SA เสร็จ BSF แล้วต้องการส่งต่อให้ Hermes Kanban workers implement

## The Handoff: Design → Execution

```
BSF Complete (tkws) ──→ Kanban Board ──→ Workers Code
                              │
                    Orchestrator reviews
                    + Confirms per card
```

## Decomposition Rules

### Rule 1: One Card Per FR (Functional Requirement)

Every FR in the Traceability Matrix should map to at least one Kanban card.
FR-05 (Tally + Discrepancy) may split into 2 cards: one for frontend, one for backend logic.

| FR-ID | Kanban Cards | Dependencies |
|-------|-------------|-------------|
| FR-01 | SCR-01 Frontend + SCR-01 Backend + SCR-01 Upload Logic | — (independent) |
| FR-02 | SCR-01 Merge Engine (Backend) | FR-01 Backend |
| FR-03 | SCR-02 Dashboard (Frontend) + SCR-02 API (Backend) | FR-02 |
| FR-05 | SCR-04 Tally Frontend + SCR-04 Discrepancy Blocker (Backend) + State Machine Logic | FR-02 |
| FR-07 | Epicor ERP Sync Service | FR-05 Backend |

### Rule 2: Split Screen from Logic

Every SCR screen creates 2-3 cards:

| Card Type | Example | Assignee |
|-----------|---------|----------|
| UI Component | "SCR-01: Data Gateway Dropzone" | Frontend Worker |
| Backend API | "SCR-01: Upload + Process Endpoints" | Backend Worker |
| Business Logic | "SCR-04: Discrepancy Blocker Rule Engine" | Backend Worker (dedicated) |

### Rule 3: Frontend and Backend Can Run in Parallel

Independent FRs (e.g., FR-01 frontend ≠ FR-03 frontend) run concurrently.
Dependent FRs use `parents=[...]` to gate promotion.

### Rule 4: Review Cards After Each Phase

After Phase 1 (Core: SCR-01 + SCR-02), add a Review card:
```
T-REVIEW-1: "Review Phase 1 — SCR-01 + SCR-02 against FR-01, FR-02, FR-03"
assignee: orchestrator (tkws)
parents: [all Phase 1 cards]
```

## Card Template for BSF Implementation

For each card, include these fields from the BSF output:

```python
kanban_create(
    title="SCR-01: Data Gateway Frontend",
    assignee="frontend-worker",
    body=f"""
    Spec: interface/SCR-01 Data Gateway.html
    FR: FR-01
    API Contract: POST /files/upload, GET /files, POST /files/{{id}}/process
    States: DRAFT → PRE_ALERT
    Validation: Field-level (file format, size) + Pre-validation blocker
    CRUD: [C] Upload Dropzone, [R] History Log, [D] Delete Button
    Acceptance: Drag & Drop Excel/PDF → File appears in Pending Queue → Process → Container on Dashboard
    """,
)
```

## Kanban Card Map for a Typical BSF Project

```
PHASE 1: Core Foundation (Month 1)
├── T1: SCR-01 Frontend (Upload Dropzone + History) [FR-01]
├── T2: SCR-01 Backend (Upload + Process API) [FR-01, FR-02]
├── T3: SCR-02 Frontend (Dashboard + Timeline) [FR-03]
├── T4: SCR-02 Backend (Dashboard API + Cache) [FR-03]
├── T5: Auth + RBAC Middleware [NFR-18, NFR-19]
├── T6: DB Schema + Migration [ALL FRs]
├── T7: CI/CD Pipeline + Docker Compose
└── T8: REVIEW: Phase 1 Integration [parents: T1-T7]

PHASE 2: Unload & Pallet (Month 2)
├── T9:  SCR-03 Frontend (Pallet Plan + QR) [FR-04]
├── T10: SCR-03 Backend (Calculate + Save) [FR-04]
├── T11: SCR-04 Frontend (Tablet Tally) [FR-05]
├── T12: SCR-04 Backend (Tally + Discrepancy Blocker) [FR-05]
├── T13: State Machine Engine (Transition Validation) [ALL FRs]
├── T14: E-Sign Integration [FR-05, FR-06]
└── T15: REVIEW: Phase 2 Integration [parents: T9-T14]

PHASE 3: Local & Verify (Month 2.5-3)
├── T16: SCR-05 Frontend (OCR + E-Sign Pad) [FR-06]
├── T17: SCR-05 Backend (OCR Pipeline) [FR-06]
├── T18: SCR-06 Frontend (Verify + Reject) [FR-07]
├── T19: SCR-06 Backend (Approve + Reject + Epicor Sync) [FR-07]
├── T20: Epicor Integration (POReceiving API) [FR-07]
├── T21: UAT Fixes + Performance Tuning
└── T22: FINAL REVIEW + Go-Live [parents: T16-T21]
```

## Pitfalls

- **Don't bundle FR-01 and FR-02 into one card** — the merge engine (FR-02) is pure backend logic that a different worker can build
- **Don't forget state machine as a separate concern** — it cross-cuts all FRs but should be built once, not re-implemented per screen
- **Don't create Review cards too early** — let Phase 1 cards finish first, then review the whole phase together
- **Don't assign BSF architect (tkws) as a worker** — orchestrator reviews, does not implement
