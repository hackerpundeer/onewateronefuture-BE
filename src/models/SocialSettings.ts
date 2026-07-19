import mongoose from 'mongoose';

const SocialSettingsSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, default: 'distributor-social' },
    facebookUrl: { type: String, default: '' },
    instagramUrl: { type: String, default: '' },
    showFacebook: { type: Boolean, default: false },
    showInstagram: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const SocialSettings =
  mongoose.models.SocialSettings ||
  mongoose.model('SocialSettings', SocialSettingsSchema);
