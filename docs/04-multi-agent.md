# Multi-Agent Mode (v4.0)

BSF v4 introduces specialist teams — multiple AI agents working on different aspects simultaneously.

---

## Why Multi-Agent?

A single AI is a generalist. It can do everything, but nothing deeply.

```
Single Agent:        "Build an app"
                     → Designs UI, writes backend, thinks about market
                     → Jack of all trades, master of none

Multi-Agent:         🎯 Strategy: "Market is real, target segment X"
                     ⚖️ Legal:    "Need license Y, avoid liability Z"
                     💰 Finance:  "Break-even at 400 units/month"
                     💻 Product:  "Optimal stack: React + Supabase"
                     → Each is a specialist
```

---

## The 6 Departments

| # | Department | Focus | Asks |
|---|-----------|-------|------|
| 🎯 | **Strategy** | Market, competition | "Is there a market? Who will pay?" |
| ⚖️ | **Legal** | Regulations, compliance | "Is this legal? What licenses needed?" |
| 💰 | **Finance** | Viability, pricing | "Will this make money? When?" |
| 💻 | **Product** | Technical design | "How to build this? What stack?" |
| 🏗️ | **Operations** | Workflows, SOPs | "How will people use this daily?" |
| 📢 | **Marketing** | Growth, channels | "How will people find this?" |

---

## When to Use Each Department

### Always (Discovery Phase):
- 🎯 **Strategy** — Every project
- ⚖️ **Legal** — Anything with user data, payments, or regulated industry
- 💰 **Finance** — Any commercial project

### During Blueprint (Phase 1):
- 💻 **Product** — Always
- 🏗️ **Operations** — If real people will operate the system
- 📢 **Marketing** — If the project needs users/customers

### During Build (Phase 2):
- 💻 **Product** — Spawns dev agents

---

## How to Activate

With BSF, activation varies by agent:

### Hermes (native)
```
"ทีม discovery"     → Spawns Strategy + Legal + Finance
"ทีม product dev"   → Spawns Product → 3 Dev Agents
```

### Other Agents (Claude Code, Codex, etc.)
Use sequential prompting:
```
Prompt 1: "Act as Strategy agent. Research market for [project]."
Prompt 2: "Act as Legal agent. Analyze regulations for [project]."
Prompt 3: "Act as Finance agent. Model unit economics for [project]."
Then: "Now synthesize all 3 analyses into a Discovery Report."
```

Or spawn parallel sessions (if your agent supports it).

---

## Discovery Report

After Phase 0 research, you get:

```
📊 DISCOVERY REPORT: Home Inspection Platform
═══════════════════════════════════════════

1. MARKET (Strategy):    8,000M THB market, 200K+ homes/year
2. LEGAL:                Inspector needs engineering license (กว.)
3. FINANCE:              Break-even at 400 inspections/year

RECOMMENDATION: GO ✅
```

---

## Playbooks

Each department has a playbook — a template for its analysis:

| Playbook | For | File |
|----------|-----|------|
| Strategy | Market, competitors, persona | [`playbooks/strategy.md`](../playbooks/strategy.md) |
| Legal | Licenses, PDPA, contracts, risk | [`playbooks/legal.md`](../playbooks/legal.md) |
| Finance | Unit economics, break-even | [`playbooks/finance.md`](../playbooks/finance.md) |
| Product | Stack, conventions, patterns | [`playbooks/product.md`](../playbooks/product.md) |
| Operations | SOP, QA, SLA, onboarding | [`playbooks/operations.md`](../playbooks/operations.md) |

---

## Parallel vs Sequential

| Approach | When | Speed |
|----------|------|-------|
| **Parallel** (3 agents) | Discovery, Part 00 | 3x faster |
| **Sequential** (1 at a time) | Parts 01-04 | Standard |
| **Fan-out** (3 dev agents) | Part 05 (build) | 3x faster |

---

## Next

→ [`05-examples.md`](05-examples.md) — Real project examples
