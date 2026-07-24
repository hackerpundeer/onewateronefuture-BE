# Configuration Module

## Purpose

Expose website-scoped configuration via adapters over existing V1 settings collections.

## Responsibilities

- Read/write `social` and `webinar` namespaces
- NO new Configuration collection — adapters to `SocialSettings` / `WebinarSettings`

## Multi-site safety

Until per-website configuration persistence exists:

- **Reads** are available for any website slug (shared singleton adapters)
- **Writes (PUT)** are allowed **only for the default website** (`one-water-one-future`)
- Non-default websites receive `403 Forbidden` on write

## Public APIs

- `GET /api/v2/websites/:slug/configuration/:namespace` — public read
- `PUT /api/v2/websites/:slug/configuration/:namespace` — admin update (default website only)

## Dependencies

- `adapters/social.adapter.ts` → SocialSettings collection
- `adapters/webinar.adapter.ts` → WebinarSettings collection
- Legacy validation for payloads

## Future Roadmap

- Additional namespaces (SEO, theme, analytics, feature flags)
- Physical consolidation only after V1 retirement
- Per-website settings documents when multi-tenant config is needed
