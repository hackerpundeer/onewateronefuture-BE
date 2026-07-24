import type { NotificationPayload, NotificationResult } from './types.js';

export interface NotificationPort {
  send(payload: NotificationPayload): Promise<NotificationResult[]>;
}
