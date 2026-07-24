import {
  getSocialSettings,
  updateSocialSettings,
} from '../../../legacy/store.js';
import { validateSocialSettingsPayload } from '../../../legacy/validation.js';

/** Adapter: Configuration social namespace → SocialSettings collection (no new collection). */
export const socialAdapter = {
  async get() {
    return getSocialSettings();
  },

  async update(body: Record<string, unknown>) {
    const error = validateSocialSettingsPayload(body);
    if (error) return { error, data: null as null };
    const data = await updateSocialSettings({
      facebookUrl: body.facebookUrl ? String(body.facebookUrl).trim() : '',
      instagramUrl: body.instagramUrl ? String(body.instagramUrl).trim() : '',
      showFacebook: body.showFacebook === true,
      showInstagram: body.showInstagram === true,
    });
    return { error: null, data };
  },
};
