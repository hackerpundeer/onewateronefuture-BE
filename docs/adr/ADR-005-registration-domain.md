# ADR-005: Registration Domain

## Status

Accepted

## Context

V1 exposes webinar registrations. Naming the module `Event` conflates the webinar itself with user participation.

## Decision

- Domain module is **Registration** (participation)
- Maps to existing `webinarregistrations` collection
- Schedule/links live under Configuration (`webinar` namespace)
- Reserve **Event** for a future entity that owns the webinar/live session (`Event → Registration`)

## Consequences

- Clearer domain language
- V2 path: `/api/v2/websites/:slug/registrations`

## Alternatives Considered

- Name module `Event` — rejected (wrong abstraction)
- Polymorphic FormSubmission collection — rejected

## Future Notes

Introduce Event module when multiple concurrent webinars/courses need first-class scheduling.
