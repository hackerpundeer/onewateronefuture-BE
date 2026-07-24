# ADR-003: Contact Model

## Status

Accepted

## Context

Person data is duplicated across form collections. Not every person is a customer (attendees, volunteers, prospects, applicants).

## Decision

- Use **Contact** (not Customer) as shared person identity
- Soft-link via optional `contactId` on domain writes
- Matching priority: **email → phone**; **never merge by name**
- If identity is uncertain, create a new Contact
- False merges are worse than duplicates

## Consequences

- `contacts` collection with `websiteId` scoping
- Domain modules call `findOrCreateContact` on create flows

## Alternatives Considered

- Forced merge of historical collections — rejected
- Name-based matching — rejected

## Future Notes

Optional global (cross-website) Contact graph may be considered later with explicit consent rules.
