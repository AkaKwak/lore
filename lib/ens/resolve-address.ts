import { type PublicClient, zeroAddress } from "viem";
import { getEnsAddress } from "viem/actions";
import type { HexAddress } from "./types";

export async function resolveEnsAddress(
  client: PublicClient,
  normalizedName: string,
): Promise<HexAddress | null> {
  const address = await getEnsAddress(client, { name: normalizedName });
  if (!address || address === zeroAddress) {
    return null;
  }
  return address as HexAddress;
}
