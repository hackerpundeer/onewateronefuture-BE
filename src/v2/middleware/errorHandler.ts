import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/index.js';
import { errorResponse } from '../../shared/http/response.js';

export function v2ErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const meta = { requestId: req.requestId };

  if (err instanceof AppError) {
    res
      .status(err.statusCode)
      .json(errorResponse(err.message, err.code, err.details, meta));
    return;
  }

  const message = err instanceof Error ? err.message : 'Internal server error';
  console.error('[V2 Error]', message, err);
  res.status(500).json(errorResponse(message, 'INTERNAL_ERROR', undefined, meta));
}
