import type { Types } from 'mongoose';

export interface AuditLogEntry {
  _id: Types.ObjectId | string;
  websiteId: Types.ObjectId | string;
  actorId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}
