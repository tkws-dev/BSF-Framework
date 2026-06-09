# Static Portfolio BSF Adaptation

When the project is a static frontend (no database, no API, no backend),
adapt the BSF steps as follows:

## Step Mapping

| Standard BSF | Static Portfolio Adaptation |
|-------------|---------------------------|
| 00. Requirement | Same — persona, scope, KPIs, risk register |
| 00-A. Tech Stack | Same — but limited to frontend: React, Vite, Tailwind, hosting |
| 00-B. NFR | Same — performance, accessibility, bundle size (not TPS/DB metrics) |
| 01. Core Architecture | Component tree + data flow (props/state, not DFD with data stores) |
| 02. Interface UI | Same — card inventory, design system, settings panel |
| **03. Database** | **→ State & Persistence** — localStorage schema, DEFAULTS fallback, useState inventory |
| **04. API** | **→ Skip or → Component Data Flow** — props chain, event handlers, no HTTP |
| 05. Implementation | Same — phases, cost (mostly $0 for static), deploy strategy |

## Key Differences

- No `Data Store` in DFD — replace with `localStorage` / `useState`
- No ER Diagram — replace with settings schema (JSON shape)
- No Sequence Diagram for API — replace with persistence flow (user → state → localStorage)
- No Swagger/OpenAPI — not applicable
- No backend cost — infrastructure = $0 (GitHub Pages / Vercel free tier)
- No auth, no RBAC, no role matrix

## Example: portfolio-AsciiProfile

See `/portfolio-AsciiProfile/1-SRS/Master Blueprint.html` for a complete example.
6/11 parts delivered (00, 00-A, 00-B, 01, 02, 03-adapted, 05, Traceability).
Skipped: 04 (no API).

## Retrospective BSF Pattern

When user already built the project before writing BSF (dev → spec, not spec → dev):

1. Read ALL source files first — understand what actually exists
2. Do NOT trust session history or compaction summaries about file existence — verify with `search_files` or `read_file`
3. Map existing code to BSF steps — what's implemented vs planned
4. Mark each FR as "Done" (already in code) vs "Planned" (design approved, not coded)
5. Use Phase 1 = what's built, Phase 2+ = what's planned
6. The blueprint becomes documentation + roadmap, not a design-first spec

## Portfolio → Portal Evolution Pattern

When a portfolio site has potential to evolve into a project operations portal,
encode the vision in section 00 as a dedicated subsection with:

1. **Side-by-side comparison cards** — "Today: Portfolio" vs "Future: Portal"
2. **Future-state Mermaid diagram** — Portal → Discovery Engine → Projects + Live Status + Launch + Feed
3. **Feature roadmap table** — columns: Feature | Today | Portal | Tech Approach
4. **Sidebar link** — `🔮 Vision` group with amber dot, anchor to `#sec-00v`

Portal features to consider:
- Dynamic project registry (auto-scan hermes-jung-sa/)
- Live status indicators (port check, DB ping, build status)
- One-click dev server control (start/stop/restart with output)
- Health monitoring dashboard
- Agent activity feed (git log + Hermes session DB)
- Lightweight local API (Express/Fastify, localhost only)

Update Phase 3 in section 05 from generic "Deploy & Polish" to "Project Operations Portal"
with specific portal features listed. This keeps the blueprint grounded in real code while
showing the architectural direction.

## Phase Analysis — Trust Code, Not Session History

When planning the next phase of an existing project:

1. **Read actual source files** — not session history, not compaction summaries
2. **Identify structural problems first** — oversized components, hardcoded data, coupling
3. **Recommend pragmatic next steps** — prioritize component extraction and portal-ready architecture over visual flash
4. **Skip what's not needed yet** — a full 3D perspective engine may be premature when the component isn't even split into files
5. **Say what NOT to do** — explicitly list tasks from old plans that should be deferred or dropped

This approach prevents chasing a design from a past session that may no longer fit the current state.

## Verification Pitfall

Session compaction summaries can claim files were "created" or "written" when they were never persisted to disk (e.g., session ended before commit, or files existed only in the agent's working memory). Always verify actual file existence with `search_files(target='files')` before claiming something exists.
