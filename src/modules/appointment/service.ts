import { NotFoundError, ValidationError } from '../../shared/errors/index.js';
import { parseBookingListQuery } from '../../legacy/validation.js';
import { pickAllowedFields } from '../../shared/http/allowlist.js';
import {
  buildPaginationMeta,
  parsePagination,
  type PaginatedResult,
  type PaginationMeta,
} from '../../shared/http/pagination.js';
import { findOrCreateContact } from '../contact/service.js';
import { appointmentRepository } from './repository.js';
import { validateAppointmentCreate } from './validators.js';

export const APPOINTMENT_PATCH_FIELDS = [
  'fullName',
  'email',
  'phone',
  'country',
  'demoType',
  'preferredDate',
  'preferredTime',
  'message',
  'status',
  'intent',
  'sourceForm',
] as const;

export const appointmentService = {
  async create(websiteId: string, body: Record<string, unknown>) {
    const error = validateAppointmentCreate(body);
    if (error) throw new ValidationError(error);

    const contact = await findOrCreateContact({
      websiteId,
      email: body.email ? String(body.email) : undefined,
      phone: body.phone ? String(body.phone) : undefined,
      name: body.fullName ? String(body.fullName) : undefined,
    });

    return appointmentRepository.create(websiteId, {
      fullName: String(body.fullName).trim(),
      email: String(body.email).trim(),
      phone: String(body.phone).trim(),
      country: body.country ? String(body.country) : '',
      demoType: body.demoType ? String(body.demoType) : 'zoom',
      preferredDate: String(body.preferredDate).trim(),
      preferredTime: String(body.preferredTime).trim(),
      message: body.message ? String(body.message) : '',
      status: 'New',
      intent: body.intent ? String(body.intent) : 'demo',
      sourceForm: body.sourceForm ? String(body.sourceForm) : 'book-demo',
      contactId: contact._id,
    });
  },

  async list(
    websiteId: string,
    query: Record<string, unknown>
  ): Promise<PaginatedResult<unknown> & { pagination: PaginationMeta }> {
    const { filters, error } = parseBookingListQuery(query);
    if (error) throw new ValidationError(error);

    const pagination = parsePagination(query);
    const result = await appointmentRepository.list(websiteId, filters, pagination);
    return {
      ...result,
      pagination: buildPaginationMeta(pagination, result.total),
    };
  },

  async getById(websiteId: string, id: string) {
    const doc = await appointmentRepository.getById(websiteId, id);
    if (!doc) throw new NotFoundError('Appointment not found');
    return doc;
  },

  async update(websiteId: string, id: string, body: Record<string, unknown>) {
    const safe = pickAllowedFields(body, APPOINTMENT_PATCH_FIELDS);
    const doc = await appointmentRepository.update(websiteId, id, safe);
    if (!doc) throw new NotFoundError('Appointment not found');
    return doc;
  },

  async remove(websiteId: string, id: string) {
    const doc = await appointmentRepository.softDelete(websiteId, id);
    if (!doc) throw new NotFoundError('Appointment not found');
    return doc;
  },
};
