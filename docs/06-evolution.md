# Evolution — v1 → v4

How BSF grew from a simple spec generator to a full methodology.

---

## Timeline

```
2026-05  v1.0  "BSF Beginnings"
           │    5-part pipeline, single HTML blueprint
           │    Insight: "AI builds better with a spec"
           │
         v2.0  "Dual Output & Modes"
           │    Blueprint.html + companions/
           │    Insight: "Humans and AI need different docs"
           │
         v3.0  "Production Maturity"
           │    2 Modes × 4 Flavors, pitfalls, project skills
           │    Insight: "Every project needs its own approach"
           │
2026-06  v4.0  "Multi-Agent Organization"
                6 departments, Phase 0 Discovery
                Insight: "Research what to build before how to build"
```

---

## What Changed Each Version

### v1 → v2: Dual Output

**Problem**: AI agents can't read narrative HTML well.

**Solution**: Split output into two:
- `Blueprint.html` — humans read this (narrative, diagrams)
- `companions/` — AI reads this (structured YAML, Prisma, OpenAPI)

### v2 → v3: Modes System

**Problem**: One workflow doesn't fit all situations.

**Solution**: 
- Architect mode (build new) vs Consultant mode (analyze)
- Flavors: New Design, Retrospective, Upgrade, Evaluation
- Each flavor has specific steps

### v3 → v4: Multi-Agent

**Problem**: Building the wrong thing is worse than building slowly.

**Solution**:
- Phase 0 Discovery before any blueprint
- 6 specialist departments instead of 1 generalist
- Discovery Report with GO/NO-GO decision
- CEO Gate approval checklist

---

## What Stayed the Same

Across all 4 versions:

| Element | v1 | v2 | v3 | v4 |
|---------|----|----|----|-----|
| 5 Parts (00-05) | ✅ | ✅ | ✅ | ✅ |
| Phase 1 → Approve → Phase 2 | ✅ | ✅ | ✅ | ✅ |
| Human-readable output | ✅ | ✅ | ✅ | ✅ |
| Stakeholder review gate | ✅ | ✅ | ✅ | ✅ |

---

## Lessons Learned

1. **AI needs structure** — Not "build this", but "here's the spec"
2. **Dual formats** — One for humans, one for machines
3. **Flexibility matters** — New projects vs upgrades need different flows
4. **Research first** — Market + legal + finance before technical design
5. **Specialization wins** — 6 specialists > 1 generalist

---

## Version Comparison Matrix

| Capability | v1 | v2 | v3 | v4 |
|-----------|----|----|----|-----|
| Blueprint output | ✅ | ✅ | ✅ | ✅ |
| Dual output (human+AI) | | ✅ | ✅ | ✅ |
| Multiple modes | | ✅ | ✅ | ✅ |
| Pitfalls collection | | | ✅ | ✅ |
| Project-specific skills | | | ✅ | ✅ |
| Market research | | | | ✅ |
| Legal analysis | | | | ✅ |
| Financial modeling | | | | ✅ |
| Operations design | | | | ✅ |
| Parallel agents | | | | ✅ |
| Discovery Report | | | | ✅ |

---

## The Future (v5?)

Potential directions:
- **Live Blueprint** — blueprint auto-updates as code changes
- **Multi-Project** — shared resources across projects
- **Auto-Discovery** — agent researches market/legal/finance from live data
- **Metrics Loop** — deployed project metrics feed back into Discovery
