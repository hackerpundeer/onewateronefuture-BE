import mongoose from 'mongoose';

const ClubApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    country: { type: String, default: '' },
    sponsorName: { type: String, default: '' },
    interestType: { type: String, default: 'both' },
    status: { type: String, default: 'Pending' },
    websiteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Website', required: false },
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: false },
    schemaVersion: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const ClubApplication =
  mongoose.models.ClubApplication ||
  mongoose.model('ClubApplication', ClubApplicationSchema);
