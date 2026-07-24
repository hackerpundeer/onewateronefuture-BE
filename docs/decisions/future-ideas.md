# Future Ideas

Ideas captured for post-V2 work. Not committed scope.

## Platform

- Per-website admin roles and RBAC
- API keys for headless integrations
- GraphQL read layer for admin dashboard

## Contacts & CRM

- Admin merge UI for duplicate contacts
- Activity timeline across appointments, inquiries, donations

## Plugins

- Payment gateway integration for donations
- Event ticketing module
- Membership subscriptions

## Infrastructure

- Redis-backed rate limiting
- BullMQ job queue for notifications
- S3 media storage implementation
- Structured audit log to separate collection

## Observability

- OpenTelemetry tracing (requestId → traceId)
- Prometheus metrics endpoint

## Data

- Optional backfill: set `websiteId` on all legacy records
- Archival policy for soft-deleted appointments
