# V1 Route Inventory

All routes under `/api/*` (Platform V1). Behavior must remain identical during V2 rollout.

## Public

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api` | Status string |
| GET | `/api/health` | DB health check |
| POST | `/api/book-demo` | Create demo booking |
| POST | `/api/club-applications` | Create club application |
| POST | `/api/webinar-registrations` | Create webinar RSVP |
| POST | `/api/service-requests` | Create service request |
| GET | `/api/webinar-settings` | Public webinar settings |
| GET | `/api/social-settings` | Public social settings |
| POST | `/api/admin/login` | Admin JWT login |

## Admin (Bearer JWT)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/me` | Current admin |
| GET | `/api/book-demo` | List bookings (query filters) |
| PATCH | `/api/book-demo/:id` | Update booking |
| DELETE | `/api/book-demo/:id` | Soft-delete booking |
| GET | `/api/club-applications` | List applications |
| PATCH | `/api/club-applications/:id` | Update application |
| GET | `/api/leads` | List leads |
| POST | `/api/leads` | Create lead |
| PATCH | `/api/leads/:id` | Update lead |
| GET | `/api/service-requests` | List service requests |
| PATCH | `/api/service-requests/:id` | Update service request |
| GET | `/api/webinar-registrations` | List registrations |
| PATCH | `/api/webinar-registrations/:id` | Update registration |
| PUT | `/api/webinar-settings` | Update webinar settings |
| PUT | `/api/social-settings` | Update social settings |

## Implementation

V1 routes live in `src/v1/routes/index.ts` via `registerV1Routes(app)`.

Legacy data access: `src/legacy/store.ts`, `src/legacy/validation.ts`.
