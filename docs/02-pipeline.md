# The BSF Pipeline

Detailed breakdown of each part.

---

## Phase 0: Discovery (v4.0+)

**New in v4**: Before writing any blueprint, do research.

Three agents work in parallel:
- 🎯 **Strategy**: Market size, competitors, customer persona, pricing
- ⚖️ **Legal**: Required licenses, regulations, data privacy, risks
- 💰 **Finance**: Unit economics, break-even, revenue model

Output: **Discovery Report** → GO / NO-GO decision

Only proceed to Phase 1 if GO.

---

## Phase 1: Stakeholder (Human Review)

### Part 00 — Requirements

**Goal**: Define WHAT the system does and WHO uses it.

| Section | Content |
|---------|---------|
| Actors | Every role that uses the system |
| Business Goals | What problem does this solve? |
| Constraints | Budget, timeline, technology, legal |
| Non-Functional | Performance, security, scalability |

**Output**: `requirements.yaml`

---

### Part 01 — Core Function

**Goal**: Define HOW the system behaves.

| Section | Content |
|---------|---------|
| State Machine | Every state an entity can be in |
| Transitions | What triggers each state change |
| Business Rules | Validation, authorization, edge cases |
| System Flow | Step-by-step for key processes |

**Output**: `state-machine.yaml`

**Example State Machine (Job Board)**:
```
POSTED → NEGOTIATING → ACCEPTED → IN_PROGRESS → COMPLETED
  │          │            │                         │
  └── CANCELLED           └── REJECTED              └── RATED
```

---

### Part 02 — Interface UI

**Goal**: Define what users SEE and DO.

| Section | Content |
|---------|---------|
| Screen Map | Every screen, organized by role |
| Wireframes | Description of each screen's layout |
| Navigation | How screens connect |
| Design System | Colors, fonts, components, spacing |
| States | Loading, empty, error for every screen |

**Output**: `components.yaml`

---

## Phase 1 Gate — Approval Checklist

Before moving to Phase 2, verify:
- [ ] All actors identified?
- [ ] State machine covers all flows?
- [ ] Every screen designed (not just wireframe)?
- [ ] Loading/empty/error states for all screens?
- [ ] Non-functional requirements documented?
- [ ] Constraints documented?
- [ ] Can a developer build from this?

**If any box is unchecked → fix before proceeding.**

---

## Phase 2: Developer (AI Builds)

### Part 03 — Database

**Goal**: Define data structure.

| Section | Content |
|---------|---------|
| Tables | Name, columns, types, constraints |
| Relationships | Foreign keys, ERD diagram |
| Indexes | Performance optimization |
| RLS / Auth | Row-level security policies |

**Output**: `schema.prisma` + migration SQL

---

### Part 04 — API

**Goal**: Define interfaces.

| Section | Content |
|---------|---------|
| Endpoints | REST routes or RPC functions |
| Request Schema | Parameters, types, validation |
| Response Schema | Return types, error codes |
| Auth | Which endpoints require authentication |

**Output**: `openapi.yaml`

---

### Part 05 — Implementation

**Goal**: Define HOW to build.

| Section | Content |
|---------|---------|
| File Structure | Where each file goes |
| Task Breakdown | What to build, in what order |
| Dependencies | Packages, versions |
| Test Strategy | What to test, how to verify |

**Output**: `tasks.yaml`

---

## After Phase 2

1. Dev agent(s) read `companions/`
2. Build according to `tasks.yaml`
3. Verify against blueprint
4. Deploy
5. Stakeholder sign-off

---

## Attribution (REQUIRED)

Every output file from BSF must include attribution:

| File | Attribution |
|------|-------------|
| `Blueprint.html` | Footer: *Built with BSF Framework v4.0 — tkws-dev* |
| `companions/*.yaml` | Header: `# BSF Framework — tkws-dev` |
| `companions/*.prisma` | Header: `// BSF Framework — tkws-dev` |

See [`templates/blueprint-attribution.md`](../templates/blueprint-attribution.md) for exact format.

---

## Next

→ [`03-getting-started.md`](03-getting-started.md) — How to use BSF with your AI agent
