import { ClubApplication } from '../../models/ClubApplication.js';
import { withPlatformFields } from '../../shared/entities/platform-entity.js';
import { mergeWebsiteScope, matchesWebsiteScope } from '../../shared/db/websiteScope.js';
import { withMongoFallback } from '../../shared/db/mongoFallback.js';
import type { PaginatedResult, PaginationParams } from '../../shared/http/pagination.js';

const memory: Array<Record<string, unknown>> = [];
let memoryId = 1;

function nextId() {
  return String(memoryId++);
}

function sortByCreatedAtDesc(items: Array<Record<string, unknown>>) {
  return [...items].sort((a, b) => {
    const aTime = new Date(String(a.createdAt || 0)).getTime();
    const bTime = new Date(String(b.createdAt || 0)).getTime();
    return bTime - aTime;
  });
}

export const applicationRepository = {
  async create(websiteId: string, data: Record<string, unknown>) {
    const payload = withPlatformFields({ ...data }, websiteId);
    return withMongoFallback(
      'createApplication',
      async () => {
        const doc = new ClubApplication(payload);
        await doc.save();
        return doc;
      },
      () => {
        const doc = { _id: nextId(), ...payload, createdAt: new Date(), updatedAt: new Date() };
        memory.unshift(doc);
        return doc;
      }
    );
  },

  async list(
    websiteId: string,
    pagination: PaginationParams
  ): Promise<PaginatedResult<unknown>> {
    const scope = mergeWebsiteScope(websiteId);
    return withMongoFallback(
      'listApplications',
      async () => {
        const [items, total] = await Promise.all([
          ClubApplication.find(scope)
            .sort({ createdAt: -1 })
            .skip(pagination.skip)
            .limit(pagination.limit),
          ClubApplication.countDocuments(scope),
        ]);
        return { items, total };
      },
      () => {
        const filtered = sortByCreatedAtDesc(
          memory.filter((d) => matchesWebsiteScope(d, websiteId))
        );
        return {
          items: filtered.slice(pagination.skip, pagination.skip + pagination.limit),
          total: filtered.length,
        };
      }
    );
  },

  async getById(websiteId: string, id: string) {
    return withMongoFallback(
      'getApplication',
      () => ClubApplication.findOne({ _id: id, ...mergeWebsiteScope(websiteId) }),
      () =>
        memory.find((d) => String(d._id) === id && matchesWebsiteScope(d, websiteId)) ?? null
    );
  },

  async update(websiteId: string, id: string, data: Record<string, unknown>) {
    return withMongoFallback(
      'updateApplication',
      () =>
        ClubApplication.findOneAndUpdate({ _id: id, ...mergeWebsiteScope(websiteId) }, data, {
          new: true,
        }),
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
