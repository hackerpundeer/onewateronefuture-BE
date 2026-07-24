# Project Structure

```
onewateronefuture-BE/
├── src/
│   ├── index.ts              # esbuild entry → startServer
│   ├── main.ts               # connect, seed, listen
│   ├── app.ts                # createApp()
│   ├── config/env.ts
│   ├── db.ts                 # re-export connection
│   ├── v1/routes/index.ts    # registerV1Routes
│   ├── v2/
│   │   ├── routes.ts         # registerV2Routes
│   │   └── middleware/
│   ├── legacy/               # V1 store + validation
│   ├── shared/               # errors, http, db, events, entities
│   ├── modules/              # domain modules (website, contact, …)
│   ├── models/               # V1 mongoose models (unchanged names)
│   ├── middleware/adminAuth.ts
│   └── services/auth.ts
├── tests/smoke.test.ts
├── docs/
└── server.js                 # built output
```

## Module Layout

Each feature module under `src/modules/<name>/`:

```
controller.ts   # HTTP handlers
service.ts      # business logic
repository.ts   # persistence
routes.ts       # Express router factory
model.ts        # mongoose schema (when needed)
validators.ts   # zod schemas (V2)
types.ts
README.md
```
