### 32. Supabase Realtime Presence — Online Count (29 May 2026)

Track online users with Supabase Presence:

```tsx
const [onlineCount, setOnlineCount] = useState(0)

useEffect(() => {
  const channel = supabase.channel('jobs-customer', {
    config: { presence: { key: uid || 'anon' } }
  })
  channel
    .on('presence', { event: 'sync' }, () => {
      setOnlineCount(Object.keys(channel.presenceState()).length)
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') await channel.track({ online_at: new Date().toISOString() })
    })
  return () => { supabase.removeChannel(channel) }
}, [uid])
```

Display in legend: `<i className="fa-solid fa-user text-emerald-400" /> {onlineCount} ออนไลน์`

### 33. CreateRequestModal — Overlay Pattern (29 May 2026)

Converted from separate route page to modal overlay on map for blur effect:

```tsx
// In CustomerMapPage:
const [showCreate, setShowCreate] = useState(false)

{showCreate && (
  <div className="absolute inset-0 z-[2000] flex items-center justify-center backdrop-blur-sm bg-black/20"
       onClick={() => setShowCreate(false)}>
    <div onClick={e => e.stopPropagation()} className="w-full max-w-lg mx-4">
      <CreateRequestModal onClose={() => setShowCreate(false)} />
    </div>
  </div>
)}
```

Component accepts `onClose` prop instead of `useNavigate`. `navigate('/customer')` → `onClose()`.

### 34. CreateRequest v2 — 3-Step Wizard + Fee (29 May 2026)

Steps: เลือกหมวดหมู่ → รายละเอียด → ราคา + เวลา

3-column category grid (`grid-cols-3`), wider card (`max-w-lg`). Min price ฿500.

Fee display:
```tsx
<div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
  <p>ℹ️ ค่าธรรมเนียมระบบ 10%</p>
  <p>เมื่อมีช่างรับงาน ระบบจะหัก 10% จากราคารวมเป็นค่าดำเนินการ</p>
  {price >= 500 && (
    <p>คุณจะได้รับ ฿{price*0.9} · ระบบได้รับ ฿{price*0.1}</p>
  )}
</div>
```

Expire time: 3 or 6 hours, sent as `expires_at` ISO timestamp to DB.

### 35. FontAwesome 6 Fix Pattern (29 May 2026)

Every FA icon must include inline style:
```tsx
const FA = { fontFamily: "'Font Awesome 6 Free'", fontWeight: 900 } as const
// Use: <i className="fa-solid fa-rocket" style={FA} />
```

⚠️ Never write FA icon as template literal string — it renders as text, not JSX:
```tsx
// ❌ WRONG:
'<i className="fa-solid fa-rocket" /> ส่งคำขอ'
// ✅ CORRECT:
<><i className="fa-solid fa-rocket" style={FA} /> ส่งคำขอ</>
```

### 36. Continuous Font Slider (replaces preset buttons) (29 May 2026)

User rejected 3-button preset. Now uses continuous slider 14-24px:

```tsx
<input type="range" min={14} max={24} step={1} value={bodySize}
  onChange={e => setFontSize(Number(e.target.value))} />
```

`useFontSize` hook stores numeric value, sets CSS vars on `document.documentElement`:
```tsx
document.documentElement.style.setProperty('--font-body', bodySize + 'px')
document.documentElement.style.setProperty('--font-heading', headingSize + 'px')
```

Components use `style={{ fontSize: 'var(--font-body)' }}` instead of Tailwind `text-*` classes.

### 37. JSX Pitfalls (29 May 2026)

- **Duplicate `style` prop**: `<span style={a} style={b}>` → first overwritten. Merge: `style={{...a, ...b}}`
- **Missing closing `</div>`**: after multi-patch on 400+ line JSX, nesting errors cause blank page. Verify with `curl | grep` before telling user to refresh.
- **`stateColor()` returns string not object**: `{...'bg-blue-50 text-blue-600'}` spreads characters as keys. Use as `className` not `style`.

### 38. Clean Vite Restart Protocol (29 May 2026)

```bash
pkill -9 -f "node.*vite"
sleep 1
kill -9 $(ss -tlnp | grep 5200 | grep -oP 'pid=\K\d+') 2>/dev/null
rm -rf apps/mobile/node_modules/.vite
cd apps/mobile && npx vite --port 5200 --host --force
curl -s http://localhost:5200/src/pages/workflow/CustomerMapPage.tsx | grep "new_feature"
```
Always `curl`-verify before telling user to `Ctrl+Shift+R`.
