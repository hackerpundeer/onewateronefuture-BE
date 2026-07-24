import { withPlatformFields } from '../../shared/entities/platform-entity.js';
import { mergeWebsiteScope, matchesWebsiteScope } from '../../shared/db/websiteScope.js';
import { withMongoFallback } from '../../shared/db/mongoFallback.js';
import type { PaginatedResult, PaginationParams } from '../../shared/http/pagination.js';
import { Donation } from './model.js';

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

export const donationRepository = {
  async create(websiteId: string, data: Record<string, unknown>) {
    const payload = withPlatformFields({ ...data }, websiteId);

    return withMongoFallback(
      'createDonation',
      async () => {
        const doc = new Donation(payload);
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
      'listDonations',
      async () => {
        const [items, total] = await Promise.all([
          Donation.find(scope)
            .sort({ createdAt: -1 })
            .skip(pagination.skip)
            .limit(pagination.limit),
          Donation.countDocuments(scope),
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
};
