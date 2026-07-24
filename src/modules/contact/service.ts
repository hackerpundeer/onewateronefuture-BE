import { NotFoundError } from '../../shared/errors/index.js';
import {
  buildPaginationMeta,
  parsePagination,
  type PaginatedResult,
  type PaginationMeta,
} from '../../shared/http/pagination.js';
import { contactRepository } from './repository.js';
import type { FindOrCreateContactInput } from './types.js';

function normalizeEmail(email?: string) {
  return email?.trim().toLowerCase() || '';
}

function normalizePhone(phone?: string) {
  return phone?.trim() || '';
}

/**
 * Contact identity: email → phone → create. Never match by name.
 * False merges are worse than duplicates.
 */
export async function findOrCreateContact(input: FindOrCreateContactInput) {
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);
  const websiteId = String(input.websiteId);

  if (email) {
    const byEmail = await contactRepository.findByEmail(websiteId, email);
    if (byEmail) return byEmail;
  }

  if (phone) {
    const byPhone = await contactRepository.findByPhone(websiteId, phone);
    if (byPhone) return byPhone;
  }

  return contactRepository.create({
    websiteId,
    email,
    phone,
    name: input.name?.trim() || '',
  });
}

export const contactService = {
  async list(
    websiteId: string,
    query: Record<string, unknown> = {}
  ): Promise<PaginatedResult<unknown> & { pagination: PaginationMeta }> {
    const pagination = parsePagination(query);
    const result = await contactRepository.listByWebsite(websiteId, pagination);
    return { ...result, pagination: buildPaginationMeta(pagination, result.total) };
  },

  async getById(websiteId: string, id: string) {
    const contact = await contactRepository.findById(websiteId, id);
    if (!contact) {
      throw new NotFoundError('Contact not found');
    }
    return contact;
  },

  findOrCreate: findOrCreateContact,
};
