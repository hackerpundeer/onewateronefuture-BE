import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    model: { type: String, default: 'LeveLuk K8' },
    date: { type: String, default: '' },
    status: { type: String, default: 'New' },
    websiteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Website', required: false },
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: false },
    schemaVersion: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const Lead = mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
