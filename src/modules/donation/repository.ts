import { withPlatformFields } from '../../shared/entities/platform-entity.js';
import { mergeWebsiteScope, matchesWebsiteScope } from '../../shared/db/websiteScope.js';
import { withMongoFallback } from '../../shared/db/mongoFallback.js';
import { Donation } from './model.js';

const memory: Array<Record<string, unknown>> = [];
let memoryId = 1;

function nextId() {
  return String(memoryId++);
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

  async list(websiteId: string) {
    return withMongoFallback(
      'listDonations',
      () => Donation.find(mergeWebsiteScope(websiteId)).sort({ createdAt: -1 }),
      () => memory.filter((d) => matchesWebsiteScope(d, websiteId))
    );
  },
};
