import { Booking } from '../../models/Booking.js';
import { withPlatformFields } from '../../shared/entities/platform-entity.js';
import { mergeWebsiteScope, matchesWebsiteScope } from '../../shared/db/websiteScope.js';
import { withMongoFallback } from '../../shared/db/mongoFallback.js';
import type { BookingListFilters } from '../../legacy/validation.js';
import type { PaginatedResult, PaginationParams } from '../../shared/http/pagination.js';

const memoryAppointments: Array<Record<string, unknown>> = [];
let memoryId = 1;

function nextId() {
  return String(memoryId++);
}

/** Mirrors V1 legacy/store buildBookingQuery for preferredDate/status/isDeleted. */
export function buildAppointmentFilterQuery(
  filters: BookingListFilters
): Record<string, unknown> {
  const isDeleted = filters.isDeleted ?? false;
  const query: Record<string, unknown> = isDeleted
    ? { isDeleted: true }
    : { $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] };

  if (filters.status) query.status = filters.status;

  if (filters.from || filters.to) {
    const preferredDate: Record<string, string> = {};
    if (filters.from) preferredDate.$gte = filters.from;
    if (filters.to) preferredDate.$lte = filters.to;
    query.preferredDate = preferredDate;
  }

  return query;
}

export function matchesAppointmentFilters(
  doc: Record<string, unknown>,
  filters: BookingListFilters
): boolean {
  const isDeleted = filters.isDeleted ?? false;
  if (Boolean(doc.isDeleted) !== isDeleted) return false;
  if (filters.status && doc.status !== filters.status) return false;
  const preferredDate = String(doc.preferredDate || '');
  if (filters.from && preferredDate < filters.from) return false;
  if (filters.to && preferredDate > filters.to) return false;
  return true;
}

function sortByCreatedAtDesc(items: Array<Record<string, unknown>>) {
  return [...items].sort((a, b) => {
    const aTime = new Date(String(a.createdAt || 0)).getTime();
    const bTime = new Date(String(b.createdAt || 0)).getTime();
    return bTime - aTime;
  });
}

export const appointmentRepository = {
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

  async list(
    websiteId: string,
    filters: BookingListFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResult<unknown>> {
    const filterQuery = buildAppointmentFilterQuery(filters);
    const scope = mergeWebsiteScope(websiteId, filterQuery);

    return withMongoFallback(
      'listAppointments',
      async () => {
        const [items, total] = await Promise.all([
          Booking.find(scope)
            .sort({ createdAt: -1 })
            .skip(pagination.skip)
            .limit(pagination.limit),
          Booking.countDocuments(scope),
        ]);
        return { items, total };
      },
      () => {
        const filtered = sortByCreatedAtDesc(
          memoryAppointments.filter(
            (a) =>
              matchesWebsiteScope(a, websiteId) && matchesAppointmentFilters(a, filters)
          )
        );
        return {
          items: filtered.slice(pagination.skip, pagination.skip + pagination.limit),
          total: filtered.length,
        };
      }
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
    return withMongoFallback(
      'updateAppointment',
      () =>
        Booking.findOneAndUpdate({ _id: id, ...mergeWebsiteScope(websiteId) }, data, {
          new: true,
        }),
      () => {
        const idx = memoryAppointments.findIndex(
          (a) => String(a._id) === id && matchesWebsiteScope(a, websiteId)
        );
        if (idx === -1) return null;
        memoryAppointments[idx] = { ...memoryAppointments[idx], ...data, updatedAt: new Date() };
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

/** Test helper: seed in-memory appointments (dev/test only). */
export function __resetMemoryAppointmentsForTests(
  docs: Array<Record<string, unknown>> = []
) {
  memoryAppointments.length = 0;
  memoryAppointments.push(...docs);
  memoryId = docs.length + 1;
}
