import type { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../../middleware/adminAuth.js';
import { ValidationError } from '../../shared/errors/index.js';
import { successResponse } from '../../shared/http/response.js';
import { websiteService } from './service.js';
import { createWebsiteSchema } from './validators.js';

export const websiteController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const websites = await websiteService.list();
      res.json(successResponse(websites, { requestId: _req.requestId }));
    } catch (err) {
      next(err);
    }
  },

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const website = await websiteService.getBySlug(req.params.slug);
      res.json(successResponse(website, { requestId: req.requestId }));
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createWebsiteSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid website payload', parsed.error.flatten());
      }
      const website = await websiteService.create(parsed.data);
      res.status(201).json(successResponse(website, { requestId: req.requestId }));
    } catch (err) {
      next(err);
    }
  },
};

export const websiteAdminAuth = adminAuth;
