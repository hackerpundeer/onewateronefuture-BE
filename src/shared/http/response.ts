export interface V2ErrorBody {
  message: string;
  code?: string;
  details?: unknown;
}

export interface V2Meta {
  requestId?: string;
  [key: string]: unknown;
}

export interface V2Envelope<T> {
  data: T | null;
  error: V2ErrorBody | null;
  meta: V2Meta;
}

export function successResponse<T>(data: T, meta: V2Meta = {}): V2Envelope<T> {
  return { data, error: null, meta };
}

export function errorResponse(
  message: string,
  code?: string,
  details?: unknown,
  meta: V2Meta = {}
): V2Envelope<null> {
  return {
    data: null,
    error: { message, code, details },
    meta,
  };
}
