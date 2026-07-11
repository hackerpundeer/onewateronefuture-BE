import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDatabase, getDatabaseStatus, isMongoLive } from './db.js';
import { adminAuth } from './middleware/adminAuth.js';
import { loginAdmin, seedDefaultAdmin } from './services/auth.js';
import {
  createBooking,
  listBookings,
  updateBooking,
  createClubApplication,
  listClubApplications,
  updateClubApplication,
  createLead,
  listLeads,
  updateLead,
  createWebinarRegistration,
  listWebinarRegistrations,
  updateWebinarRegistration,
} from './store.js';
import { isValidPhone, isValidPreferredDate } from './validation.js';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(express.json());
// TODO: tighten CORS before production — restrict to FRONTEND_URL origins
app.use(cors());

app.get('/api', (_req, res) => {
  res.send('Kangen Water API Running');
});

app.get('/api/health', async (_req, res) => {
  const live = await isMongoLive();
  res.json({
    status: 'ok',
    ...getDatabaseStatus(),
    mongoConnected: live,
    database: live ? 'MongoDB' : 'In-Memory Fallback',
    timestamp: new Date(),
  });
});

// --- Public routes ---

app.post('/api/book-demo', async (req, res) => {
  try {
    const { fullName, email, phone, country, demoType, preferredDate, preferredTime, message } =
      req.body;
    if (!fullName || !email || !phone || !preferredDate || !preferredTime) {
      res.status(400).json({ error: 'Required fields missing' });
      return;
    }
    const cleanPhone = String(phone).trim();
    if (!isValidPhone(cleanPhone)) {
      res.status(400).json({ error: 'Phone number must contain only digits, +, -, and at least 10 digits' });
      return;
    }
    const cleanDate = String(preferredDate).trim();
    if (!isValidPreferredDate(cleanDate)) {
      res.status(400).json({ error: 'Preferred date must be at least tomorrow' });
      return;
    }
    const booking = await createBooking({
      fullName: String(fullName).trim(),
      email: String(email).trim(),
      phone: cleanPhone,
      country: country || '',
      demoType: demoType || 'zoom',
      preferredDate: cleanDate,
      preferredTime: String(preferredTime).trim(),
      message: message || '',
      status: 'New',
    });
    res.status(201).json({ success: true, data: booking });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save booking';
    res.status(500).json({ error: message });
  }
});

app.post('/api/club-applications', async (req, res) => {
  try {
    const { fullName, email, phone, country, sponsorName, interestType } = req.body;
    if (!fullName || !email || !phone) {
      res.status(400).json({ error: 'Name, email, and phone are required' });
      return;
    }
    const application = await createClubApplication({
      fullName,
      email,
      phone,
      country: country || '',
      sponsorName: sponsorName || '',
      interestType: interestType || 'both',
      status: 'Pending',
    });
    res.status(201).json({ success: true, data: application });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save application';
    res.status(500).json({ error: message });
  }
});

app.post('/api/webinar-registrations', async (req, res) => {
  try {
    const { fullName, city, phone } = req.body;
    if (!fullName || !city || !phone) {
      res.status(400).json({ error: 'Name, city, and phone are required' });
      return;
    }
    const cleanPhone = String(phone).trim();
    if (!isValidPhone(cleanPhone)) {
      res.status(400).json({ error: 'Phone number must contain only digits, +, -, and at least 10 digits' });
      return;
    }
    const registration = await createWebinarRegistration({
      fullName: String(fullName).trim(),
      city: String(city).trim(),
      phone: cleanPhone,
      status: 'New',
      source: 'zoom_live_demo',
    });
    res.status(201).json({ success: true, data: registration });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save webinar registration';
    res.status(500).json({ error: message });
  }
});

// --- Admin auth ---

app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const result = await loginAdmin(email, password);
    if (!result) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    res.json({ success: true, token: result.token, admin: result.admin });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed';
    res.status(500).json({ error: message });
  }
});

app.get('/api/admin/me', adminAuth, (req, res) => {
  res.json({ admin: req.admin });
});

// --- Admin routes ---

app.get('/api/book-demo', adminAuth, async (_req, res) => {
  try {
    const bookings = await listBookings();
    res.json(bookings);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch bookings';
    res.status(500).json({ error: message });
  }
});

app.patch('/api/book-demo/:id', adminAuth, async (req, res) => {
  try {
    const updated = await updateBooking(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }
    res.json({ success: true, data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update booking';
    res.status(500).json({ error: message });
  }
});

app.get('/api/club-applications', adminAuth, async (_req, res) => {
  try {
    const applications = await listClubApplications();
    res.json(applications);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch applications';
    res.status(500).json({ error: message });
  }
});

app.patch('/api/club-applications/:id', adminAuth, async (req, res) => {
  try {
    const updated = await updateClubApplication(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }
    res.json({ success: true, data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update application';
    res.status(500).json({ error: message });
  }
});

app.get('/api/leads', adminAuth, async (_req, res) => {
  try {
    const leads = await listLeads();
    res.json(leads);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch leads';
    res.status(500).json({ error: message });
  }
});

app.post('/api/leads', adminAuth, async (req, res) => {
  try {
    const { name, email, phone, model, date, status } = req.body;
    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required' });
      return;
    }
    const lead = await createLead({
      name,
      email,
      phone: phone || '',
      model: model || 'LeveLuk K8',
      date: date || '',
      status: status || 'New',
    });
    res.status(201).json({ success: true, data: lead });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save lead';
    res.status(500).json({ error: message });
  }
});

app.patch('/api/leads/:id', adminAuth, async (req, res) => {
  try {
    const updated = await updateLead(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }
    res.json({ success: true, data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update lead';
    res.status(500).json({ error: message });
  }
});

app.get('/api/webinar-registrations', adminAuth, async (_req, res) => {
  try {
    const registrations = await listWebinarRegistrations();
    res.json(registrations);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch webinar registrations';
    res.status(500).json({ error: message });
  }
});

app.patch('/api/webinar-registrations/:id', adminAuth, async (req, res) => {
  try {
    const updated = await updateWebinarRegistration(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Webinar registration not found' });
      return;
    }
    res.json({ success: true, data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update webinar registration';
    res.status(500).json({ error: message });
  }
});

async function start() {
  await connectDatabase();
  await seedDefaultAdmin();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Kangen Backend] Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
