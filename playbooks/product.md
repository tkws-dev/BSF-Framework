# Product Playbook 💻
## Development Standards & Conventions

> ใช้โดย Product Agent ตอน BSF Part 01-05
> Stack: React + Vite + TypeScript + Tailwind v4 + Supabase

---

## Tech Stack (Default)

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React 19 + Vite 8 + TypeScript | Fast, modern, typed |
| Styling | Tailwind CSS v4 | Utility-first, dark theme |
| Backend | Supabase (PostgreSQL) | Hosted, free tier, RLS |
| Auth | Supabase Auth (Google OAuth) | Built-in, secure |
| Maps | Leaflet (if location needed) | Free, no API key |
| Hosting | Vercel / Netlify (frontend) | Free tier, CDN |

---

## Project Structure

```
project-name/
├── apps/
│   └── mobile/              # React + Vite frontend
│       └── src/
│           ├── pages/       # Route-level components
│           ├── components/  # Reusable UI
│           ├── lib/         # Utils, auth, theme, supabase client
│           └── App.tsx      # Router
├── supabase/
│   └── migrations/          # SQL migrations + RPCs
├── 1-SRS/                   # Blueprint + companions
│   ├── Blueprint.html
│   └── companions/
└── README.md
```

---

## Design Conventions

### Dark Theme (Default)
```css
Background:  bg-slate-900, bg-slate-900/80
Borders:     border-slate-700/50
Text:        text-white, text-slate-300, text-slate-400
Brand:       var(--color-brand-500) — from theme system
```

### Mobile-First
- Design for 375px width first
- Responsive with `md:`, `lg:` breakpoints
- Bottom tab bar for mobile navigation
- No horizontal scroll (except data tables)

### Loading States (REQUIRED)
- Every page → loading state with brand logo
- Every button → disabled + spinner while loading
- Every list → skeleton or spinner on first load
- Empty state → illustration + CTA (never blank)

### Error States (REQUIRED)
- Every RPC call → try/catch with user-facing error
- Network error → retry button
- Auth error → redirect to login
- Never `.catch(()=>{})` — always surface

---

## RPC Pattern (Supabase)

```typescript
// ✅ Always check response.ok
const r = await fetch(`${SUPA_URL}/rest/v1/rpc/function_name`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': SUPA_ANON_KEY,
    'Authorization': `Bearer ${session?.access_token}`
  },
  body: JSON.stringify({ param: value })
})

if (!r.ok) {
  const err = await r.text()
  throw new Error(`RPC failed [${r.status}]: ${err}`)
}

const data = await r.json()
```

### RPC Rules
1. Never `.catch(()=>{})` — swallow errors → impossible to debug
2. Always `response.ok` check before `.json()`
3. setState AFTER all awaits complete (never mid-flow)
4. DB constraints = frontend validation (check before calling)
5. Use `$func$` for `$$` in SQL via `npx supabase db query`

---

## Code Quality Gates

Before marking a task complete:
- [ ] `npx tsc --noEmit` passes
- [ ] Vite builds without errors
- [ ] RPCs verified via curl or browser console
- [ ] Loading/Empty/Error states present
- [ ] Mobile responsive
- [ ] No `console.log` left in production paths
