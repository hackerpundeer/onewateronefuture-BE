import { Router } from 'express';
import { publicPostRateLimit } from '../../v2/middleware/rateLimit.js';
import { appointmentAdminAuth, appointmentController } from './controller.js';

export function appointmentRoutes(): Router {
  const router = Router({ mergeParams: true });

  router.post('/', publicPostRateLimit, appointmentController.create);
  router.get('/', appointmentAdminAuth, appointmentController.list);
  router.get('/:id', appointmentAdminAuth, appointmentController.getById);
  router.patch('/:id', appointmentAdminAuth, appointmentController.update);
  router.delete('/:id', appointmentAdminAuth, appointmentController.remove);

  return router;
}
