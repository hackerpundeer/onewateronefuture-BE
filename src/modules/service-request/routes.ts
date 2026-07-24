import { Router } from 'express';
import { adminAuth } from '../../middleware/adminAuth.js';
import { publicPostRateLimit } from '../../v2/middleware/rateLimit.js';
import { serviceRequestController } from './controller.js';

export function serviceRequestRoutes(): Router {
  const router = Router({ mergeParams: true });

  router.post('/', publicPostRateLimit, serviceRequestController.create);
  router.get('/', adminAuth, serviceRequestController.list);
  router.get('/:id', adminAuth, serviceRequestController.getById);
  router.patch('/:id', adminAuth, serviceRequestController.update);

  return router;
}
