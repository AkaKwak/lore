export const NOTABLE_ENS = [
  "vitalik.eth",
  "nick.eth",
  "brantly.eth",
  "griff.eth",
  "lefteris.eth",
  "sassal.eth",
  "superphiz.eth",
  "poap.eth",
  "punk6529.eth",
  "0xdesigner.eth",
  "coltron.eth",
  "fireyes.eth",
] as const;

export function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickRandomPair<T>(arr: readonly T[]): [T, T] {
  const a = Math.floor(Math.random() * arr.length);
  let b = Math.floor(Math.random() * (arr.length - 1));
  if (b >= a) b++;
  return [arr[a], arr[b]];
}
