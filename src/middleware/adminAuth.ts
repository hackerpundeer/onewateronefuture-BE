import { Request, Response, NextFunction } from 'express';
import { verifyAdminToken, AdminPayload } from '../services/auth.js';

declare global {
  namespace Express {
    interface Request {
      admin?: AdminPayload;
    }
  }
}

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Admin authentication required' });
  }

  try {
    req.admin = verifyAdminToken(authHeader.slice(7));
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
