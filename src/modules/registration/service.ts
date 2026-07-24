import { NotFoundError, ValidationError } from '../../shared/errors/index.js';
import { pickAllowedFields } from '../../shared/http/allowlist.js';
import {
  buildPaginationMeta,
  parsePagination,
  type PaginatedResult,
  type PaginationMeta,
} from '../../shared/http/pagination.js';
import { findOrCreateContact } from '../contact/service.js';
import { registrationRepository } from './repository.js';
import { validateRegistrationCreate } from './validators.js';

export const REGISTRATION_PATCH_FIELDS = [
  'fullName',
  'city',
  'phone',
  'status',
  'source',
] as const;

export const registrationService = {
  async create(websiteId: string, body: Record<string, unknown>) {
    const error = validateRegistrationCreate(body);
    if (error) throw new ValidationError(error);

    const contact = await findOrCreateContact({
      websiteId,
      phone: body.phone ? String(body.phone) : undefined,
      name: body.fullName ? String(body.fullName) : undefined,
    });

    return registrationRepository.create(websiteId, {
      fullName: String(body.fullName).trim(),
      city: String(body.city).trim(),
      phone: String(body.phone).trim(),
      status: body.status ? String(body.status) : 'New',
      source: body.source ? String(body.source) : 'zoom_live_demo',
      contactId: contact._id,
    });
  },

  async list(
    websiteId: string,
    query: Record<string, unknown> = {}
  ): Promise<PaginatedResult<unknown> & { pagination: PaginationMeta }> {
    const pagination = parsePagination(query);
    const result = await registrationRepository.list(websiteId, pagination);
    return { ...result, pagination: buildPaginationMeta(pagination, result.total) };
  },

  async getById(websiteId: string, id: string) {
    const doc = await registrationRepository.getById(websiteId, id);
    if (!doc) throw new NotFoundError('Registration not found');
    return doc;
  },

  async update(websiteId: string, id: string, body: Record<string, unknown>) {
    const safe = pickAllowedFields(body, REGISTRATION_PATCH_FIELDS);
    const doc = await registrationRepository.update(websiteId, id, safe);
    if (!doc) throw new NotFoundError('Registration not found');
    return doc;
  },
};
