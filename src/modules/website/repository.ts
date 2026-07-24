import { isMongoLive } from '../../db.js';
import { DEFAULT_WEBSITE_SLUG, setDefaultWebsiteId } from '../../shared/db/websiteScope.js';
import { Website, DEFAULT_ENABLED_MODULES } from './model.js';
import type { CreateWebsiteInput } from './types.js';

const memoryWebsites: Array<Record<string, unknown>> = [];

let memoryId = 1;

function nextMemoryId() {
  return String(memoryId++);
}

export const websiteRepository = {
  async findAll() {
    const live = await isMongoLive();
    if (!live) return memoryWebsites;
    return Website.find().sort({ createdAt: -1 });
  },

  async findBySlug(slug: string) {
    const live = await isMongoLive();
    if (!live) {
      return memoryWebsites.find((w) => w.slug === slug) ?? null;
    }
    return Website.findOne({ slug });
  },

  async create(data: CreateWebsiteInput) {
    const live = await isMongoLive();
    if (!live) {
      const doc = {
        _id: nextMemoryId(),
        ...data,
        domain: data.domain ?? '',
        isActive: data.isActive ?? true,
        enabledModules: data.enabledModules ?? [...DEFAULT_ENABLED_MODULES],
        configuration: data.configuration ?? {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryWebsites.unshift(doc);
      return doc;
    }
    const doc = new Website({
      ...data,
      enabledModules: data.enabledModules ?? [...DEFAULT_ENABLED_MODULES],
    });
    await doc.save();
    return doc;
  },

  async seedDefault() {
    const live = await isMongoLive();
    const seed = {
      name: 'One Water One Future',
      slug: DEFAULT_WEBSITE_SLUG,
      domain: '',
      isActive: true,
      enabledModules: [...DEFAULT_ENABLED_MODULES],
      configuration: {},
    };

    if (!live) {
      let existing = memoryWebsites.find((w) => w.slug === DEFAULT_WEBSITE_SLUG);
      if (!existing) {
        existing = {
          _id: nextMemoryId(),
          ...seed,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        memoryWebsites.unshift(existing);
      }
      setDefaultWebsiteId(String(existing._id));
      return;
    }

    let existing = await Website.findOne({ slug: DEFAULT_WEBSITE_SLUG });
    if (!existing) {
      existing = await Website.create(seed);
      console.log('Default website seeded: One Water One Future');
    }
    setDefaultWebsiteId(existing._id);
  },
};
