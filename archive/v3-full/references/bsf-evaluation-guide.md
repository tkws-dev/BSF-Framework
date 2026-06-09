# BSF Evaluation Scoring Guide

Use when the user asks to evaluate an existing project. Score each BSF step 1-10 based on how much of that step is covered in their artifacts.

## Evaluation Method

1. **Map artifacts to BSF steps** — look at their file tree, SRS, diagrams, screen specs
2. **Score each step** 1-10 with rationale
3. **Calculate overall** = weighted average (00-05 each weight=1, ADR weight=1, Gate weight=0.5)
4. **Top 3 critical gaps** — biggest blockers for AI Dev implementation

## Scoring Rubric

| Score | Meaning |
|-------|---------|
| 10/10 | Complete — Dev can implement without questions |
| 8-9/10 | Minor gaps — one or two details missing |
| 5-7/10 | Has concept but lacks detail — needs expansion |
| 1-4/10 | Exists as idea/reference but no structured spec |
| 0/10 | Missing entirely |

## Step-by-Step Criteria

### 00. Requirement
- 10: Business Purpose + KPI + Stakeholder + Personas + Context Diagram + Use Case + SWOT + FR/NFR IDs
- 5: Has requirements but no diagram, no KPI, no FR-IDs
- 0: No requirements section

### 00-A. Technology Radar
- 10: Frontend/Backend/DB/Infra decisions + rationale + ADR per decision + architecture diagram
- 5: Mentions tools but no justification or ADR
- 0: No tech stack specified

### 00-B. NFR Checklist
- 10: Performance targets + Scalability + Availability (RTO/RPO) + Security + Compliance + Maintainability + Localization
- 5: Has 1-2 NFRs but missing critical targets (performance, security)
- 0: No NFR section

### 01. Core Function
- 10: DFD Level 1 + Screen List + Navigation Map + Activity Diagram + Business Rules + State Machine + Exception Handling
- 5: Has process description but no diagrams or state machine
- 0: No functional decomposition

### 02. Interface UI
- 10: Screen-by-screen spec + CRUD strategy + Component Map + Validation Rules + UI States + Role Matrix + Prototype/Wireframe
- 5: Has wireframes but no data mapping or role matrix
- 0: No UI design

### 03. Database Design
- 10: ER Diagram + Data Dictionary (per table/column/type/constraint) + Index Strategy + Audit Trail + PDPA privacy
- 5: Has concept data stores but no schema or column definitions
- 0: No database section

### 04. API Specification
- 10: All endpoints with method/path + Request/Response JSON + Sequence Diagram + Swagger + Auth Strategy + Error Mapping + State-Based Access Control
- 5: Has API ideas but no endpoint list or JSON structure
- 0: No API spec

### 05. Implementation Plan
- 10: Impact Analysis + Cost/ROI + Data Migration + CI/CD + Roadmap/Phasing + Testing Pyramid + Acceptance Criteria + Traceability Audit + Rollback Plan
- 5: Has timeline but no testing/cost/rollback
- 0: No implementation plan

### ADR
- 10: ADR for every major decision (tech stack, DB, key design) — each with Context/Options/Decision/Rationale/Consequences
- 5: Some decisions documented informally
- 0: No architecture decisions captured

## Overall Score Calculation

```\noverall = (\n  00 + 00-A + 00-B + 01 + 02 + 03 + 04 + 05 + ADR\n) / 9\n```

## Upgrade Output Structure

When the user wants to upgrade, **merge new content into the existing SRS document**, not as separate files. The existing SRS gains new parts with narrative bridges between each:

```diff
  Existing SRS (Parts 1-N)
+ ★ Narrative Bridge: "หลังจากที่ออกแบบหน้าจอครบแล้ว..."
+ ★ Part N+1: 00-A Technology Radar (merge into SRS)
+ ★ Part N+2: 00-B NFR Checklist
+ ★ Part N+3: 03 Database Design (with ERD)
+ ★ Part N+4: 04 API Specification
+ ★ Part N+5: 05 Implementation Plan
+ ★ Part N+6: ADR + Traceability Matrix
```

**Companion files** (placed alongside the SRS, not in a subdirectory):
- `swagger.yaml` — OpenAPI 3.0 from BSF-04 (import into Postman/Insomnia)
- `project-setup.md` — Prisma schema + seed data + docker-compose + folder tree

**CRITICAL: Do NOT create a `bsf-upgrade/` subdirectory** — user rejected this approach. New content goes IN the existing document with narrative continuity.

## Real-World Example: MIL Smart WMS

See `references/wms-example-overview.md` for a complete worked example. That project went from 6.3/10 → 8.7/10 with 9 upgrade files (3,755 lines, 136 KB).

### Evaluation Pattern Used

For the WMS project, the evaluation used **aspect-by-aspect scoring** per BSF step:

```
| Aspect              | Score | Evidence                      |
|--------------------|-------|-------------------------------|
| Requirement (00)   | 10/10 | FR-01 to FR-07, Scope 8 pts  |
| Core Function (01) | 9/10  | DFD Lv1, Sequence, State Mach |
| Interface UI (02)  | 10/10 | SCR-00 to SCR-06, CRUD labels |
| Database (03)      | 2/10  | Only concept data stores      |
| API (04)           | 2/10  | No endpoints                  |
| Implementation (05)| 1/10  | Nothing exists                |
| ADR                | 0/10  | No decision records           |
```

Each score had 2-3 sentences of evidence from the project's artifacts — never just a number.
