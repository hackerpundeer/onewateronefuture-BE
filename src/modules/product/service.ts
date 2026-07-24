import { NotFoundError } from '../../shared/errors/index.js';
import { productRepository } from './repository.js';

export const productService = {
  async create(websiteId: string, body: Record<string, unknown>) {
    return productRepository.create(websiteId, body);
  },

  async list(websiteId: string, activeOnly = false) {
    return productRepository.list(websiteId, activeOnly);
  },

  async getById(websiteId: string, id: string, activeOnly = false) {
    const doc = await productRepository.getById(websiteId, id, activeOnly);
    if (!doc) throw new NotFoundError('Product not found');
    return doc;
  },

  async update(websiteId: string, id: string, body: Record<string, unknown>) {
    const doc = await productRepository.update(websiteId, id, body);
    if (!doc) throw new NotFoundError('Product not found');
    return doc;
  },

  async remove(websiteId: string, id: string) {
    const doc = await productRepository.softDelete(websiteId, id);
    if (!doc) throw new NotFoundError('Product not found');
    return doc;
  },
};
