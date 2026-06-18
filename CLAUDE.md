# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server (Vite)
npm run build      # production build
npm run preview    # preview production build locally
npm run lint       # ESLint (zero warnings policy)
```

No test suite is configured. There is no `test` script.

## Environment

Requires a `.env` file (not committed) with:
```
VITE_API_URL=https://your-backend-url
```

`API_BASE` is consumed from `import.meta.env.VITE_API_URL` in `src/lib/constants.js`. All API calls go through `src/services/api.js`, which attaches the JWT from `localStorage` (`waka_token`).

## Architecture

**Stack:** React 18 + Vite, React Router v6, Zustand, Tailwind CSS v3, Recharts, Lucide icons.

**Path alias:** `@` maps to `src/` (configured in `vite.config.js`).

### Three distinct user surfaces

| Surface | Route prefix | Auth | Layout |
|---|---|---|---|
| Merchant app | `/app/*` | Required (`ProtectedRoute`) | `AppShell` + `BottomNav` |
| Public storefront | `/boutique/:slug/*` | None | `PublicLayout` |
| Super-admin back-office | `/admin/*` | Required + `role === 'superadmin'` (`AdminRoute`) | `AdminShell` (lazy-loaded chunk) |

Auth pages (`/login`, `/register`, etc.) use `AuthLayout`. Subscription/paywall pages live under `/abonnement/*` and are accessible without full auth.

### State management (Zustand stores)

- `authStore` — persisted (`waka-auth` key in localStorage); holds `token`, `merchant`, `isAuthenticated`. Token is also mirrored into `localStorage` as `waka_token` for use by the API service.
- `tenantStore` — transient; holds the current `slug` and `boutique` object for the public storefront.
- `catalogueStore` — transient; cart state for the public checkout flow. Cart items are keyed by `${product.id}-${selectedColor}`.

### Services layer

All services in `src/services/` call `api.js` methods. Key services:
- `authService` — register, login, me
- `orderService` — merchant order management
- `stockService` — stock + dashboard stats
- `productService` — CRUD for merchant catalogue
- `catalogueService` — public boutique fetch + public order creation
- `merchantService`, `employeeService` — merchant profile and team
- `adminApi` — super-admin endpoints
- `whatsappService` — WhatsApp order parsing feature

### Admin back-office

`AdminApp` is **lazy-loaded** (separate bundle chunk) so merchant users never download it. It uses its own `AdminContext` for impersonation state. Routes are defined inside `AdminApp` using `<Routes>` nested within the parent `createBrowserRouter` entry at `/admin/*`.

### UI components

Primitive UI components (`Button`, `Input`, `Card`, `Badge`, `Modal`, etc.) live in `src/components/ui/`. Feature-specific components are colocated under `src/components/features/{catalogue,dashbord,orders,parsing}/`. Note: `dashbord` is intentionally misspelled in the directory name — match this when adding files there.

The `cn()` utility (`src/lib/utils.js`) merges Tailwind classes via `clsx` + `tailwind-merge`.

### Deployment

Deployed to **Cloudflare Pages**. Configuration is in `wrangler.jsonc`. The `_routes.json` was removed in favour of wrangler-managed routing.
