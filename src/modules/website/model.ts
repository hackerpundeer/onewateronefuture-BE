import mongoose from 'mongoose';

export const CORE_MODULES = [
  'website',
  'contact',
  'configuration',
  'appointment',
  'inquiry',
  'application',
  'service-request',
  'registration',
  'product',
] as const;

export const DEFAULT_ENABLED_MODULES = [...CORE_MODULES, 'donation'] as const;

const WebsiteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    domain: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    enabledModules: { type: [String], default: [] },
    configuration: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

WebsiteSchema.index({ slug: 1 }, { unique: true });

export const Website =
  mongoose.models.Website || mongoose.model('Website', WebsiteSchema);
