import { ValidationError } from '../../shared/errors/index.js';
import { findOrCreateContact } from '../contact/service.js';
import { donationRepository } from './repository.js';

export const donationService = {
  async create(websiteId: string, body: Record<string, unknown>) {
    if (body.amount === undefined || body.amount === null || Number(body.amount) <= 0) {
      throw new ValidationError('A positive donation amount is required');
    }

    const contact = await findOrCreateContact({
      websiteId,
      email: body.donorEmail ? String(body.donorEmail) : undefined,
      phone: body.donorPhone ? String(body.donorPhone) : undefined,
      name: body.donorName ? String(body.donorName) : undefined,
    });

    return donationRepository.create(websiteId, {
      amount: Number(body.amount),
      currency: body.currency ? String(body.currency) : 'USD',
      donorName: body.donorName ? String(body.donorName) : '',
      donorEmail: body.donorEmail ? String(body.donorEmail) : '',
      donorPhone: body.donorPhone ? String(body.donorPhone) : '',
      message: body.message ? String(body.message) : '',
      status: body.status ? String(body.status) : 'pending',
      contactId: contact._id,
    });
  },

  async list(websiteId: string) {
    return donationRepository.list(websiteId);
  },
};
