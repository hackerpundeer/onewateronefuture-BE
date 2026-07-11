import mongoose from 'mongoose';

const WebinarRegistrationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, default: 'New' },
    source: { type: String, default: 'zoom_live_demo' },
  },
  { timestamps: true }
);

export const WebinarRegistration =
  mongoose.models.WebinarRegistration ||
  mongoose.model('WebinarRegistration', WebinarRegistrationSchema);
