# ADR-002: Website Foundation

## Status

Accepted

## Context

The platform must serve multiple websites with soft multi-tenancy while keeping legacy documents valid.

## Decision

- `Website` is a mandatory foundation module (`websites` collection)
- `slug` is globally unique
- Seed default site: **One Water One Future** (`one-water-one-future`)
- V2 domain entities reference `websiteId`
- Missing `websiteId` on legacy docs maps to the default website (no required migration)

## Consequences

- V2 routes scoped under `/api/v2/websites/:slug/...`
- `mergeWebsiteScope` includes documents without `websiteId` for the default site
- Plugin modules gated via `enabledModules`

## Alternatives Considered

- Database-per-site — rejected
- Required backfill of `websiteId` before deploy — rejected

## Future Notes

Domain-based site resolution and admin memberships can extend this model.
