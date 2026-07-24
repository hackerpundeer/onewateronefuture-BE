import { Router } from 'express';
import { adminAuth } from '../../middleware/adminAuth.js';
import { publicPostRateLimit } from '../../v2/middleware/rateLimit.js';
import { registrationController } from './controller.js';

export function registrationRoutes(): Router {
  const router = Router({ mergeParams: true });

  router.post('/', publicPostRateLimit, registrationController.create);
  router.get('/', adminAuth, registrationController.list);
  router.get('/:id', adminAuth, registrationController.getById);
  router.patch('/:id', adminAuth, registrationController.update);

  return router;
}
