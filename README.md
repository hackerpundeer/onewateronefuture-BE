# One Water One Future — Backend API

Express + MongoDB API for the Kangen Water Distributor platform. Supports **V1** (`/api/*`) and **Platform V2** (`/api/v2/*`).

## Setup

```bash
cp .env.example .env
# Edit .env — set MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET
npm install
npm run dev
```

On first startup:

- Default admin is seeded from `ADMIN_EMAIL` / `ADMIN_PASSWORD` (MongoDB required)
- Default website **One Water One Future** (`one-water-one-future`) is seeded

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload (port 5000) |
| `npm run build` | Bundle TypeScript → `server.js` (root) |
| `npm start` | Run `node server.js` |
| `npm run lint` | TypeScript check (`tsc --noEmit`) |
| `npm test` | Smoke tests (`node:test` + supertest) |

## Architecture

See [docs/architecture/platform-v2.md](./docs/architecture/platform-v2.md) for the V2 design.

```
src/index.ts  →  esbuild  →  server.js
src/main.ts   →  connect DB, seed, listen
src/app.ts    →  createApp() (V1 + V2 routes)
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | API port (default 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `FRONTEND_URL` | CORS allowed origins (comma-separated). If unset, CORS is open. |
| `ADMIN_EMAIL` | Initial admin email (seeded on first boot) |
| `ADMIN_PASSWORD` | Initial admin password (seeded on first boot) |
| `JWT_SECRET` | Secret for signing admin JWT tokens |

## API Overview

### V1 — `/api/*` (legacy, unchanged)

Documented in [docs/implementation/v1-route-inventory.md](./docs/implementation/v1-route-inventory.md).

### V2 — `/api/v2/*`

| Endpoint | Description |
|----------|-------------|
| `GET /api/v2/health` | Health check (V2 envelope) |
| `GET /api/v2/websites` | List websites |
| `GET /api/v2/websites/:slug` | Get website |
| `POST /api/v2/websites` | Create website (admin) |
| `…/websites/:slug/contacts` | Contacts (admin) |
| `…/configuration/:namespace` | `social` or `webinar` config |
| `…/appointments` | Demo bookings |
| `…/inquiries` | Leads |
| `…/applications` | Club applications |
| `…/service-requests` | Service requests |
| `…/registrations` | Webinar registrations |
| `…/products` | Product catalog |
| `…/donations` | Donations (requires `donation` in `enabledModules`) |

V2 responses use `{ data, error, meta }`.

## Security (Phase 13)

- `helmet` HTTP headers
- Rate limiting on public V2 POST endpoints
- CORS restricted when `FRONTEND_URL` is configured

## V1 Deprecation

V1 remains active. See [docs/implementation/v1-deprecation.md](./docs/implementation/v1-deprecation.md).

## Hostinger Deployment

| Setting | Value |
|---------|-------|
| **Entry file** | `server.js` |
| **Build command** | `npm run build` |
| **Start command** | `npm start` |
| **Node version** | 18+ |

`postinstall` runs the build automatically after `npm install`.

Set environment variables in the Hostinger panel: `MONGODB_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`, `FRONTEND_URL`, `PORT`.
