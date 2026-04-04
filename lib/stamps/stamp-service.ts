import { isValidStamp } from "./registry";

export type StampResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Submit a stamp. Currently faked with a short delay.
 * Swap the body to fetch('/api/stamp') for real relayer.
 */
export async function submitStamp(
  ensName: string,
  label: string,
  actor: string,
): Promise<StampResult> {
  if (!isValidStamp(label)) {
    return { ok: false, error: `Invalid stamp: ${label}` };
  }

  // PHASE 1: simulated delay
  await new Promise((r) => setTimeout(r, 400 + Math.random() * 200));
  return { ok: true };

  // PHASE 2: swap to real relayer
  // const res = await fetch("/api/stamp", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ ensName, label, actor }),
  // });
  // return res.json();
}
