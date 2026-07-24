import type { Types } from 'mongoose';

export interface WebsiteRecord {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  domain: string;
  isActive: boolean;
  enabledModules: string[];
  configuration?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWebsiteInput {
  name: string;
  slug: string;
  domain?: string;
  isActive?: boolean;
  enabledModules?: string[];
  configuration?: Record<string, unknown>;
}
