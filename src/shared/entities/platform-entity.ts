import type { Types } from 'mongoose';

export const CURRENT_SCHEMA_VERSION = 2;

export interface PlatformEntityFields {
  websiteId?: Types.ObjectId | string;
  schemaVersion?: number;
  createdAt?: Date;
  updatedAt?: Date;
  /** Optional soft-delete — module-dependent */
  isDeleted?: boolean;
  deletedAt?: Date | null;
}

export function withPlatformFields<T extends Record<string, unknown>>(
  data: T,
  websiteId: Types.ObjectId | string
): T & PlatformEntityFields {
  return {
    ...data,
    websiteId,
    schemaVersion: CURRENT_SCHEMA_VERSION,
  };
}
