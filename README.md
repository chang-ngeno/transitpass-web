# TransitPass — Next.js Frontend

PWA frontend for the TransitPass transport ticketing system.

## Stack
- **Next.js 14** (App Router, JavaScript only — no TypeScript)
- **next-pwa** — service worker, offline support, installable PWA
- **Tailwind CSS** — utility-first styling with custom design system
- **Recharts** — dashboard charts
- **Lucide React** — icons
- **date-fns** — date formatting

## Design System
- **Fonts**: Playfair Display (display/headings) + IBM Plex Mono (data/labels) + DM Sans (body)
- **Palette**: Deep navy `#0b1120`, amber `#f0a500`, green/red status accents
- **Components**: `.btn`, `.card`, `.input`, `.label`, `.badge`, `.data-table`, `.modal-backdrop`

## Pages & Roles

| Page | Path | Roles |
|------|------|-------|
| Login | `/login` | Public |
| Dashboard | `/dashboard` | All |
| Trips | `/trips` | All |
| Book Ticket | `/book` | All |
| Tickets | `/tickets` | All |
| **Admin: Tenants** | `/admin/tenants` | SUPER_ADMIN |
| **Admin: Users** | `/admin/users` | SUPER_ADMIN, TENANT_ADMIN |
| **Admin: Stages** | `/admin/stages` | SUPER_ADMIN, TENANT_ADMIN |
| **Admin: Trips** | `/admin/trips` | SUPER_ADMIN, TENANT_ADMIN |
| **Admin: Fare Windows** | `/admin/fares` | SUPER_ADMIN, TENANT_ADMIN, STAGE_HEAD |
| **Admin: Vehicles** | `/admin/vehicles` | SUPER_ADMIN, TENANT_ADMIN, STAGE_HEAD |

## Setup

```bash
# Install deps
npm install

# Set backend URL (defaults to localhost:8080)
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local

# Dev server
npm run dev

# Production build
npm run build && npm start
```

## PWA

- **next-pwa** generates `/public/sw.js` and `/public/workbox-*.js` on build.
- Manifest: `/public/manifest.json`
- Caching strategy:
  - Auth endpoints → NetworkOnly
  - API calls → NetworkFirst (5-min cache)
  - Static assets → CacheFirst (30-day cache)
  - Pages → NetworkFirst with offline fallback
- Install prompt shown via `beforeinstallprompt` event (already handled in AppShell)

## API Proxy

All `/api/*` requests are proxied to the Spring Boot backend via `next.config.js`:

```
Browser → /api/auth/login → http://localhost:8080/api/auth/login
```

## Auth Flow

JWT token stored in `sessionStorage` (or `localStorage` if "Remember me" checked).
All API calls include `Authorization: Bearer <token>` automatically.
401 responses clear the token and redirect to `/login`.

## Folder Structure

```
src/
  app/
    login/          Login page
    dashboard/      Dashboard with charts
    trips/          Trip listing
    tickets/        Booking history
    book/           Single + batch booking
    admin/
      tenants/      Tenant management (SUPER_ADMIN)
      users/        User creation
      stages/       Stage management
      trips/        Trip management + seat visualization
      fares/        Dynamic fare window editor
      vehicles/     Vehicle CRUD + activate/deactivate
  components/
    layout/
      AppShell.js   Main shell with sidebar + topbar
      Sidebar.js    Role-filtered navigation
    ui/
      index.js      All shared components
  lib/
    api.js          API client (all endpoints)
    auth.js         AuthProvider + useAuth + useRequireAuth
    utils.js        Formatting + color maps
```
