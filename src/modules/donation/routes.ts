import { Router } from 'express';
import { adminAuth } from '../../middleware/adminAuth.js';
import { publicPostRateLimit } from '../../v2/middleware/rateLimit.js';
import { donationController } from './controller.js';

/**
 * Mount under v2 website routes with `requireModule('donation')` middleware.
 */
export function donationRoutes(): Router {
  const router = Router({ mergeParams: true });

  router.post('/', publicPostRateLimit, donationController.create);
  router.get('/', adminAuth, donationController.list);

  return router;
}
