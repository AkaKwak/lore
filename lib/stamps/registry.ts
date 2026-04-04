export const CORE_STAMPS = [
  "Builder",
  "Trusted",
  "Creative",
  "Helpful",
  "Speaker",
  "Curious",
  "Onchain",
  "DeFi",
] as const;

export type CoreStamp = (typeof CORE_STAMPS)[number];
export type StampLabel = CoreStamp;

export function isValidStamp(label: string): boolean {
  return (CORE_STAMPS as readonly string[]).includes(label);
}
