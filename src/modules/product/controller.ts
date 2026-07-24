import type { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../shared/errors/index.js';
import { successResponse } from '../../shared/http/response.js';
import { productService } from './service.js';
import { createProductSchema, updateProductSchema } from './validators.js';

export const productController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createProductSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid product payload', parsed.error.flatten());
      }
      const data = await productService.create(String(req.website!._id), parsed.data);
      res.status(201).json(successResponse(data, { requestId: req.requestId }));
    } catch (err) {
      next(err);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await productService.list(String(req.website!._id), true);
      res.json(successResponse(data, { requestId: req.requestId }));
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await productService.getById(String(req.website!._id), req.params.id, true);
      res.json(successResponse(data, { requestId: req.requestId }));
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = updateProductSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid product payload', parsed.error.flatten());
      }
      const data = await productService.update(
        String(req.website!._id),
        req.params.id,
        parsed.data
      );
      res.json(successResponse(data, { requestId: req.requestId }));
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await productService.remove(String(req.website!._id), req.params.id);
      res.json(successResponse(data, { requestId: req.requestId }));
    } catch (err) {
      next(err);
    }
  },
};
