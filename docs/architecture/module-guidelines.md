# Module Guidelines

## Creating a Module

1. Add `src/modules/<name>/` with controller, service, repository, routes, README
2. Register routes in `src/v2/routes.ts` under `websites/:slug`
3. Add module key to `enabledModules` if plugin-gated
4. Use `withPlatformFields` on writes for `websiteId` + `schemaVersion`
5. Use `mergeWebsiteScope` on reads for legacy compatibility

## Contact Linking

On public creates with email/phone:

```typescript
const contact = await findOrCreateContact({ websiteId, email, phone, name });
// set contactId on the record
```

Match order: **email → phone → create new**. Never match on name.

## Response Format (V2)

```json
{
  "data": { },
  "error": null,
  "meta": { "requestId": "…" }
}
```

Errors use `next(err)` with `AppError` subclasses.

## README Template

Each module README must include:

- Purpose
- Responsibilities
- Public APIs
- Dependencies
- Future roadmap

## Testing

- Smoke tests in `tests/` using `node:test` + `supertest`
- V1 parity: do not change V1 response shapes without explicit migration
