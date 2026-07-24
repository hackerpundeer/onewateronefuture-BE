import { Booking } from '../../models/Booking.js';
import { withPlatformFields } from '../../shared/entities/platform-entity.js';
import { mergeWebsiteScope, matchesWebsiteScope } from '../../shared/db/websiteScope.js';
import { withMongoFallback } from '../../shared/db/mongoFallback.js';
import { parseBookingListQuery } from '../../legacy/validation.js';

const memoryAppointments: Array<Record<string, unknown>> = [];
let memoryId = 1;

function nextId() {
  return String(memoryId++);
}

export const appointmentRepository = {
  /** Persist a validated, contact-linked appointment payload. */
  async create(websiteId: string, data: Record<string, unknown>) {
    const payload = withPlatformFields({ ...data }, websiteId);

    return withMongoFallback(
      'createAppointment',
      async () => {
        const doc = new Booking(payload);
        await doc.save();
        return doc;
      },
      () => {
        const doc = { _id: nextId(), ...payload, createdAt: new Date(), updatedAt: new Date() };
        memoryAppointments.unshift(doc);
        return doc;
      }
    );
  },

  async list(websiteId: string, query: Record<string, unknown> = {}) {
    const { filters } = parseBookingListQuery(query);
    const scope = mergeWebsiteScope(websiteId, {
      ...(filters.isDeleted
        ? { isDeleted: true }
        : { $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] }),
      ...(filters.status ? { status: filters.status } : {}),
    });

    return withMongoFallback(
      'listAppointments',
      () => Booking.find(scope).sort({ createdAt: -1 }),
      () => memoryAppointments.filter((a) => matchesWebsiteScope(a, websiteId))
    );
  },

  async getById(websiteId: string, id: string) {
    return withMongoFallback(
      'getAppointment',
      () => Booking.findOne({ _id: id, ...mergeWebsiteScope(websiteId) }),
      () =>
        memoryAppointments.find(
          (a) => String(a._id) === id && matchesWebsiteScope(a, websiteId)
        ) ?? null
    );
  },

  async update(websiteId: string, id: string, data: Record<string, unknown>) {
    const { isDeleted: _d, deletedAt: _da, ...safe } = data;
    return withMongoFallback(
      'updateAppointment',
      () =>
        Booking.findOneAndUpdate({ _id: id, ...mergeWebsiteScope(websiteId) }, safe, {
          new: true,
        }),
      () => {
        const idx = memoryAppointments.findIndex(
          (a) => String(a._id) === id && matchesWebsiteScope(a, websiteId)
        );
        if (idx === -1) return null;
        memoryAppointments[idx] = { ...memoryAppointments[idx], ...safe, updatedAt: new Date() };
        return memoryAppointments[idx];
      }
    );
  },

  async softDelete(websiteId: string, id: string) {
    return withMongoFallback(
      'deleteAppointment',
      async () => {
        const existing = await Booking.findOne({ _id: id, ...mergeWebsiteScope(websiteId) });
        if (!existing || existing.isDeleted) return null;
        return Booking.findByIdAndUpdate(
          id,
          { isDeleted: true, deletedAt: new Date() },
          { new: true }
        );
      },
      () => {
        const idx = memoryAppointments.findIndex(
          (a) => String(a._id) === id && matchesWebsiteScope(a, websiteId)
        );
        if (idx === -1 || memoryAppointments[idx].isDeleted) return null;
        memoryAppointments[idx] = {
          ...memoryAppointments[idx],
          isDeleted: true,
          deletedAt: new Date(),
          updatedAt: new Date(),
        };
        return memoryAppointments[idx];
      }
    );
  },
};
