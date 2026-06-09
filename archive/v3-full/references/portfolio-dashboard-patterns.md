# Portfolio Dashboard — Phase 2 Implementation Patterns

Session: 2026-06-08 — portfolio-AsciiProfile Phase 2 refactor.

## Component Extraction Pattern

Terminal.tsx was 233 lines with all cards as inline JSX. Refactored to:

```
Terminal.tsx → CARD_REGISTRY[]
  ├── InfoCard.tsx       (extracted)
  ├── ExperienceCard.tsx  (extracted)
  ├── AnalysisCard.tsx    (extracted, was AiAnalysis)
  ├── OpenSourceCard.tsx  (new)
  ├── PhilosophyCard.tsx  (new)
  └── ProjectsBox.tsx    (enhanced with tech badges)
```

### Card Registry Pattern
```tsx
type CardId = 'info' | 'experience' | 'analysis' | 'opensource' | 'philosophy' | 'projects';

interface CardDef {
  id: CardId;
  label: string;
  render: () => ReactNode;
}

const CARD_REGISTRY: CardDef[] = [
  { id: 'info', label: 'info', render: () => <InfoCard /> },
  { id: 'opensource', label: 'open-source', render: () => <OpenSourceCard /> },
  // ... new cards just add an entry here
];
```

New cards default to `false` in DEFAULTS.cards — hidden until user enables in settings.

## Mouse Parallax on ASCII Plasma

Simple approach — no Context API needed:
```tsx
// Terminal.tsx
const [mx, setMy] = useState(0);
const [my, setMy] = useState(0);
const onMouseMove = useCallback((e: React.MouseEvent) => {
  setMx((e.clientX / window.innerWidth) * 2 - 1);
  setMy((e.clientY / window.innerHeight) * 2 - 1);
}, []);

// Pass to plasma
<AsciiPlasma ... mx={mx} my={my} />

// AsciiPlasma — shift wave origin by mouse
const ox = mx * 12;
const oy = my * 12;
// Apply to sin() calls + CSS transform for additional drift
```

## Tech Badges on Projects
```tsx
{p.tech.map(t => (
  <span style={{ fontSize: '0.42rem', padding: '1px 4px', borderRadius: 2,
    background: 'rgba(179,136,255,0.08)', color: '#b388ff',
    border: '1px solid rgba(179,136,255,0.1)' }}>{t}</span>
))}
```

## Verification Checklist
1. Kill old Vite: `ss -tlnp | grep 5173 | grep -oP 'pid=\K\d+' | xargs -r kill`
2. Clear cache: `rm -rf node_modules/.vite`
3. Start: `npx vite --port 5173` (background)
4. HTTP check: `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/`
5. Browser: `browser_navigate` + `browser_console` → 0 errors
6. Navigate to page, check all cards render
