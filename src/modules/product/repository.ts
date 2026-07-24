import { withPlatformFields } from '../../shared/entities/platform-entity.js';
import { mergeWebsiteScope, matchesWebsiteScope } from '../../shared/db/websiteScope.js';
import { withMongoFallback } from '../../shared/db/mongoFallback.js';
import { Product } from './model.js';

const memory: Array<Record<string, unknown>> = [];
let memoryId = 1;

function nextId() {
  return String(memoryId++);
}

export const productRepository = {
  async create(websiteId: string, body: Record<string, unknown>) {
    const payload = withPlatformFields(
      {
        name: String(body.name).trim(),
        slug: String(body.slug).trim(),
        description: body.description ? String(body.description) : '',
        price: Number(body.price),
        currency: body.currency ? String(body.currency) : 'USD',
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      },
      websiteId
    );

    return withMongoFallback(
      'createProduct',
      async () => {
        const doc = new Product(payload);
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

  async list(websiteId: string, activeOnly = false) {
    const scope = mergeWebsiteScope(
      websiteId,
      activeOnly ? { isActive: true } : {}
    );

    return withMongoFallback(
      'listProducts',
      () => Product.find(scope).sort({ createdAt: -1 }),
      () => {
        let items = memory.filter((d) => matchesWebsiteScope(d, websiteId));
        if (activeOnly) {
          items = items.filter((d) => d.isActive === true);
        }
        return items;
      }
    );
  },

  async getById(websiteId: string, id: string, activeOnly = false) {
    const scope = mergeWebsiteScope(
      websiteId,
      activeOnly ? { _id: id, isActive: true } : { _id: id }
    );

    return withMongoFallback(
      'getProduct',
      () => Product.findOne(scope),
      () => {
        const doc =
          memory.find((d) => String(d._id) === id && matchesWebsiteScope(d, websiteId)) ?? null;
        if (!doc) return null;
        if (activeOnly && !doc.isActive) return null;
        return doc;
      }
    );
  },

  async update(websiteId: string, id: string, data: Record<string, unknown>) {
    return withMongoFallback(
      'updateProduct',
      () => Product.findOneAndUpdate({ _id: id, ...mergeWebsiteScope(websiteId) }, data, { new: true }),
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

  async softDelete(websiteId: string, id: string) {
    return withMongoFallback(
      'deleteProduct',
      () =>
        Product.findOneAndUpdate(
          { _id: id, ...mergeWebsiteScope(websiteId) },
          { isActive: false },
          { new: true }
        ),
      () => {
        const idx = memory.findIndex(
          (d) => String(d._id) === id && matchesWebsiteScope(d, websiteId)
        );
        if (idx === -1) return null;
        memory[idx] = { ...memory[idx], isActive: false, updatedAt: new Date() };
        return memory[idx];
      }
    );
  },
};
