# Vitest Setup for pnpm Monorepo (React + Vite + TypeScript)

Reference for setting up Vitest + React Testing Library in tkws-standard projects:
pnpm workspace with `apps/*` structure, React 19, Vite, TypeScript (`verbatimModuleSyntax`),
Tailwind CSS v4.

## Quick Setup (per app)

### 1. Install
```bash
cd apps/<name> && pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

⚠️ **Pitfall: `npm install` on pnpm workspace** — Fails with `run-s: not found` because
pnpm hoists packages differently. Always use `pnpm add` in pnpm workspace projects.

### 2. vite.config.ts
```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
    // For Supabase projects — createClient crashes with empty key:
    env: {
      VITE_SUPABASE_URL: 'http://localhost:54321',
      VITE_SUPABASE_ANON_KEY: 'test-anon-key',
    },
  },
})
```

### 3. src/test-setup.ts
```ts
import '@testing-library/jest-dom/vitest'
```

⚠️ `verbatimModuleSyntax` compatible — uses side-effect `import '...'` syntax, not named imports.

### 4. package.json scripts
```json
"test": "vitest run",
"test:watch": "vitest"
```

## Pitfalls

### Supabase createClient crashes in test
`createClient(url, '')` with empty string key throws `supabaseKey is required`.
Fix: set `test.env.VITE_SUPABASE_ANON_KEY` to any non-empty string in vite.config.ts.

### setTimeout state transitions in React components
```ts
// ❌ WRONG — findBy* uses waitFor (real timers), hangs on fake timers
vi.useFakeTimers()
fireEvent.click(button)
vi.advanceTimersByTime(800)
expect(await screen.findByText('OTP step')).toBeInTheDocument() // timeout!

// ✅ RIGHT — act() wraps the timer flush, getBy* is synchronous
vi.useFakeTimers()
fireEvent.click(button)
act(() => { vi.advanceTimersByTime(800) })
expect(screen.getByText('OTP step')).toBeInTheDocument()
vi.useRealTimers()
```

Key: `act()` flushes React state updates after fake-timer advance.
`findBy*` = `waitFor` + `getBy*` — uses `setInterval` polling, dead with fake timers.

### Controlled→uncontrolled warning (React)
When conditional rendering swaps `<input value={x}>` (controlled) for `<input>` (uncontrolled),
React warns: "A component is changing a controlled input to be uncontrolled."
This is harmless in tests but points to a real UX concern — the OTP input has no `value` prop.
If desired, add `value` + `onChange` to the OTP input as well.

## File structure
```
apps/<name>/src/
├── test-setup.ts
├── __tests__/
│   ├── App.test.tsx
│   └── ComponentName.test.tsx
```
