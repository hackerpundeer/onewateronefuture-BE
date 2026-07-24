# Notification Module

## Purpose

Structural placeholder for future Email, SMS, WhatsApp, Push, and Webhooks.

## Current status

**Not implemented.** There is no notification delivery in production.

- Event name constants and ports exist for future wiring
- Domain modules do **not** currently publish or deliver notifications
- `shared/events/publisher.ts` exists as infrastructure; domain create flows do not call it yet

## Responsibilities (future)

- Consume business events published by domain modules
- Route events to configured channels per website
- Domain modules must never call email/SMS providers directly

## Scaffold files

- `notification.events.ts` / `events.ts` — event name constants
- `notification.types.ts` / `types.ts` — payload types
- `notification.ports.ts` / `ports.ts` — `NotificationPort`
- `README.md` — this document

## Future Roadmap

- Domain services publish events on create
- Outbox pattern
- Channel providers
- Templates and retries
