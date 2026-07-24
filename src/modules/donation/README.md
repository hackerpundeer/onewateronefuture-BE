# Donation Module

Optional plugin module for website-scoped donation intake.

## APIs

- `POST /api/v2/websites/:slug/donations` (public, rate-limited)
- `GET /api/v2/websites/:slug/donations` (admin)

## Mounting

Register in v2 routes behind `requireModule('donation')` so only websites with the donation module enabled expose these endpoints.

## Dependencies

- Donation model, websiteScope helper

## Future Roadmap

- Payment processor integration
- Notification events on `DONATION_CREATED`
