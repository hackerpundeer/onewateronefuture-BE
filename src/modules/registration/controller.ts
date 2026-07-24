import type { Request, Response, NextFunction } from 'express';
import { successResponse } from '../../shared/http/response.js';
import { registrationService } from './service.js';

export const registrationController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await registrationService.create(String(req.website!._id), req.body);
      res.status(201).json(successResponse(data, { requestId: req.requestId }));
    } catch (err) {
      next(err);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await registrationService.list(
        String(req.website!._id),
        req.query as Record<string, unknown>
      );
      res.json(
        successResponse(result.items, { requestId: req.requestId, ...result.pagination })
      );
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await registrationService.getById(String(req.website!._id), req.params.id);
      res.json(successResponse(data, { requestId: req.requestId }));
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await registrationService.update(
        String(req.website!._id),
        req.params.id,
        req.body
      );
      res.json(successResponse(data, { requestId: req.requestId }));
    } catch (err) {
      next(err);
    }
  },
};
