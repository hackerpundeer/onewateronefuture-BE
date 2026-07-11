export const MIN_PHONE_DIGITS = 10;
export const PHONE_CHAR_PATTERN = /^[\d+\-]*$/;

export function sanitizePhoneInput(value: string): string {
  return value.replace(/[^\d+\-]/g, '');
}

export function countPhoneDigits(phone: string): number {
  return phone.replace(/\D/g, '').length;
}

export function hasValidPhoneCharacters(phone: string): boolean {
  return PHONE_CHAR_PATTERN.test(phone);
}

export function isValidPhone(phone: string): boolean {
  const trimmed = phone.trim();
  if (!trimmed || !hasValidPhoneCharacters(trimmed)) return false;
  return countPhoneDigits(trimmed) >= MIN_PHONE_DIGITS;
}

export function getMinPreferredDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toLocaleDateString('en-CA');
}

export function isValidPreferredDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= getMinPreferredDate();
}
