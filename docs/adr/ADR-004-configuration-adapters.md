# ADR-004: Configuration Adapters

## Status

Accepted

## Context

V1 stores social and webinar settings in singleton collections. Introducing a new Configuration collection while V1 exists would require dual-writes.

## Decision

- Configuration is a **public API module** (namespaced: `social`, `webinar`)
- Persistence via **adapters** to existing `SocialSettings` / `WebinarSettings`
- **No new Configuration collection** until V1 is fully retired

## Consequences

- V1 and V2 share the same documents
- Future namespaces (SEO, theme, etc.) follow the same pattern or consolidate post-V1

## Alternatives Considered

- New Configuration collection with dual-write — rejected
- Leaving only V1 settings endpoints — rejected (no V2 surface)

## Future Notes

Physical consolidation only after V1 removal.
