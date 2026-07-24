import { NotFoundError, ValidationError } from '../../shared/errors/index.js';
import { pickAllowedFields } from '../../shared/http/allowlist.js';
import {
  buildPaginationMeta,
  parsePagination,
  type PaginatedResult,
  type PaginationMeta,
} from '../../shared/http/pagination.js';
import { findOrCreateContact } from '../contact/service.js';
import { serviceRequestRepository } from './repository.js';
import { validateServiceRequestCreate } from './validators.js';

export const SERVICE_REQUEST_PATCH_FIELDS = [
  'fullName',
  'address',
  'phone',
  'serviceType',
  'status',
] as const;

export const serviceRequestService = {
  async create(websiteId: string, body: Record<string, unknown>) {
    const error = validateServiceRequestCreate(body);
    if (error) throw new ValidationError(error);

    const contact = await findOrCreateContact({
      websiteId,
      phone: body.phone ? String(body.phone) : undefined,
      name: body.fullName ? String(body.fullName) : undefined,
    });

    return serviceRequestRepository.create(websiteId, {
      fullName: String(body.fullName).trim(),
      address: String(body.address).trim(),
      phone: String(body.phone).trim(),
      serviceType: String(body.serviceType).trim(),
      status: body.status ? String(body.status) : 'New',
      contactId: contact._id,
    });
  },

  async list(
    websiteId: string,
    query: Record<string, unknown> = {}
  ): Promise<PaginatedResult<unknown> & { pagination: PaginationMeta }> {
    const pagination = parsePagination(query);
    const result = await serviceRequestRepository.list(websiteId, pagination);
    return { ...result, pagination: buildPaginationMeta(pagination, result.total) };
  },

  async getById(websiteId: string, id: string) {
    const doc = await serviceRequestRepository.getById(websiteId, id);
    if (!doc) throw new NotFoundError('Service request not found');
    return doc;
  },

  async update(websiteId: string, id: string, body: Record<string, unknown>) {
    const safe = pickAllowedFields(body, SERVICE_REQUEST_PATCH_FIELDS);
    const doc = await serviceRequestRepository.update(websiteId, id, safe);
    if (!doc) throw new NotFoundError('Service request not found');
    return doc;
  },
};
