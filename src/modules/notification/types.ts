export interface NotificationPayload {
  websiteId: string;
  event: string;
  data: Record<string, unknown>;
  recipients?: string[];
}

export interface NotificationResult {
  success: boolean;
  channel: string;
  messageId?: string;
  error?: string;
}
