import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema(
  {
    websiteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Website', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    donorName: { type: String, default: '' },
    donorEmail: { type: String, default: '' },
    donorPhone: { type: String, default: '' },
    message: { type: String, default: '' },
    status: { type: String, default: 'pending' },
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', default: null },
    schemaVersion: { type: Number, default: 2 },
  },
  { timestamps: true }
);

export const Donation =
  mongoose.models.Donation || mongoose.model('Donation', DonationSchema);
