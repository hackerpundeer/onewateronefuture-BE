# Service Request Module

Adapter over V1 `servicerequests` collection with website scoping and contact linking.

## Public APIs

- `POST /api/v2/websites/:slug/service-requests` (public)
- `GET/PATCH /api/v2/websites/:slug/service-requests/:id` (admin)

## Dependencies

- ServiceRequest model, Contact findOrCreate, legacy phone validation
