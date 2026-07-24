import type { Request, Response, NextFunction } from 'express';
import { successResponse } from '../../shared/http/response.js';
import { serviceRequestService } from './service.js';

export const serviceRequestController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await serviceRequestService.create(String(req.website!._id), req.body);
      res.status(201).json(successResponse(data, { requestId: req.requestId }));
    } catch (err) {
      next(err);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await serviceRequestService.list(
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
      const data = await serviceRequestService.getById(String(req.website!._id), req.params.id);
      res.json(successResponse(data, { requestId: req.requestId }));
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await serviceRequestService.update(
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
