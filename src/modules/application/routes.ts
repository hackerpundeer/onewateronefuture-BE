import { Router } from 'express';
import { adminAuth } from '../../middleware/adminAuth.js';
import { publicPostRateLimit } from '../../v2/middleware/rateLimit.js';
import { applicationController } from './controller.js';

export function applicationRoutes(): Router {
  const router = Router({ mergeParams: true });

  router.post('/', publicPostRateLimit, applicationController.create);
  router.get('/', adminAuth, applicationController.list);
  router.get('/:id', adminAuth, applicationController.getById);
  router.patch('/:id', adminAuth, applicationController.update);

  return router;
}
