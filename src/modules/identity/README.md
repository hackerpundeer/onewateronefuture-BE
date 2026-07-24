# Identity

## Purpose

Admin authentication and identity for the platform (JWT login, token verification, admin seed).

## Responsibilities

- Admin login / JWT signing and verification
- Default admin seed from environment
- Future: website memberships and roles

## Public APIs

Currently exposed via V1:

- `POST /api/admin/login`
- `GET /api/admin/me`

Implementation lives in `src/services/auth.ts` and `src/middleware/adminAuth.ts` for V1 compatibility. This module documents the boundary; gradual move of auth into `modules/identity` may follow without breaking V1.

## Dependencies

- `models/Admin`
- `db`

## Future roadmap

- AdminWebsiteMembership (adminId, websiteId, role)
- Additive JWT claims
- Password rotation APIs
