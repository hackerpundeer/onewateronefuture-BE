import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema(
  {
    websiteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Website', required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    name: { type: String, default: '' },
    schemaVersion: { type: Number, default: 2 },
  },
  { timestamps: true }
);

ContactSchema.index({ websiteId: 1, email: 1 });
ContactSchema.index({ websiteId: 1, phone: 1 });

export const Contact =
  mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
