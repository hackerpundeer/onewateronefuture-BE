import type { Request, Response, NextFunction } from 'express';
import { websiteService } from '../../modules/website/service.js';
import { NotFoundError } from '../../shared/errors/index.js';

declare global {
  namespace Express {
    interface Request {
      website?: Awaited<ReturnType<typeof websiteService.getBySlug>>;
    }
  }
}

export async function websiteContext(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const slug = req.params.slug;
    if (!slug) {
      return next(new NotFoundError('Website slug is required'));
    }
    const website = await websiteService.getBySlug(slug);
    if (!website || !website.isActive) {
      return next(new NotFoundError('Website not found'));
    }
    req.website = website;
    return next();
  } catch (err) {
    return next(err);
  }
}

export function requireModule(moduleName: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const enabled = req.website?.enabledModules ?? [];
    if (!enabled.includes(moduleName)) {
      return next(new NotFoundError(`Module "${moduleName}" is not enabled for this website`));
    }
    return next();
  };
}
