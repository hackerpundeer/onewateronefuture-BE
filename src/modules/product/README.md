# Product Module

Website-scoped product catalog with a dedicated `products` collection.

## Public APIs

- `GET /api/v2/websites/:slug/products` — list active products
- `GET /api/v2/websites/:slug/products/:id` — get active product

## Admin APIs

- `POST /api/v2/websites/:slug/products` — create product
- `PATCH /api/v2/websites/:slug/products/:id` — update product
- `DELETE /api/v2/websites/:slug/products/:id` — soft delete (`isActive: false`)

## Dependencies

- Product model (unique index on `websiteId` + `slug`)
- Zod validators for create/update payloads
