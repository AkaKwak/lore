/**
 * Text records loaded for the passport (discovery / profile surface).
 * Single source of truth — add keys here only when the product should show them.
 */
export const ENS_TEXT_RECORD_KEYS = [
  "description",
  "url",
  "com.twitter",
  "com.github",
  "email",
  "com.lore.stamps",
  "com.lore.vibe",
  "com.lore.total",
] as const;

export type EnsTextRecordKey = (typeof ENS_TEXT_RECORD_KEYS)[number];
