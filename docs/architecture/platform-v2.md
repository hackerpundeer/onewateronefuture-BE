# Platform V2 Architecture

## Overview

Platform V2 introduces multi-tenant website scoping, modular domain boundaries, and a consistent API envelope while preserving V1 `/api/*` behavior.

## API Versions

| Version | Base path | Response shape |
|---------|-----------|----------------|
| V1 | `/api/*` | Legacy (mixed `{ success, data }`, raw arrays, plain objects) |
| V2 | `/api/v2/*` | `{ data, error, meta }` envelope |

## Tenancy Model

- **Website** is the tenant root (`slug`, `enabledModules`, `configuration`)
- Default website: `one-water-one-future` ("One Water One Future")
- Missing `websiteId` on legacy records maps to the default website via `websiteScope` helpers

## Module Map

| Module | V1 collection | V2 path segment |
|--------|---------------|-----------------|
| Website | `websites` (new) | `/websites` |
| Contact | `contacts` (new) | `/contacts` |
| Configuration | `webinarsettings`, `socialsettings` (adapters) | `/configuration/:namespace` |
| Appointment | `bookings` | `/appointments` |
| Inquiry | `leads` | `/inquiries` |
| Application | `clubapplications` | `/applications` |
| Service Request | `servicerequests` | `/service-requests` |
| Registration | `webinarregistrations` | `/registrations` |
| Product | `products` (new) | `/products` |
| Donation (plugin) | `donations` (new) | `/donations` |

## Cross-Cutting

- `requestId` middleware on all requests
- `helmet`, rate limiting on public V2 POSTs
- CORS restricted when `FRONTEND_URL` is set
- In-memory event publisher (no-op default)
- Media, Notification, Audit: ports/types only (Phase 11)

## Entry Points

- `src/index.ts` → esbuild → `server.js`
- `src/main.ts` — boot (DB, seed admin, seed website, listen)
- `src/app.ts` — `createApp()` composition
