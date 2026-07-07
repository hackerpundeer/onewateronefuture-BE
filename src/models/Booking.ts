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
  },
  { timestamps: true }
);

export const Booking =
  mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
