# Retrospective BSF — Creating Blueprint for Existing Code

When a project already has source code but no BSF blueprint,
create the blueprint by reverse-engineering from the actual codebase.

## Trigger
- User says "code exists but no SRS" or "make a blueprint for this project"
- BSF evaluation finds code but empty/missing 1-SRS/

## Process

1. **Read the source code first** — package.json, Prisma schema, route files, components, config
2. **Map to BSF framework** — what's already covered vs missing:
   - package.json → 00-A Tech Stack + ADRs
   - Prisma schema → 03 Database (ER Diagram)
   - Route files → 04 API Specification
   - Components/pages → 02 Interface UI
   - State machine / business logic → 01 Core Function
3. **Fill gaps** — add missing sections (00-B NFR, 05 Implementation, Traceability)
4. **Match visual style** — if an existing blueprint exists (v1), maintain same fonts, colors, card design
5. **Create as NEW file** — never overwrite existing blueprint unless user explicitly asks. Use naming like `v2.0`, `Master Blueprint v2.html`, etc.

## Key Principles
- Source code is the source of truth for retrospective BSF — not memory, not conversation history
- Be honest about completeness: mark sections as "extracted from code" vs "designed new"
- The ADR section becomes a narration of WHY choices were made (reverse-engineered from the tech stack)
- When tech stack contradicts what you'd recommend — document it as-is, add ADR with rationale

## Example: WMS v2.0 (this session)
- Read server/package.json (Express, Prisma, Redis, MinIO, JWT, Zod, Winston, Multer)
- Read client/package.json (React 18, Vite 6, Tailwind 3, Zustand, TanStack Query)
- Read prisma/schema.prisma (11 tables with relations and indexes)
- Read routes/index.ts (9 route groups, 18 endpoints)
- Mapped to BSF 00-05 → filled 00-A, 00-B, 03, 04, 05, ADR, Traceability
- Created as separate file: `Master System Blueprint v2.0.html` alongside original v1
