# What is BSF?

BSF (Blueprint Software Factory) is a **methodology** for designing software with AI agents.

---

## The Problem

When you tell an AI "build me an app":
1. It guesses what you want
2. It starts coding immediately
3. You get something that might not match your vision
4. No documentation exists
5. If you want changes, good luck

---

## The Solution

BSF inserts a **blueprint phase** between "idea" and "code":

```
Traditional:    Idea → Code → Surprise
BSF:            Idea → Blueprint → Review → Code → Deploy
```

The blueprint is:
- **Human-readable** — you can review and approve it
- **AI-executable** — the agent can build from it precisely
- **Documentation** — it IS the documentation

---

## Core Concepts

### 1. Two Phases

| Phase | Who | What |
|-------|-----|------|
| **Phase 1** | You (Stakeholder) | Review requirements, design, UI |
| **Phase 2** | AI (Developer) | Build database, API, implementation |

You MUST approve Phase 1 before Phase 2 starts.

### 2. Five Parts

Each phase has specific deliverables:

| Part | Phase | Deliverable |
|------|-------|-------------|
| 00 — Requirements | 1 | Actors, goals, constraints |
| 01 — Core Function | 1 | State machine, business rules |
| 02 — Interface UI | 1 | Screens, navigation, design system |
| 03 — Database | 2 | Tables, relationships, migrations |
| 04 — API | 2 | Endpoints, schemas, auth |
| 05 — Implementation | 2 | Task breakdown, file structure |

### 3. Dual Output

```
Your-Project/
└── 1-SRS/
    ├── Blueprint.html       ← You read this
    └── companions/          ← AI reads these
        ├── requirements.yaml
        ├── state-machine.yaml
        ├── components.yaml
        ├── schema.prisma
        ├── openapi.yaml
        └── tasks.yaml
```

### 4. Multi-Agent (v4.0+)

Instead of one AI doing everything, BSF v4 uses **specialist agents**:

| Department | Role |
|------------|------|
| 🎯 Strategy | Market, competitors, pricing |
| ⚖️ Legal | Regulations, compliance |
| 💰 Finance | Unit economics, viability |
| 💻 Product | Technical design & build |
| 🏗️ Operations | SOP, QA, workflows |

Each agent specializes in its domain instead of being a generalist.

---

## When to Use BSF

✅ New projects from scratch
✅ Adding features to existing projects
✅ Documenting existing code (retrospective)
✅ Evaluating project completeness

---

## When NOT to Use BSF

❌ Trivial scripts (< 50 lines)
❌ Bug fixes (just fix it)
❌ Configuration changes
❌ One-off data queries

---

## Next

→ [`02-pipeline.md`](02-pipeline.md) — Deep dive into each part
