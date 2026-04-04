import {
  type WalletClient,
  type PublicClient,
  namehash,
  encodeFunctionData,
} from "viem";
import { getEnsResolver } from "viem/actions";
import { normalize } from "viem/ens";

const RESOLVER_ABI = [
  {
    name: "setText",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "node", type: "bytes32" },
      { name: "key", type: "string" },
      { name: "value", type: "string" },
    ],
    outputs: [],
  },
  {
    name: "multicall",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "data", type: "bytes[]" }],
    outputs: [{ name: "results", type: "bytes[]" }],
  },
] as const;

export type LoreTextRecords = {
  stamps: string;
  vibe: string;
  total: string;
};

/**
 * Write Lore stamp data to ENS text records on mainnet.
 * Uses multicall to batch all setText calls into one transaction.
 *
 * Keys written:
 *   com.lore.stamps = "Builder:5,Creative:3,Trusted:2"
 *   com.lore.vibe   = "creative builder energy"
 *   com.lore.total  = "10"
 */
export async function writeLoreRecords(
  walletClient: WalletClient,
  publicClient: PublicClient,
  ensName: string,
  records: LoreTextRecords,
): Promise<{ ok: true; txHash: string } | { ok: false; error: string }> {
  if (!walletClient.account) {
    return { ok: false, error: "Wallet not connected" };
  }

  try {
    const normalized = normalize(ensName);
    const node = namehash(normalized);

    const resolverAddress = await getEnsResolver(publicClient, {
      name: normalized,
    });

    if (!resolverAddress) {
      return { ok: false, error: "No resolver found for this ENS name" };
    }

    const entries: [string, string][] = [
      ["com.lore.stamps", records.stamps],
      ["com.lore.vibe", records.vibe],
      ["com.lore.total", records.total],
    ];

    const calldata = entries.map(([key, value]) =>
      encodeFunctionData({
        abi: RESOLVER_ABI,
        functionName: "setText",
        args: [node, key, value],
      }),
    );

    const txHash = await walletClient.writeContract({
      address: resolverAddress,
      abi: RESOLVER_ABI,
      functionName: "multicall",
      args: [calldata],
      chain: walletClient.chain,
      account: walletClient.account,
    });

    await publicClient.waitForTransactionReceipt({ hash: txHash });

    return { ok: true, txHash };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to write ENS records";
    return { ok: false, error: message };
  }
}
