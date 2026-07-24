import type { AuditLogEntry } from './types.js';

export interface AuditLogPort {
  record(entry: Omit<AuditLogEntry, '_id' | 'createdAt'>): Promise<AuditLogEntry>;

  list(
    websiteId: string,
    filters?: { resourceType?: string; actorId?: string; limit?: number }
  ): Promise<AuditLogEntry[]>;
}
