# Implementation Checklist

## Foundation

- [x] `createApp()` composition
- [x] `main.ts` boot + seed website + seed admin
- [x] `src/index.ts` esbuild entry
- [x] V1 routes extracted unchanged
- [x] Legacy store/validation moved
- [x] Shared errors, response envelope, events, websiteScope

## Modules

- [x] Website
- [x] Contact (findOrCreate rules)
- [x] Configuration (adapters)
- [x] Appointment
- [x] Inquiry
- [x] Application
- [x] Service Request
- [x] Registration
- [x] Product
- [x] Donation (plugin gated)
- [x] Media / Notification / Audit scaffolds

## Hardening

- [x] helmet
- [x] express-rate-limit on public V2 POSTs
- [x] CORS from `FRONTEND_URL`
- [x] Indexes (Website.slug, Contact, Product)
- [x] V1 deprecation doc

## Quality

- [x] `npm run lint` passes
- [x] `npm test` passes
- [x] `npm run build` → `server.js`
