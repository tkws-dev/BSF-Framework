# Getting Started

How to use BSF with your AI agent.

---

## 1. Pick Your Agent

BSF works with any AI coding agent. Choose yours:

| Agent | Setup | Time |
|-------|-------|------|
| **Claude Code** | Copy prompt to `CLAUDE.md` | 1 min |
| **OpenAI Codex** | Use as system prompt | 1 min |
| **Cursor** | Copy to `.cursorrules` | 1 min |
| **GitHub Copilot** | Copy to `.github/copilot-instructions.md` | 1 min |
| **Hermes Agent** | Install skills | 5 min |

---

## 2. Get the Prompts

See [`prompts/`](../prompts/) for copy-paste ready prompts for each agent.

Example for Claude Code:

```bash
cp prompts/claude-code.md CLAUDE.md
```

---

## 3. Start a Project

### First Session: Discovery (v4 only)

```
Tell your agent:
"You are following BSF methodology. 
Start Phase 0 Discovery for [project name].
Research market, legal, and financial viability.
Give me a GO/NO-GO decision."
```

### Second Session: Phase 1

```
"Discovery was GO. 
Start Phase 1: generate Part 00 (Requirements) and Part 01 (Core Function).
Include all actors, state machine, and business rules."
```

### Third Session: Review + Continue

```
"Part 00-01 look good. 
Generate Part 02 (Interface UI) with all screens and states.
Then I'll review before Phase 2."
```

### Fourth Session: Phase 2 (after approval)

```
"Phase 1 approved. 
Execute Phase 2: generate database schema, API spec, and implementation plan.
Then build it."
```

---

## 4. Expected Timeline

| Phase | Sessions | Duration |
|-------|----------|----------|
| Discovery (v4) | 1 | 15-30 min |
| Phase 1 (00-02) | 2-3 | 45-90 min |
| Review | 1 | 15-30 min |
| Phase 2 (03-05) | 1-2 | 30-60 min |
| Build | 2-4 | 2-4 hours |

---

## 5. Project Structure

After completing BSF, your project looks like:

```
my-project/
├── 1-SRS/
│   ├── Blueprint.html          ← Human-readable spec
│   └── companions/             ← AI-readable specs
│       ├── requirements.yaml
│       ├── state-machine.yaml
│       ├── components.yaml
│       ├── schema.prisma
│       ├── openapi.yaml
│       └── tasks.yaml
├── src/                        ← Your actual code
├── README.md
└── ...
```

---

## Next

→ [`04-multi-agent.md`](04-multi-agent.md) — Using specialist agents (v4)
→ [`05-examples.md`](05-examples.md) — Real project examples
