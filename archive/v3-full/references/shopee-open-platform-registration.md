# Shopee Open Platform — Registration & Credential Setup

## ⚠️ Common Confusion

| URL | What It Is | NOT for API |
|-----|-----------|-------------|
| `seller.shopee.co.th` | **Seller Center** — จัดการร้านค้า, สินค้า, orders | ❌ ไม่ใช่ที่ขอ API key |
| `open.shopee.com` | **Open Platform** — Developer portal, สร้าง App, ขอ API credentials | ✅ ที่นี่เท่านั้น |

คนละเว็บ คนละระบบ — ใช้ account คนละชุดก็ได้

## Registration Flow

1. Go to `https://open.shopee.com`
2. Click **Log In** (top right) or **Get Access (Now)** (center)
3. Sign up with company email OR log in with existing Shopee seller account
4. After login → **Console** → **Create App**
5. Choose **Sandbox** environment first (for development/testing)
6. Set App Name → get `partner_id` + `partner_key`
7. Set **Redirect URL** = your app's OAuth callback (e.g., `http://localhost:5173/oauth/callback`)

## Credentials You Need

| Key | Source | Used For |
|-----|--------|----------|
| `partner_id` | Open Platform → App Console | HMAC signature, OAuth |
| `partner_key` | Open Platform → App Console | HMAC signature (must be encrypted at rest) |
| `shop_id` | OAuth callback | Identifies which shop authorized |
| `access_token` | OAuth token exchange | API calls |
| `refresh_token` | OAuth token exchange | Renew expired access_token |

## Environment URLs

| Env | Base URL |
|-----|----------|
| Sandbox | `https://partner.test-stable.shopeemobile.com` |
| Production | `https://partner.shopeemobile.com` |

Use Sandbox for all development — same credentials, different base URL.

## Note

The Open Platform website is a JavaScript SPA — forms and registration flow may not render in headless browsers or scraping tools. The user must complete registration on their own browser.
