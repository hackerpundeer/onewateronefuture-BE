import type { MediaAsset } from './types.js';

export interface MediaStoragePort {
  upload(
    websiteId: string,
    file: { buffer: Buffer; filename: string; mimeType: string }
  ): Promise<MediaAsset>;

  getById(websiteId: string, id: string): Promise<MediaAsset | null>;

  delete(websiteId: string, id: string): Promise<boolean>;
}
