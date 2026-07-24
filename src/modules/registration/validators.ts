import { isValidPhone } from '../../legacy/validation.js';

export function validateRegistrationCreate(body: Record<string, unknown>): string | null {
  const { fullName, city, phone } = body;
  if (!fullName || !city || !phone) {
    return 'Name, city, and phone are required';
  }
  const cleanPhone = String(phone).trim();
  if (!isValidPhone(cleanPhone)) {
    return 'Phone number must contain only digits, +, -, and at least 10 digits';
  }
  return null;
}
