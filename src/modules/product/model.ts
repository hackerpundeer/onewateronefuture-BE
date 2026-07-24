import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    websiteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Website', required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    isActive: { type: Boolean, default: true },
    schemaVersion: { type: Number, default: 2 },
  },
  { timestamps: true }
);

ProductSchema.index({ websiteId: 1, slug: 1 }, { unique: true });

export const Product =
  mongoose.models.Product || mongoose.model('Product', ProductSchema);
