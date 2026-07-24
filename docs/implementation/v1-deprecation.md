# V1 Deprecation Path

V1 (`/api/*`) is **not removed** in Phase 13. This document describes the planned sunset.

## Principles

- No breaking changes until all clients migrate
- V1 receives bugfixes only
- V2 is the target for new features

## Deprecation Steps

### 1. Instrumentation (future)

- Log route + user-agent for V1 endpoints
- Dashboard for V1 vs V2 traffic

### 2. Client updates

| V1 endpoint | V2 replacement |
|-------------|----------------|
| `POST /api/book-demo` | `POST /api/v2/websites/:slug/appointments` |
| `POST /api/club-applications` | `POST /api/v2/websites/:slug/applications` |
| `GET /api/webinar-settings` | `GET /api/v2/websites/:slug/configuration/webinar` |
| `GET /api/social-settings` | `GET /api/v2/websites/:slug/configuration/social` |
| Admin list routes | Corresponding V2 admin routes under `websites/:slug` |

### 3. Announce

- Add `Deprecation` response header on V1 routes (future)
- Document sunset date in release notes

### 4. Remove (future phase)

- Delete `src/v1/routes/`
- Remove legacy route registration from `app.ts`
- Keep `legacy/store` until no internal callers remain

## Do Not

- Remove V1 in Phase 13
- Rename MongoDB collections
- Run required migrations on production
