import { Router } from 'express';
import { adminAuth } from '../../middleware/adminAuth.js';
import { publicPostRateLimit } from '../../v2/middleware/rateLimit.js';
import { inquiryController } from './controller.js';

export function inquiryRoutes(): Router {
  const router = Router({ mergeParams: true });
  router.post('/', publicPostRateLimit, inquiryController.create);
  router.get('/', adminAuth, inquiryController.list);
  router.get('/:id', adminAuth, inquiryController.getById);
  router.patch('/:id', adminAuth, inquiryController.update);
  return router;
}
