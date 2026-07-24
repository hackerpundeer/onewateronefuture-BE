import { ValidationError } from '../errors/index.js';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

export type PaginationParams = {
  page: number;
  limit: number;
  skip: number;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

/**
 * Parse page/limit from a query object.
 * Defaults: page=1, limit=20. Caps limit at MAX_LIMIT.
 */
export function parsePagination(
  query: Record<string, unknown>,
  options?: { defaultLimit?: number; maxLimit?: number }
): PaginationParams {
  const defaultLimit = options?.defaultLimit ?? DEFAULT_LIMIT;
  const maxLimit = options?.maxLimit ?? MAX_LIMIT;

  const pageRaw = query.page;
  const limitRaw = query.limit;

  let page = DEFAULT_PAGE;
  if (pageRaw !== undefined && pageRaw !== '') {
    const parsed = Number(pageRaw);
    if (!Number.isInteger(parsed) || parsed < 1) {
      throw new ValidationError('page must be a positive integer');
    }
    page = parsed;
  }

  let limit = defaultLimit;
  if (limitRaw !== undefined && limitRaw !== '') {
    const parsed = Number(limitRaw);
    if (!Number.isInteger(parsed) || parsed < 1) {
      throw new ValidationError('limit must be a positive integer');
    }
    limit = Math.min(parsed, maxLimit);
  }

  return { page, limit, skip: (page - 1) * limit };
}

export function buildPaginationMeta(
  params: Pick<PaginationParams, 'page' | 'limit'>,
  total: number
): PaginationMeta {
  return {
    page: params.page,
    limit: params.limit,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / params.limit),
  };
}

export type PaginatedResult<T> = {
  items: T[];
  total: number;
};
