import { isValidStamp } from "./registry";
import { createStamp } from "@/lib/intuition/write-stamp";
import type { PublicClient, WalletClient } from "viem";

export type StampResult =
  | { ok: true; txHash?: string }
  | { ok: false; error: string };

function isMockMode(): boolean {
  return process.env.NEXT_PUBLIC_MOCK_STAMPS === "true";
}

export async function submitStamp(
  ensName: string,
  label: string,
  _actor: string,
  walletClient?: WalletClient,
  publicClient?: PublicClient,
): Promise<StampResult> {
  if (!isValidStamp(label)) {
    return { ok: false, error: `Invalid stamp: ${label}` };
  }

  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 200));
    return { ok: true };
  }

  if (!walletClient || !publicClient) {
    return { ok: false, error: "Wallet not available for onchain stamp" };
  }

  return createStamp(walletClient, publicClient, ensName, label);
}
