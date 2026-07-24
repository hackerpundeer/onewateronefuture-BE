# Appointment Module

## Purpose

Website-scoped demo bookings (adapter over V1 `bookings` collection).

## Responsibilities

- Public create with contact linking
- Admin list/get/patch/delete
- Additive V2 fields: `websiteId`, `intent`, `sourceForm`, `contactId`, `schemaVersion`

## Public APIs

- `POST /api/v2/websites/:slug/appointments`
- `GET/PATCH/DELETE /api/v2/websites/:slug/appointments/:id` (admin)

## Dependencies

- Booking model, Contact findOrCreate, websiteScope helper

## Future Roadmap

- Calendar integrations
- Automated reminders via notification module
