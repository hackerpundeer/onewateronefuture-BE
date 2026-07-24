import { Lead } from '../../models/Lead.js';
import { withPlatformFields } from '../../shared/entities/platform-entity.js';
import { mergeWebsiteScope, matchesWebsiteScope } from '../../shared/db/websiteScope.js';
import { withMongoFallback } from '../../shared/db/mongoFallback.js';

const memory: Array<Record<string, unknown>> = [];
let memoryId = 1;

export const inquiryRepository = {
  async create(websiteId: string, data: Record<string, unknown>) {
    const payload = withPlatformFields({ ...data }, websiteId);
    return withMongoFallback(
      'createInquiry',
      async () => {
        const doc = new Lead(payload);
        await doc.save();
        return doc;
      },
      () => {
        const doc = {
          _id: String(memoryId++),
          ...payload,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        memory.unshift(doc);
        return doc;
      }
    );
  },

  async list(websiteId: string) {
    return withMongoFallback(
      'listInquiries',
      () => Lead.find(mergeWebsiteScope(websiteId)).sort({ createdAt: -1 }),
      () => memory.filter((d) => matchesWebsiteScope(d, websiteId))
    );
  },

  async getById(websiteId: string, id: string) {
    return withMongoFallback(
      'getInquiry',
      () => Lead.findOne({ _id: id, ...mergeWebsiteScope(websiteId) }),
      () =>
        memory.find((d) => String(d._id) === id && matchesWebsiteScope(d, websiteId)) ?? null
    );
  },

  async update(websiteId: string, id: string, data: Record<string, unknown>) {
    return withMongoFallback(
      'updateInquiry',
      () => Lead.findOneAndUpdate({ _id: id, ...mergeWebsiteScope(websiteId) }, data, { new: true }),
      () => {
        const idx = memory.findIndex(
          (d) => String(d._id) === id && matchesWebsiteScope(d, websiteId)
        );
        if (idx === -1) return null;
        memory[idx] = { ...memory[idx], ...data, updatedAt: new Date() };
        return memory[idx];
      }
    );
  },
};
