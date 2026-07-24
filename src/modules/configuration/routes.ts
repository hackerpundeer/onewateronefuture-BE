import { Router } from 'express';
import { configurationAdminAuth, configurationController } from './controller.js';

export function configurationRoutes(): Router {
  const router = Router({ mergeParams: true });

  router.get('/:namespace', configurationController.get);
  router.put('/:namespace', configurationAdminAuth, configurationController.update);

  return router;
}
