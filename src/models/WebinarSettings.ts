import mongoose from 'mongoose';

const WebinarSettingsSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, default: 'live-demo' },
    zoomUrl: { type: String, required: true },
    dailyStartTime: { type: String, required: true, default: '20:00' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    liveDurationMinutes: { type: Number, default: 45 },
    unlockMinutesBefore: { type: Number, default: 30 },
    scheduleLabel: { type: String, default: 'Daily: 8:00 PM IST' },
    meetingObjective: { type: String, default: '' },
    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const WebinarSettings =
  mongoose.models.WebinarSettings ||
  mongoose.model('WebinarSettings', WebinarSettingsSchema);
