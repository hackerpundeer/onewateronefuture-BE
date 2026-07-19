import mongoose from 'mongoose';

const ServiceRequestSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    serviceType: { type: String, required: true },
    status: { type: String, default: 'New' },
  },
  { timestamps: true }
);

export const ServiceRequest =
  mongoose.models.ServiceRequest ||
  mongoose.model('ServiceRequest', ServiceRequestSchema);
