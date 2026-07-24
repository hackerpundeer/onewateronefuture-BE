# Contact Module

## Purpose

Unified contact identity per website with safe deduplication rules.

## Responsibilities

- `findOrCreate(email?, phone?, name?, websiteId)` — email match first, then phone, never name
- Prefer duplicates over false merges
- Admin list/get for CRM use

## Public APIs

- `GET /api/v2/websites/:slug/contacts` — list contacts (admin)
- `GET /api/v2/websites/:slug/contacts/:id` — get contact (admin)

## Dependencies

- Website context middleware
- MongoDB `contacts` collection

## Future Roadmap

- Contact merge tooling (admin-reviewed)
- Activity timeline across modules
- GDPR export/delete
