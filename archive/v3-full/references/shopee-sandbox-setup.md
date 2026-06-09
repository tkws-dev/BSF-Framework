# Shopee Sandbox — Setup Guide

## Where to get API credentials

⚠️ Shopee Seller Center (seller.shopee.co.th) ≠ Shopee Open Platform (open.shopee.com)

The API keys are obtained from the Open Platform, NOT the Seller Center.

## Step-by-Step

1. Go to https://open.shopee.com
2. Click Console (top nav) — or Get Access (Now)
3. Login with existing Shopee seller account (or Sign Up if first time)
4. After login → click Create App
5. Select Sandbox environment (for testing — free, fake data)
6. Fill in:
   - App name (e.g. "ECommerceIntegrationHub")
   - Redirect URL: http://localhost:5173/oauth/callback (for local dev)
   - For production: use your real domain
7. After creation → you get:
   - partner_id (e.g. 2001234)
   - partner_key (long hex string — keep secret)
8. These go into the ECommerceIntegrationHub "Add Platform" form (SCR-02)

## Sandbox URLs

| Purpose | URL |
|---------|-----|
| Auth + API | https://partner.test-stable.shopeemobile.com |
| Seller login | https://seller.test-stable.shopee.co.th |

## OAuth Flow for testing

1. Backend redirects user to: GET /api/v2/shop/auth_partner with partner_id, timestamp, sign, redirect
2. User logs in at sandbox seller page
3. Shopee redirects back to your redirect URL with ?code=xxx&shop_id=123
4. Backend calls POST /api/v2/auth/token/get to exchange code for access_token
5. Store access_token + refresh_token in DB (encrypted)

## Common Gotcha

- Sandbox uses test data — no real orders
- OAuth redirect URL must match exactly what you set in the app config
- localhost works in sandbox but NOT in production
- For production, you need a real domain with HTTPS
