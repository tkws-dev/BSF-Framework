# Member System Migration — Single-Role → Multi-Role + Google Auth

## Context

Migrating a React + Supabase app from:
- Single `role TEXT` column → `roles TEXT[]` array
- Separate `craftsmen` table → merged into `profiles`
- Hardcoded user IDs → Google OAuth
- No auth → Auth Guard + Role Selector

## DB Migration (002)

```sql
-- 1. Add roles array to profiles
ALTER TABLE profiles
  ADD COLUMN roles TEXT[] NOT NULL DEFAULT '{customer}',
  ADD COLUMN email TEXT,
  ADD COLUMN name TEXT;

-- 2. Migrate existing role
UPDATE profiles SET roles = ARRAY[role] WHERE roles IS NULL;

-- 3. Merge craftsmen fields into profiles
ALTER TABLE profiles
  ADD COLUMN id_card_number TEXT,
  ADD COLUMN id_card_front_url TEXT,
  ADD COLUMN id_card_back_url TEXT,
  ADD COLUMN selfie_url TEXT,
  ADD COLUMN craftsman_status TEXT DEFAULT NULL,
  ADD COLUMN verified_at TIMESTAMPTZ;

-- 4. Migrate data
UPDATE profiles p SET
  id_card_number = c.id_card_number,
  craftsman_status = c.status
FROM craftsmen c WHERE c.user_id = p.id;

-- 5. Migrate FK references
ALTER TABLE badges ADD COLUMN member_id UUID REFERENCES profiles(id);
UPDATE badges b SET member_id = c.user_id FROM craftsmen c WHERE c.id = b.craftsman_id;

ALTER TABLE jobs ADD COLUMN member_id UUID REFERENCES profiles(id);
UPDATE jobs j SET member_id = c.user_id FROM craftsmen c WHERE c.id = j.craftsman_id;

-- 6. Update signup trigger for Google Auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name, roles)
  VALUES (NEW.id, COALESCE(NEW.email, ''), COALESCE(NEW.raw_user_meta_data->>'name', ''), '{customer}');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Update RLS — roles array check
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR 'admin' = ANY(roles));

-- 8. GIN index for roles array
CREATE INDEX idx_profiles_roles ON profiles USING gin (roles);
```

## React Code Pattern

### Auth Context (`lib/auth.tsx`)

```tsx
interface Profile {
  id: string; email: string; name: string;
  avatar_url: string | null;
  roles: string[];
  craftsman_status: string | null;
}

function AuthProvider({ children }) {
  // state: user, profile, session, loading
  // activeRole — persisted in localStorage ('sarapadchang_role')
  // setActiveRole — syncs localStorage + state

  // On auth state change → fetch profile from Supabase
  // signInWithGoogle — supabase.auth.signInWithOAuth({ provider: 'google' })
  // signOut — supabase.auth.signOut()
  // isAdmin = profile.roles.includes('admin')
  // isCraftsman = profile.roles.includes('craftsman')
}
```

### Route Guard (`App.tsx`)

```tsx
function AuthGuard({ children, allowedRoles }) {
  const { user, loading, activeRole } = useAuth()

  useEffect(() => {
    if (loading) return
    if (!user) navigate('/login', { replace: true })
    else if (allowedRoles && !allowedRoles.includes(activeRole))
      navigate('/role-selector', { replace: true })
  }, [user, loading, allowedRoles, activeRole])

  if (loading) return <LoadingScreen />
  if (!user || (allowedRoles && !allowedRoles.includes(activeRole))) return null
  return <>{children}</>
}
```

### Role Selector Page

- Shows profile name/avatar from Google
- Displays available roles as cards: 🙋 Customer, 🔧 Craftsman, 🛡️ Admin
- Craftsman card shows "🚀 เร็วๆ นี้" if not yet activated
- Admin card only visible if `profile.roles.includes('admin')`
- Selecting a role → `setActiveRole(role)` → navigate to default page for that role
- "ออกจากระบบ" button at bottom

### Sidebar Role Switch

- Buttons at top of sidebar: สลับเป็นลูกค้า, สลับเป็นช่าง, สลับเป็น Admin
- Highlight current active role
- Workflow/Admin section visibility depends on activeRole
- Logout button in footer

## User Preferences (tkws)

| Aspect | Preference |
|--------|-----------|
| Roles | แค่ 3: customer, craftsman, admin ไม่มีเพิ่ม |
| Scope | ไม่ over-architect — bootstrapped, ไม่มี role เพิ่ม |
| Auth | Google OAuth — เร็วที่สุด |
| Role switch | Sidebar buttons + RoleSelectorPage |
| Profile | Auth-driven — name/avatar from Google |

## Dev Server (WSL)

```
apps/mobile → :5200
apps/admin  → :5201
```
Kill + restart vite when files change on /mnt/c/:
```
kill $(ss -tlnp | grep 5200 | grep -oP 'pid=\K\d+')
rm -rf apps/mobile/node_modules/.vite
npx vite --port 5200 --host --force
```

## Common Pitfalls

- ❌ **`verbatimModuleSyntax`** — TypeScript config requires `import type` for type-only imports
- ❌ **`noUnusedLocals`** — remove unused functions like `AuthMainLayout`
- ❌ **Admin route nesting** — `/admin/*` routes need nested `<Routes>` + relative `<Navigate to="dashboard">`
- ❌ **Supabase Auth redirect** — must configure `redirectTo: '${origin}/role-selector'` in OAuth signIn
- ❌ **Role migration** — old `craftsmen.role` values ('super_admin') → map to 'admin' in new `profiles.roles`
