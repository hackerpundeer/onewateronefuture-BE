import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { getCorsOrigins } from './config/env.js';
import { registerV1Routes } from './v1/routes/index.js';
import { registerV2Routes } from './v2/routes.js';
import { requestIdMiddleware } from './v2/middleware/requestId.js';

export function createApp() {
  const app = express();

  app.use(express.json());

  const origins = getCorsOrigins();
  app.use(origins ? cors({ origin: origins }) : cors());

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  app.use(requestIdMiddleware);

  registerV1Routes(app);
  registerV2Routes(app);

  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    if (res.headersSent) return;
    const message = err instanceof Error ? err.message : 'Internal server error';
    if (req.path.startsWith('/api/v2')) {
      res.status(500).json({
        data: null,
        error: { message, code: 'INTERNAL_ERROR' },
        meta: { requestId: req.requestId },
      });
      return;
    }
    res.status(500).json({ error: message });
  });

  return app;
}
