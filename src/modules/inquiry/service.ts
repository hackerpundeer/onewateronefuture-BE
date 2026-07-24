import { NotFoundError, ValidationError } from '../../shared/errors/index.js';
import { pickAllowedFields } from '../../shared/http/allowlist.js';
import {
  buildPaginationMeta,
  parsePagination,
  type PaginatedResult,
  type PaginationMeta,
} from '../../shared/http/pagination.js';
import { findOrCreateContact } from '../contact/service.js';
import { inquiryRepository } from './repository.js';

export const INQUIRY_PATCH_FIELDS = [
  'name',
  'email',
  'phone',
  'model',
  'date',
  'status',
] as const;

export const inquiryService = {
  async create(websiteId: string, body: Record<string, unknown>) {
    if (!body.name || !body.email) throw new ValidationError('Name and email are required');

    const contact = await findOrCreateContact({
      websiteId,
      email: body.email ? String(body.email) : undefined,
      phone: body.phone ? String(body.phone) : undefined,
      name: body.name ? String(body.name) : undefined,
    });

    return inquiryRepository.create(websiteId, {
      name: String(body.name).trim(),
      email: String(body.email).trim(),
      phone: body.phone ? String(body.phone) : '',
      model: body.model ? String(body.model) : 'LeveLuk K8',
      date: body.date ? String(body.date) : '',
      status: body.status ? String(body.status) : 'New',
      contactId: contact._id,
    });
  },

  async list(
    websiteId: string,
    query: Record<string, unknown> = {}
  ): Promise<PaginatedResult<unknown> & { pagination: PaginationMeta }> {
    const pagination = parsePagination(query);
    const result = await inquiryRepository.list(websiteId, pagination);
    return { ...result, pagination: buildPaginationMeta(pagination, result.total) };
  },

  async getById(websiteId: string, id: string) {
    const doc = await inquiryRepository.getById(websiteId, id);
    if (!doc) throw new NotFoundError('Inquiry not found');
    return doc;
  },

  async update(websiteId: string, id: string, body: Record<string, unknown>) {
    const safe = pickAllowedFields(body, INQUIRY_PATCH_FIELDS);
    const doc = await inquiryRepository.update(websiteId, id, safe);
    if (!doc) throw new NotFoundError('Inquiry not found');
    return doc;
  },
};
