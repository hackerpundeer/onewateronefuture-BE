import { NotFoundError, ValidationError } from '../../shared/errors/index.js';
import { pickAllowedFields } from '../../shared/http/allowlist.js';
import {
  buildPaginationMeta,
  parsePagination,
  type PaginatedResult,
  type PaginationMeta,
} from '../../shared/http/pagination.js';
import { findOrCreateContact } from '../contact/service.js';
import { applicationRepository } from './repository.js';

export const APPLICATION_PATCH_FIELDS = [
  'fullName',
  'email',
  'phone',
  'country',
  'sponsorName',
  'interestType',
  'status',
] as const;

export const applicationService = {
  async create(websiteId: string, body: Record<string, unknown>) {
    if (!body.fullName || !body.email || !body.phone) {
      throw new ValidationError('Full name, email, and phone are required');
    }

    const contact = await findOrCreateContact({
      websiteId,
      email: body.email ? String(body.email) : undefined,
      phone: body.phone ? String(body.phone) : undefined,
      name: body.fullName ? String(body.fullName) : undefined,
    });

    return applicationRepository.create(websiteId, {
      fullName: String(body.fullName).trim(),
      email: String(body.email).trim(),
      phone: String(body.phone).trim(),
      country: body.country ? String(body.country) : '',
      sponsorName: body.sponsorName ? String(body.sponsorName) : '',
      interestType: body.interestType ? String(body.interestType) : 'both',
      status: body.status ? String(body.status) : 'Pending',
      contactId: contact._id,
    });
  },

  async list(
    websiteId: string,
    query: Record<string, unknown> = {}
  ): Promise<PaginatedResult<unknown> & { pagination: PaginationMeta }> {
    const pagination = parsePagination(query);
    const result = await applicationRepository.list(websiteId, pagination);
    return { ...result, pagination: buildPaginationMeta(pagination, result.total) };
  },

  async getById(websiteId: string, id: string) {
    const doc = await applicationRepository.getById(websiteId, id);
    if (!doc) throw new NotFoundError('Application not found');
    return doc;
  },

  async update(websiteId: string, id: string, body: Record<string, unknown>) {
    const safe = pickAllowedFields(body, APPLICATION_PATCH_FIELDS);
    const doc = await applicationRepository.update(websiteId, id, safe);
    if (!doc) throw new NotFoundError('Application not found');
    return doc;
  },
};
