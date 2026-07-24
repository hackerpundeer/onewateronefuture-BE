import type { Express } from 'express';
import { adminAuth } from '../../middleware/adminAuth.js';
import { loginAdmin } from '../../services/auth.js';
import { getDatabaseStatus, isMongoLive } from '../../db.js';
import {
  createBooking,
  listBookings,
  updateBooking,
  softDeleteBooking,
  createClubApplication,
  listClubApplications,
  updateClubApplication,
  createLead,
  listLeads,
  updateLead,
  createServiceRequest,
  listServiceRequests,
  updateServiceRequest,
  createWebinarRegistration,
  listWebinarRegistrations,
  updateWebinarRegistration,
  getWebinarSettings,
  updateWebinarSettings,
  getSocialSettings,
  updateSocialSettings,
} from '../../legacy/store.js';
import {
  isValidPhone,
  isValidPreferredDate,
  validateWebinarSettingsPayload,
  validateSocialSettingsPayload,
  parseBookingListQuery,
} from '../../legacy/validation.js';

export function registerV1Routes(app: Express): void {
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
        res.status(400).json({
          error: 'Phone number must contain only digits, +, -, and at least 10 digits',
        });
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
        res.status(400).json({
          error: 'Phone number must contain only digits, +, -, and at least 10 digits',
        });
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

  app.post('/api/service-requests', async (req, res) => {
    try {
      const { fullName, address, phone, serviceType } = req.body;
      if (!fullName || !address || !phone || !serviceType) {
        res.status(400).json({
          error: 'Name, address, mobile number, and service type are required',
        });
        return;
      }

      const cleanPhone = String(phone).trim();
      if (!isValidPhone(cleanPhone)) {
        res.status(400).json({
          error: 'Mobile number must contain only digits, +, -, and at least 10 digits',
        });
        return;
      }

      const serviceRequest = await createServiceRequest({
        fullName: String(fullName).trim(),
        address: String(address).trim(),
        phone: cleanPhone,
        serviceType: String(serviceType).trim(),
        status: 'New',
      });

      res.status(201).json({ success: true, data: serviceRequest });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save service request';
      res.status(500).json({ error: message });
    }
  });

  app.get('/api/webinar-settings', async (_req, res) => {
    try {
      const settings = await getWebinarSettings();
      res.json(settings);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch webinar settings';
      res.status(500).json({ error: message });
    }
  });

  app.get('/api/social-settings', async (_req, res) => {
    try {
      const settings = await getSocialSettings();
      res.json(settings);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch social settings';
      res.status(500).json({ error: message });
    }
  });

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

  app.get('/api/book-demo', adminAuth, async (req, res) => {
    try {
      const { filters, error } = parseBookingListQuery(req.query as Record<string, unknown>);
      if (error) {
        res.status(400).json({ error });
        return;
      }
      const bookings = await listBookings(filters);
      res.json(bookings);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch bookings';
      res.status(500).json({ error: message });
    }
  });

  app.delete('/api/book-demo/:id', adminAuth, async (req, res) => {
    try {
      const deleted = await softDeleteBooking(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Booking not found' });
        return;
      }
      res.json({ success: true, data: deleted });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete booking';
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

  app.get('/api/service-requests', adminAuth, async (_req, res) => {
    try {
      const requests = await listServiceRequests();
      res.json(requests);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch service requests';
      res.status(500).json({ error: message });
    }
  });

  app.patch('/api/service-requests/:id', adminAuth, async (req, res) => {
    try {
      const updated = await updateServiceRequest(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Service request not found' });
        return;
      }
      res.json({ success: true, data: updated });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update service request';
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

  app.put('/api/webinar-settings', adminAuth, async (req, res) => {
    try {
      const validationError = validateWebinarSettingsPayload(req.body);
      if (validationError) {
        res.status(400).json({ error: validationError });
        return;
      }

      const {
        zoomUrl,
        dailyStartTime,
        timezone,
        liveDurationMinutes,
        unlockMinutesBefore,
        scheduleLabel,
        meetingObjective,
        isEnabled,
      } = req.body;

      const updated = await updateWebinarSettings({
        zoomUrl: String(zoomUrl).trim(),
        dailyStartTime: String(dailyStartTime).trim(),
        timezone: timezone ? String(timezone).trim() : 'Asia/Kolkata',
        liveDurationMinutes: Number(liveDurationMinutes),
        unlockMinutesBefore: Number(unlockMinutesBefore),
        scheduleLabel: scheduleLabel ? String(scheduleLabel).trim() : 'Daily: 8:00 PM IST',
        meetingObjective: meetingObjective ? String(meetingObjective).trim() : '',
        isEnabled: isEnabled !== false,
      });

      res.json({ success: true, data: updated });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update webinar settings';
      res.status(500).json({ error: message });
    }
  });

  app.put('/api/social-settings', adminAuth, async (req, res) => {
    try {
      const validationError = validateSocialSettingsPayload(req.body);
      if (validationError) {
        res.status(400).json({ error: validationError });
        return;
      }

      const { facebookUrl, instagramUrl, showFacebook, showInstagram } = req.body;

      const updated = await updateSocialSettings({
        facebookUrl: facebookUrl ? String(facebookUrl).trim() : '',
        instagramUrl: instagramUrl ? String(instagramUrl).trim() : '',
        showFacebook: showFacebook === true,
        showInstagram: showInstagram === true,
      });

      res.json({ success: true, data: updated });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update social settings';
      res.status(500).json({ error: message });
    }
  });
}
