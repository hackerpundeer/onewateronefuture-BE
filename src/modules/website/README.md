# Website Module

## Purpose

Manages multi-tenant website records that scope all Platform V2 data.

## Responsibilities

- CRUD for website entities (create is admin-only)
- Seed default website "One Water One Future" on boot
- Provide `enabledModules` gating for plugin routes

## Public APIs

- `GET /api/v2/websites` — list websites
- `GET /api/v2/websites/:slug` — get website by slug
- `POST /api/v2/websites` — create website (admin)

## Dependencies

- MongoDB `websites` collection
- `adminAuth` middleware for protected routes

## Future Roadmap

- Domain verification and custom domain routing
- Per-website theme/branding configuration
- Website-level admin roles
