# Dependency Rules

## Layering

```
routes → controller → service → repository → models
```

- **Routes** wire middleware and controllers only
- **Controllers** parse HTTP, call services, format responses
- **Services** contain business rules; no Express types
- **Repositories** handle MongoDB / memory fallback

## Import Direction

| From | May import |
|------|------------|
| `v1/` | `legacy/`, `models/`, `middleware/`, `services/`, `db` |
| `v2/` | `modules/`, `shared/`, `middleware/` |
| `modules/*` | `shared/`, `models/`, `legacy/` (configuration adapters only), other modules' **services** (sparingly) |
| `legacy/` | `models/`, `db` |
| `shared/` | nothing from `modules/` or `v1/` |

## Forbidden

- V1 routes importing V2 modules (except shared db helpers if needed)
- New Configuration collection (use SocialSettings/WebinarSettings adapters)
- Collection renames or required migrations
- Contact matching by name

## External Dependencies

- `express`, `mongoose`, `zod` (V2 validation)
- `helmet`, `express-rate-limit` (hardening)
- `bcryptjs`, `jsonwebtoken` (admin auth)
