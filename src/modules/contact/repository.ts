import { isMongoLive } from '../../db.js';
import { Contact } from './model.js';

const memoryContacts: Array<Record<string, unknown>> = [];
let memoryId = 1;

function normalizeEmail(email?: string) {
  return email?.trim().toLowerCase() || '';
}

function normalizePhone(phone?: string) {
  return phone?.trim() || '';
}

export const contactRepository = {
  async findById(websiteId: string, id: string) {
    const live = await isMongoLive();
    if (!live) {
      return (
        memoryContacts.find(
          (c) => String(c._id) === id && String(c.websiteId) === String(websiteId)
        ) ?? null
      );
    }
    return Contact.findOne({ _id: id, websiteId });
  },

  async listByWebsite(websiteId: string) {
    const live = await isMongoLive();
    if (!live) {
      return memoryContacts.filter((c) => String(c.websiteId) === String(websiteId));
    }
    return Contact.find({ websiteId }).sort({ createdAt: -1 });
  },

  async findByEmail(websiteId: string, email: string) {
    const normalized = normalizeEmail(email);
    if (!normalized) return null;
    const live = await isMongoLive();
    if (!live) {
      return (
        memoryContacts.find(
          (c) =>
            String(c.websiteId) === String(websiteId) &&
            normalizeEmail(String(c.email)) === normalized
        ) ?? null
      );
    }
    return Contact.findOne({ websiteId, email: normalized });
  },

  async findByPhone(websiteId: string, phone: string) {
    const normalized = normalizePhone(phone);
    if (!normalized) return null;
    const live = await isMongoLive();
    if (!live) {
      return (
        memoryContacts.find(
          (c) =>
            String(c.websiteId) === String(websiteId) &&
            normalizePhone(String(c.phone)) === normalized
        ) ?? null
      );
    }
    return Contact.findOne({ websiteId, phone: normalized });
  },

  async create(data: {
    websiteId: string;
    email: string;
    phone: string;
    name: string;
  }) {
    const live = await isMongoLive();
    if (!live) {
      const doc = {
        _id: String(memoryId++),
        ...data,
        schemaVersion: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryContacts.unshift(doc);
      return doc;
    }
    const doc = new Contact(data);
    await doc.save();
    return doc;
  },
};

