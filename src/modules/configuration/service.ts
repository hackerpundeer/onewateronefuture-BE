import { ValidationError } from '../../shared/errors/index.js';
import { socialAdapter } from './adapters/social.adapter.js';
import { webinarAdapter } from './adapters/webinar.adapter.js';

export type ConfigurationNamespace = 'social' | 'webinar';

const namespaces: ConfigurationNamespace[] = ['social', 'webinar'];

export function isValidNamespace(value: string): value is ConfigurationNamespace {
  return namespaces.includes(value as ConfigurationNamespace);
}

/**
 * Configuration public API.
 * Persistence remains SocialSettings / WebinarSettings via adapters — no Configuration collection.
 */
export const configurationService = {
  async get(namespace: ConfigurationNamespace) {
    if (namespace === 'social') return socialAdapter.get();
    return webinarAdapter.get();
  },

  async update(namespace: ConfigurationNamespace, body: Record<string, unknown>) {
    if (namespace === 'social') {
      const result = await socialAdapter.update(body);
      if (result.error) throw new ValidationError(result.error);
      return result.data;
    }

    const result = await webinarAdapter.update(body);
    if (result.error) throw new ValidationError(result.error);
    return result.data;
  },
};
