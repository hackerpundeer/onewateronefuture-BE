import { isMongoConnected, isMongoLive, markMongoDisconnected } from './db.js';
import { Booking } from './models/Booking.js';
import { ClubApplication } from './models/ClubApplication.js';
import { Lead } from './models/Lead.js';

const memoryBookings: Record<string, unknown>[] = [];
const memoryApplications: Record<string, unknown>[] = [];
const memoryLeads: Record<string, unknown>[] = [];

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

export async function listBookings() {
  return withMongo(
    'listBookings',
    () => Booking.find().sort({ createdAt: -1 }),
    () => memoryBookings
  );
}

export async function updateBooking(id: string, data: Record<string, unknown>) {
  return withMongo(
    'updateBooking',
    () => Booking.findByIdAndUpdate(id, data, { new: true }),
    () => {
      const idx = memoryBookings.findIndex((b) => b._id === id);
      if (idx === -1) return null;
      memoryBookings[idx] = { ...memoryBookings[idx], ...data, updatedAt: new Date() };
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
