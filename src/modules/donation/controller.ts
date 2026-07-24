import type { Request, Response, NextFunction } from 'express';
import { successResponse } from '../../shared/http/response.js';
import { donationService } from './service.js';

export const donationController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await donationService.create(String(req.website!._id), req.body);
      res.status(201).json(successResponse(data, { requestId: req.requestId }));
    } catch (err) {
      next(err);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await donationService.list(String(req.website!._id));
      res.json(successResponse(data, { requestId: req.requestId }));
    } catch (err) {
      next(err);
    }
  },
};
