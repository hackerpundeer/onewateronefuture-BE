import { ConflictError, NotFoundError } from '../../shared/errors/index.js';
import { websiteRepository } from './repository.js';
import type { CreateWebsiteInput } from './types.js';

export const websiteService = {
  async list() {
    return websiteRepository.findAll();
  },

  async getBySlug(slug: string) {
    const website = await websiteRepository.findBySlug(slug);
    if (!website) {
      throw new NotFoundError('Website not found');
    }
    return website;
  },

  async create(input: CreateWebsiteInput) {
    const existing = await websiteRepository.findBySlug(input.slug);
    if (existing) {
      throw new ConflictError('Website slug already exists');
    }
    return websiteRepository.create(input);
  },

  async seedDefault() {
    return websiteRepository.seedDefault();
  },
};
