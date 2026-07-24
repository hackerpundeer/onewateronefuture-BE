import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    country: { type: String, default: '' },
    demoType: { type: String, default: 'zoom' },
    preferredDate: { type: String, default: '' },
    preferredTime: { type: String, default: '' },
    message: { type: String, default: '' },
    status: { type: String, default: 'New' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    websiteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Website', required: false },
    intent: { type: String, default: 'demo' },
    sourceForm: { type: String, default: 'book-demo' },
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: false },
    schemaVersion: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const Booking =
  mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
