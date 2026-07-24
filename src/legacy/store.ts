import { isMongoLive, markMongoDisconnected } from '../db.js';
import { Booking } from '../models/Booking.js';
import { ClubApplication } from '../models/ClubApplication.js';
import { Lead } from '../models/Lead.js';
import { ServiceRequest } from '../models/ServiceRequest.js';
import { WebinarRegistration } from '../models/WebinarRegistration.js';
import { WebinarSettings } from '../models/WebinarSettings.js';
import { SocialSettings } from '../models/SocialSettings.js';
import type { BookingListFilters } from './validation.js';

const memoryBookings: Record<string, unknown>[] = [];
const memoryApplications: Record<string, unknown>[] = [];
const memoryLeads: Record<string, unknown>[] = [];
const memoryServiceRequests: Record<string, unknown>[] = [];
const memoryWebinarRegistrations: Record<string, unknown>[] = [];

export const DEFAULT_WEBINAR_SETTINGS = {
  slug: 'live-demo',
  zoomUrl:
    'https://us06web.zoom.us/j/88000074852?pwd=IcsNbGCDaZMqQls3mqc1IVY6lsB5Jw.1',
  dailyStartTime: '20:00',
  timezone: 'Asia/Kolkata',
  liveDurationMinutes: 45,
  unlockMinutesBefore: 30,
  scheduleLabel: 'Daily: 8:00 PM IST',
  meetingObjective:
    'We demonstrate the Enagic machine in real-time, explaining pH testing, negative ORP antioxidant properties, pesticide micro-clustering, and the detailed 8-Point commission model.',
  isEnabled: true,
};

let memoryWebinarSettings: Record<string, unknown> = {
  _id: 'live-demo',
  ...DEFAULT_WEBINAR_SETTINGS,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const DEFAULT_SOCIAL_SETTINGS = {
  slug: 'distributor-social',
  facebookUrl: '',
  instagramUrl: '',
  showFacebook: false,
  showInstagram: false,
};

let memorySocialSettings: Record<string, unknown> = {
  _id: 'distributor-social',
  ...DEFAULT_SOCIAL_SETTINGS,
  createdAt: new Date(),
  updatedAt: new Date(),
};

let idCounter = 1;

function nextId() {
  return String(idCounter++);
}

function withId(doc: Record<string, unknown>) {
  const id = nextId();
  return { _id: id, ...doc, createdAt: new Date(), updatedAt: new Date() };
}

async function withMongo<T>(
  label: string,
  mongoFn: () => Promise<T>,
  memoryFn: () => T
): Promise<T> {
  const live = await isMongoLive();
  if (!live) {
    return memoryFn();
  }

  try {
    return await mongoFn();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'MongoDB operation failed';
    console.warn(`MongoDB ${label} failed: ${message}`);
    markMongoDisconnected(message);

    if (process.env.NODE_ENV === 'production') {
      throw err;
    }

    return memoryFn();
  }
}

export async function createBooking(data: Record<string, unknown>) {
  return withMongo(
    'createBooking',
    async () => {
      const doc = new Booking(data);
      await doc.save();
      return doc;
    },
    () => {
      const doc = withId(data);
      memoryBookings.unshift(doc);
      return doc;
    }
  );
}

function buildBookingQuery(filters: BookingListFilters = { isDeleted: false }) {
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

function filterMemoryBookings(filters: BookingListFilters = { isDeleted: false }) {
  const isDeleted = filters.isDeleted ?? false;
  return memoryBookings.filter((booking) => {
    if (Boolean(booking.isDeleted) !== isDeleted) return false;
    if (filters.status && booking.status !== filters.status) return false;
    const preferredDate = String(booking.preferredDate || '');
    if (filters.from && preferredDate < filters.from) return false;
    if (filters.to && preferredDate > filters.to) return false;
    return true;
  });
}

export async function listBookings(filters: BookingListFilters = { isDeleted: false }) {
  const query = buildBookingQuery(filters);
  return withMongo(
    'listBookings',
    () => Booking.find(query).sort({ createdAt: -1 }),
    () => filterMemoryBookings(filters)
  );
}

function stripBookingDeleteFields(data: Record<string, unknown>) {
  const { isDeleted: _isDeleted, deletedAt: _deletedAt, ...safe } = data;
  return safe;
}

export async function updateBooking(id: string, data: Record<string, unknown>) {
  const safeData = stripBookingDeleteFields(data);
  return withMongo(
    'updateBooking',
    () => Booking.findByIdAndUpdate(id, safeData, { new: true }),
    () => {
      const idx = memoryBookings.findIndex((b) => b._id === id);
      if (idx === -1) return null;
      memoryBookings[idx] = { ...memoryBookings[idx], ...safeData, updatedAt: new Date() };
      return memoryBookings[idx];
    }
  );
}

export async function softDeleteBooking(id: string) {
  return withMongo(
    'softDeleteBooking',
    async () => {
      const existing = await Booking.findById(id);
      if (!existing || existing.isDeleted) return null;
      return Booking.findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true }
      );
    },
    () => {
      const idx = memoryBookings.findIndex((b) => b._id === id);
      if (idx === -1 || memoryBookings[idx].isDeleted) return null;
      memoryBookings[idx] = {
        ...memoryBookings[idx],
        isDeleted: true,
        deletedAt: new Date(),
        updatedAt: new Date(),
      };
      return memoryBookings[idx];
    }
  );
}

export async function createClubApplication(data: Record<string, unknown>) {
  return withMongo(
    'createClubApplication',
    async () => {
      const doc = new ClubApplication(data);
      await doc.save();
      return doc;
    },
    () => {
      const doc = withId(data);
      memoryApplications.unshift(doc);
      return doc;
    }
  );
}

export async function listClubApplications() {
  return withMongo(
    'listClubApplications',
    () => ClubApplication.find().sort({ createdAt: -1 }),
    () => memoryApplications
  );
}

export async function updateClubApplication(id: string, data: Record<string, unknown>) {
  return withMongo(
    'updateClubApplication',
    () => ClubApplication.findByIdAndUpdate(id, data, { new: true }),
    () => {
      const idx = memoryApplications.findIndex((a) => a._id === id);
      if (idx === -1) return null;
      memoryApplications[idx] = { ...memoryApplications[idx], ...data, updatedAt: new Date() };
      return memoryApplications[idx];
    }
  );
}

export async function createLead(data: Record<string, unknown>) {
  return withMongo(
    'createLead',
    async () => {
      const doc = new Lead(data);
      await doc.save();
      return doc;
    },
    () => {
      const doc = withId(data);
      memoryLeads.unshift(doc);
      return doc;
    }
  );
}

export async function listLeads() {
  return withMongo(
    'listLeads',
    () => Lead.find().sort({ createdAt: -1 }),
    () => memoryLeads
  );
}

export async function updateLead(id: string, data: Record<string, unknown>) {
  return withMongo(
    'updateLead',
    () => Lead.findByIdAndUpdate(id, data, { new: true }),
    () => {
      const idx = memoryLeads.findIndex((l) => l._id === id);
      if (idx === -1) return null;
      memoryLeads[idx] = { ...memoryLeads[idx], ...data, updatedAt: new Date() };
      return memoryLeads[idx];
    }
  );
}

export async function createServiceRequest(data: Record<string, unknown>) {
  return withMongo(
    'createServiceRequest',
    async () => {
      const doc = new ServiceRequest(data);
      await doc.save();
      return doc;
    },
    () => {
      const doc = withId(data);
      memoryServiceRequests.unshift(doc);
      return doc;
    }
  );
}

export async function listServiceRequests() {
  return withMongo(
    'listServiceRequests',
    () => ServiceRequest.find().sort({ createdAt: -1 }),
    () => memoryServiceRequests
  );
}

export async function updateServiceRequest(id: string, data: Record<string, unknown>) {
  return withMongo(
    'updateServiceRequest',
    () => ServiceRequest.findByIdAndUpdate(id, data, { new: true }),
    () => {
      const idx = memoryServiceRequests.findIndex((request) => request._id === id);
      if (idx === -1) return null;
      memoryServiceRequests[idx] = {
        ...memoryServiceRequests[idx],
        ...data,
        updatedAt: new Date(),
      };
      return memoryServiceRequests[idx];
    }
  );
}

export async function createWebinarRegistration(data: Record<string, unknown>) {
  return withMongo(
    'createWebinarRegistration',
    async () => {
      const doc = new WebinarRegistration(data);
      await doc.save();
      return doc;
    },
    () => {
      const doc = withId(data);
      memoryWebinarRegistrations.unshift(doc);
      return doc;
    }
  );
}

export async function listWebinarRegistrations() {
  return withMongo(
    'listWebinarRegistrations',
    () => WebinarRegistration.find().sort({ createdAt: -1 }),
    () => memoryWebinarRegistrations
  );
}

export async function updateWebinarRegistration(id: string, data: Record<string, unknown>) {
  return withMongo(
    'updateWebinarRegistration',
    () => WebinarRegistration.findByIdAndUpdate(id, data, { new: true }),
    () => {
      const idx = memoryWebinarRegistrations.findIndex((r) => r._id === id);
      if (idx === -1) return null;
      memoryWebinarRegistrations[idx] = {
        ...memoryWebinarRegistrations[idx],
        ...data,
        updatedAt: new Date(),
      };
      return memoryWebinarRegistrations[idx];
    }
  );
}

export async function getWebinarSettings() {
  return withMongo(
    'getWebinarSettings',
    async () => {
      let doc = await WebinarSettings.findOne({ slug: 'live-demo' });
      if (!doc) {
        doc = await WebinarSettings.create(DEFAULT_WEBINAR_SETTINGS);
      }
      return doc;
    },
    () => memoryWebinarSettings
  );
}

export async function updateWebinarSettings(data: Record<string, unknown>) {
  return withMongo(
    'updateWebinarSettings',
    () =>
      WebinarSettings.findOneAndUpdate(
        { slug: 'live-demo' },
        { ...data, slug: 'live-demo' },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ),
    () => {
      memoryWebinarSettings = {
        ...memoryWebinarSettings,
        ...data,
        slug: 'live-demo',
        updatedAt: new Date(),
      };
      return memoryWebinarSettings;
    }
  );
}

export async function getSocialSettings() {
  return withMongo(
    'getSocialSettings',
    async () => {
      let doc = await SocialSettings.findOne({ slug: 'distributor-social' });
      if (!doc) {
        doc = await SocialSettings.create(DEFAULT_SOCIAL_SETTINGS);
      }
      return doc;
    },
    () => memorySocialSettings
  );
}

export async function updateSocialSettings(data: Record<string, unknown>) {
  return withMongo(
    'updateSocialSettings',
    () =>
      SocialSettings.findOneAndUpdate(
        { slug: 'distributor-social' },
        { ...data, slug: 'distributor-social' },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ),
    () => {
      memorySocialSettings = {
        ...memorySocialSettings,
        ...data,
        slug: 'distributor-social',
        updatedAt: new Date(),
      };
      return memorySocialSettings;
    }
  );
}
