import mongoose from 'mongoose';

const ServiceRequestSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    serviceType: { type: String, required: true },
    status: { type: String, default: 'New' },
    websiteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Website', required: false },
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: false },
    schemaVersion: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const ServiceRequest =
  mongoose.models.ServiceRequest ||
  mongoose.model('ServiceRequest', ServiceRequestSchema);
