import { isValidPhone } from '../../legacy/validation.js';

export function validateServiceRequestCreate(body: Record<string, unknown>): string | null {
  const { fullName, address, phone, serviceType } = body;
  if (!fullName || !address || !phone || !serviceType) {
    return 'Name, address, mobile number, and service type are required';
  }
  const cleanPhone = String(phone).trim();
  if (!isValidPhone(cleanPhone)) {
    return 'Mobile number must contain only digits, +, -, and at least 10 digits';
  }
  return null;
}
