import type { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../../middleware/adminAuth.js';
import { ForbiddenError, ValidationError } from '../../shared/errors/index.js';
import { successResponse } from '../../shared/http/response.js';
import { DEFAULT_WEBSITE_SLUG } from '../../shared/db/websiteScope.js';
import { configurationService, isValidNamespace } from './service.js';

export const configurationController = {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const namespace = req.params.namespace;
      if (!isValidNamespace(namespace)) {
        throw new ValidationError('Namespace must be social or webinar');
      }
      const data = await configurationService.get(namespace);
      res.json(successResponse(data, { requestId: req.requestId }));
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      // Adapters reuse global SocialSettings/WebinarSettings — writes only for default website
      // until per-website Configuration persistence exists (ADR-004).
      if (req.website?.slug !== DEFAULT_WEBSITE_SLUG) {
        throw new ForbiddenError(
          'Configuration writes are only supported for the default website until per-website settings persistence exists'
        );
      }

      const namespace = req.params.namespace;
      if (!isValidNamespace(namespace)) {
        throw new ValidationError('Namespace must be social or webinar');
      }
      const data = await configurationService.update(namespace, req.body);
      res.json(successResponse(data, { requestId: req.requestId }));
    } catch (err) {
      next(err);
    }
  },
};

export const configurationAdminAuth = adminAuth;
