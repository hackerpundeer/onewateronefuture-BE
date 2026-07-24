import type { Request, Response, NextFunction } from 'express';
import { successResponse } from '../../shared/http/response.js';
import { contactService } from './service.js';

export const contactController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const contacts = await contactService.list(String(req.website!._id));
      res.json(successResponse(contacts, { requestId: req.requestId }));
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const contact = await contactService.getById(
        String(req.website!._id),
        req.params.id
      );
      res.json(successResponse(contact, { requestId: req.requestId }));
    } catch (err) {
      next(err);
    }
  },
};
