import type { Types } from 'mongoose';

export interface MediaAsset {
  _id: Types.ObjectId | string;
  websiteId: Types.ObjectId | string;
  filename: string;
  mimeType: string;
  url: string;
  sizeBytes: number;
  createdAt: Date;
  updatedAt: Date;
}
