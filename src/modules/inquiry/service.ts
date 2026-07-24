import { NotFoundError, ValidationError } from '../../shared/errors/index.js';
import { findOrCreateContact } from '../contact/service.js';
import { inquiryRepository } from './repository.js';

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

  async list(websiteId: string) {
    return inquiryRepository.list(websiteId);
  },

  async getById(websiteId: string, id: string) {
    const doc = await inquiryRepository.getById(websiteId, id);
    if (!doc) throw new NotFoundError('Inquiry not found');
    return doc;
  },

  async update(websiteId: string, id: string, body: Record<string, unknown>) {
    const doc = await inquiryRepository.update(websiteId, id, body);
    if (!doc) throw new NotFoundError('Inquiry not found');
    return doc;
  },
};
