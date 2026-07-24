import { Router } from 'express';
import { adminAuth } from '../../middleware/adminAuth.js';
import { contactController } from './controller.js';

export function contactRoutes(): Router {
  const router = Router({ mergeParams: true });

  router.get('/', adminAuth, contactController.list);
  router.get('/:id', adminAuth, contactController.getById);

  return router;
}
