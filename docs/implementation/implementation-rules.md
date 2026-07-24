# Implementation Rules

These rules govern Platform V2 implementation in this backend.

## API Compatibility

- V1 `/api/*` behavior must remain identical (bugfixes only)
- No collection renames, no required migrations — additive Mongo only

## Tenancy

- Missing `websiteId` = default seeded website "One Water One Future" (`one-water-one-future`)
- Use `mergeWebsiteScope` / `buildWebsiteScopeFilter` for queries

## Configuration

- Adapters over `SocialSettings` / `WebinarSettings` — **NO** new Configuration collection
- Namespaces: `social`, `webinar`

## Contacts

- Match: email first, then phone, **NEVER** name
- Prefer duplicates over false merges

## Scaffolds

- Media, Notification, Audit = structure only (ports/types/README)

## Hardening (Phase 13)

- helmet, rate-limit on public V2 POSTs
- CORS: restrict when `FRONTEND_URL` set; else open
- Do **NOT** remove V1 — document deprecation path only

## Build

- `src/index.ts` remains esbuild entry → `server.js`
- `npm run lint`, `npm test`, `npm run build` must pass
