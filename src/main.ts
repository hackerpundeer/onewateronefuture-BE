import 'dotenv/config';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './db.js';
import { seedDefaultAdmin } from './services/auth.js';
import { websiteService } from './modules/website/service.js';

export async function startServer() {
  await connectDatabase();
  await seedDefaultAdmin();
  await websiteService.seedDefault();

  const app = createApp();
  app.listen(env.port, '0.0.0.0', () => {
    console.log(`[Kangen Backend] Server running on http://0.0.0.0:${env.port}`);
  });
}
