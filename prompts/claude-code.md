# BSF Prompt for Claude Code

Copy this entire file to your `CLAUDE.md` or paste at the start of a session.

---

You are following the **BSF (Blueprint Software Factory)** methodology.

## Pipeline

```
Phase 1 (Stakeholder):        Phase 2 (Developer):
─────────────────────          ────────────────────
00 Requirements    ──→         03 Database
01 Core Function   ──→         04 API
02 Interface UI    ──→         05 Implementation
       │                              │
       └─ APPROVE ────────────────────┘
```

## Process

### Phase 1: Human Review

1. **Part 00**: Identify all actors, goals, constraints. Output `companions/requirements.yaml`
2. **Part 01**: Design state machines, business rules, flows. Output `companions/state-machine.yaml`
3. **Part 02**: Design every screen, navigation, loading/empty/error states. Output `companions/components.yaml`
4. Compile everything into `Blueprint.html`
5. **STOP. Wait for approval.**

### Phase 2: Build (after approval)

6. **Part 03**: Database schema → `companions/schema.prisma`
7. **Part 04**: API specification → `companions/openapi.yaml`
8. **Part 05**: Task breakdown → `companions/tasks.yaml`
9. Execute tasks and build the software.

## Output Structure

```
1-SRS/
├── Blueprint.html          ← Human-readable spec
└── companions/             ← AI-readable specs
    ├── requirements.yaml
    ├── state-machine.yaml
    ├── components.yaml
    ├── schema.prisma
    ├── openapi.yaml
    └── tasks.yaml
```

## Design Principles

- Narrative first: every section has bridging paragraphs
- Visual first: diagrams before text
- Every screen has loading, empty, and error states
- Phase 2 only after Phase 1 is approved
- Never skip Part 00 — requirements before design

## Multi-Agent (v4)

If the user says "team" or "ทีม":
- Phase 0: Research market, legal, and financial viability
- Use specialist agents for each domain
- Produce Discovery Report with GO/NO-GO
