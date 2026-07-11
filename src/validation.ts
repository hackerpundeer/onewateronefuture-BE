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

const TIME_HHMM_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const ZOOM_URL_PATTERN = /^https:\/\/([\w-]+\.)?zoom\.us\//i;

export function isValidTimeHHmm(time: string): boolean {
  return TIME_HHMM_PATTERN.test(time);
}

export function isValidZoomUrl(url: string): boolean {
  return ZOOM_URL_PATTERN.test(url.trim());
}

export function isValidLiveDurationMinutes(minutes: number): boolean {
  return Number.isFinite(minutes) && minutes >= 15 && minutes <= 180;
}

export function isValidUnlockMinutesBefore(minutes: number): boolean {
  return Number.isFinite(minutes) && minutes >= 5 && minutes <= 120;
}

export function validateWebinarSettingsPayload(body: Record<string, unknown>): string | null {
  const { zoomUrl, dailyStartTime, liveDurationMinutes, unlockMinutesBefore } = body;

  if (!zoomUrl || typeof zoomUrl !== 'string' || !isValidZoomUrl(zoomUrl)) {
    return 'A valid Zoom URL (https://*.zoom.us/...) is required';
  }
  if (!dailyStartTime || typeof dailyStartTime !== 'string' || !isValidTimeHHmm(dailyStartTime)) {
    return 'Daily start time must be in HH:mm format (24-hour)';
  }
  const duration = Number(liveDurationMinutes);
  if (!isValidLiveDurationMinutes(duration)) {
    return 'Live duration must be between 15 and 180 minutes';
  }
  const unlock = Number(unlockMinutesBefore);
  if (!isValidUnlockMinutesBefore(unlock)) {
    return 'Unlock window must be between 5 and 120 minutes before start';
  }
  return null;
}
