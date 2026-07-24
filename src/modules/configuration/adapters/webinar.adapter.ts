import {
  getWebinarSettings,
  updateWebinarSettings,
} from '../../../legacy/store.js';
import { validateWebinarSettingsPayload } from '../../../legacy/validation.js';

/** Adapter: Configuration webinar namespace → WebinarSettings collection (no new collection). */
export const webinarAdapter = {
  async get() {
    return getWebinarSettings();
  },

  async update(body: Record<string, unknown>) {
    const error = validateWebinarSettingsPayload(body);
    if (error) return { error, data: null as null };
    const data = await updateWebinarSettings({
      zoomUrl: String(body.zoomUrl).trim(),
      dailyStartTime: String(body.dailyStartTime).trim(),
      timezone: body.timezone ? String(body.timezone).trim() : 'Asia/Kolkata',
      liveDurationMinutes: Number(body.liveDurationMinutes),
      unlockMinutesBefore: Number(body.unlockMinutesBefore),
      scheduleLabel: body.scheduleLabel
        ? String(body.scheduleLabel).trim()
        : 'Daily: 8:00 PM IST',
      meetingObjective: body.meetingObjective
        ? String(body.meetingObjective).trim()
        : '',
      isEnabled: body.isEnabled !== false,
    });
    return { error: null, data };
  },
};
