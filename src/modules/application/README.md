# Application Module

Adapter over V1 `clubapplications` collection with website scoping and contact linking.

## Public APIs

- `POST /api/v2/websites/:slug/applications` (public)
- `GET/PATCH /api/v2/websites/:slug/applications/:id` (admin)

## Dependencies

- ClubApplication model, Contact findOrCreate, websiteScope helper
