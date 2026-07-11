export const MIN_PHONE_DIGITS = 10;

export function countPhoneDigits(phone: string): number {
  return phone.replace(/\D/g, '').length;
}

export function isValidPhone(phone: string): boolean {
  return countPhoneDigits(phone) >= MIN_PHONE_DIGITS;
}

export function getMinPreferredDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toLocaleDateString('en-CA');
}

export function isValidPreferredDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= getMinPreferredDate();
}
