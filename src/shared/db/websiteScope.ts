import type { Types } from 'mongoose';

export const DEFAULT_WEBSITE_SLUG = 'one-water-one-future';

/** Cached id of the seeded default website (set during Platform seed). */
let defaultWebsiteId: string | null = null;

export function setDefaultWebsiteId(id: Types.ObjectId | string | null | undefined): void {
  defaultWebsiteId = id != null && id !== '' ? String(id) : null;
}

export function getDefaultWebsiteId(): string | null {
  return defaultWebsiteId;
}

export function isDefaultWebsiteId(websiteId: Types.ObjectId | string): boolean {
  return defaultWebsiteId !== null && String(websiteId) === defaultWebsiteId;
}

export type WebsiteScopeOptions = {
  /** Explicit override; when omitted, uses cached default website id. */
  isDefaultWebsite?: boolean;
};

/**
 * ADR-002: Legacy documents without websiteId belong ONLY to the default website.
 *
 * Default website → websiteId match OR missing OR null
 * Other websites → websiteId match only
 */
export function buildWebsiteScopeFilter(
  websiteId: Types.ObjectId | string,
  options?: WebsiteScopeOptions
) {
  const isDefault = options?.isDefaultWebsite ?? isDefaultWebsiteId(websiteId);

  if (!isDefault) {
    return { websiteId };
  }

  return {
    $or: [{ websiteId }, { websiteId: { $exists: false } }, { websiteId: null }],
  };
}

export function mergeWebsiteScope(
  websiteId: Types.ObjectId | string,
  query: Record<string, unknown> = {},
  options?: WebsiteScopeOptions
) {
  const scopeFilter = buildWebsiteScopeFilter(websiteId, options);
  if (Object.keys(query).length === 0) {
    return scopeFilter;
  }
  // Avoid overwriting query.$or when the default-site scope also uses $or
  if ('$or' in scopeFilter) {
    return { $and: [scopeFilter, query] };
  }
  return { ...query, ...scopeFilter };
}

export function matchesWebsiteScope(
  doc: { websiteId?: Types.ObjectId | string | null },
  websiteId: Types.ObjectId | string,
  options?: WebsiteScopeOptions
): boolean {
  const isDefault = options?.isDefaultWebsite ?? isDefaultWebsiteId(websiteId);
  const docId = doc.websiteId;

  if (docId == null || docId === '') {
    return isDefault;
  }
  return String(docId) === String(websiteId);
}
