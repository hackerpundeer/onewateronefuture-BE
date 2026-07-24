import type { Types } from 'mongoose';

export interface FindOrCreateContactInput {
  websiteId: Types.ObjectId | string;
  email?: string;
  phone?: string;
  name?: string;
}

export interface ContactRecord {
  _id: Types.ObjectId;
  websiteId: Types.ObjectId;
  email: string;
  phone: string;
  name: string;
}
