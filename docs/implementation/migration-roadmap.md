# Migration Roadmap

## Phase 0 — Safety net ✅

- V1 route inventory
- Smoke tests (`npm test`)

## Phase 1–12 — Platform V2 ✅

- Foundation, modules, plugin donation, scaffolds

## Phase 13 — Harden ✅

- helmet, rate limit, CORS from config
- Indexes on slug, contact, product
- V1 deprecation doc (no removal)

## Future — Client migration

1. Point frontend public forms to V2 website-scoped endpoints
2. Update admin dashboard to V2 APIs + website context
3. Monitor V1 traffic; deprecate per-route
4. Remove `src/v1/` after zero traffic window (≥ 90 days)
5. Optional backfill job to set `websiteId` on legacy records

## Future — Infrastructure

- Wire notification ports to email/SMS providers
- Implement media storage port (S3/Cloudinary)
- Audit log persistence
