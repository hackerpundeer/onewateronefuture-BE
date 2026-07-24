import {
  isValidPhone,
  isValidPreferredDate,
} from '../../legacy/validation.js';

export function validateAppointmentCreate(body: Record<string, unknown>): string | null {
  const { fullName, email, phone, preferredDate, preferredTime } = body;
  if (!fullName || !email || !phone || !preferredDate || !preferredTime) {
    return 'Required fields missing';
  }
  const cleanPhone = String(phone).trim();
  if (!isValidPhone(cleanPhone)) {
    return 'Phone number must contain only digits, +, -, and at least 10 digits';
  }
  const cleanDate = String(preferredDate).trim();
  if (!isValidPreferredDate(cleanDate)) {
    return 'Preferred date must be at least tomorrow';
  }
  return null;
}
