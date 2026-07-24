/**
 * Pick only explicitly allowed fields from a PATCH body.
 * Prevents mass assignment of websiteId, contactId, schemaVersion, etc.
 */
export function pickAllowedFields(
  body: Record<string, unknown>,
  allowed: readonly string[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(body, key) && body[key] !== undefined) {
      result[key] = body[key];
    }
  }
  return result;
}
