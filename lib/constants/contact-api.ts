export const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  shortText: 200,
  longText: 2000,
} as const;

export const CONTACT_MAX_BODY_BYTES = 20_000;
export const CONTACT_MIN_FILL_MS = 3000;