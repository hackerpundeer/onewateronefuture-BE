# One Water One Future — Backend API

Express + MongoDB API for the Kangen Water Distributor platform.

## Setup

```bash
cp .env.example .env
# Edit .env — set MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET
npm install
npm run dev
```

On first startup, if no admin exists in MongoDB, one is created from `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload (port 5000) |
| `npm run build` | Compile TypeScript → `server.js` (root) |
| `npm start` | Run `node server.js` |

## Hostinger deployment

| Setting | Value |
|---------|-------|
| **Entry file** | `server.js` |
| **Build command** | `npm run build` |
| **Start command** | `npm start` |
| **Node version** | 18+ |

`postinstall` runs the build automatically after `npm install`, so `server.js` is generated on deploy.

Set environment variables in the Hostinger panel: `MONGODB_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`, `FRONTEND_URL`, `PORT`.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | API port (default 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `FRONTEND_URL` | CORS allowed origins (comma-separated) |
| `ADMIN_EMAIL` | Initial admin email (seeded on first boot) |
| `ADMIN_PASSWORD` | Initial admin password (seeded on first boot) |
| `JWT_SECRET` | Secret for signing admin JWT tokens |

## API Routes

**Public:**
- `GET /api` — status string
- `GET /api/health` — database connection status
- `POST /api/book-demo` — create demo booking
- `POST /api/club-applications` — create club application
- `POST /api/admin/login` — admin login (returns JWT)

**Admin (Bearer JWT required):**
- `GET /api/admin/me` — current admin info
- `GET/PATCH /api/book-demo` — manage bookings
- `GET/PATCH /api/club-applications` — manage applications
- `GET/POST/PATCH /api/leads` — manage CRM leads
