import { Router } from 'express';
import { adminAuth } from '../../middleware/adminAuth.js';
import { productController } from './controller.js';

export function productRoutes(): Router {
  const router = Router({ mergeParams: true });

  router.get('/', productController.list);
  router.get('/:id', productController.getById);
  router.post('/', adminAuth, productController.create);
  router.patch('/:id', adminAuth, productController.update);
  router.delete('/:id', adminAuth, productController.remove);

  return router;
}
