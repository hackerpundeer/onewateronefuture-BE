import type { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../../middleware/adminAuth.js';
import { successResponse } from '../../shared/http/response.js';
import { appointmentService } from './service.js';

export const appointmentController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const appointment = await appointmentService.create(String(req.website!._id), req.body);
      res.status(201).json(successResponse(appointment, { requestId: req.requestId }));
    } catch (err) {
      next(err);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const appointments = await appointmentService.list(
        String(req.website!._id),
        req.query as Record<string, unknown>
      );
      res.json(successResponse(appointments, { requestId: req.requestId }));
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const appointment = await appointmentService.getById(
        String(req.website!._id),
        req.params.id
      );
      res.json(successResponse(appointment, { requestId: req.requestId }));
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const appointment = await appointmentService.update(
        String(req.website!._id),
        req.params.id,
        req.body
      );
      res.json(successResponse(appointment, { requestId: req.requestId }));
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const appointment = await appointmentService.remove(
        String(req.website!._id),
        req.params.id
      );
      res.json(successResponse(appointment, { requestId: req.requestId }));
    } catch (err) {
      next(err);
    }
  },
};

export const appointmentAdminAuth = adminAuth;
