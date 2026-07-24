import { Router } from 'express';
import { websiteAdminAuth, websiteController } from './controller.js';

export function websiteRoutes(): Router {
  const router = Router();

  router.get('/', websiteController.list);
  router.get('/:slug', websiteController.getBySlug);
  router.post('/', websiteAdminAuth, websiteController.create);

  return router;
}
