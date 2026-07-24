# Registration Module

Adapter over V1 `webinarregistrations` collection with website scoping and contact linking.

## Public APIs

- `POST /api/v2/websites/:slug/registrations` (public)
- `GET/PATCH /api/v2/websites/:slug/registrations/:id` (admin)

## Dependencies

- WebinarRegistration model, Contact findOrCreate (phone-only), legacy phone validation
