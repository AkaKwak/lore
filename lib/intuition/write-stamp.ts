import { type PublicClient, type WalletClient, toHex } from "viem";
import { isValidStamp } from "@/lib/stamps";
import { LORE_PREDICATE } from "./queries";
import { MULTIVAULT_ADDRESS, MULTIVAULT_ABI, INTUITION_CHAIN } from "./contract";

export type StampWriteResult =
  | { ok: true; txHash: string }
  | { ok: false; error: string };

/**
 * Compute atom IDs for given labels, check which already exist,
 * and batch-create the missing ones in a single tx.
 * Returns the bytes32 IDs for all labels in order.
 */
async function ensureAtoms(
  publicClient: PublicClient,
  walletClient: WalletClient,
  labels: string[],
): Promise<`0x${string}`[]> {
  const uris = labels.map((l) => toHex(l));

  const ids = await Promise.all(
    uris.map((uri) =>
      publicClient.readContract({
        address: MULTIVAULT_ADDRESS,
        abi: MULTIVAULT_ABI,
        functionName: "calculateAtomId",
        args: [uri],
      }),
    ),
  );

  const existChecks = await Promise.all(
    ids.map((id) =>
      publicClient.readContract({
        address: MULTIVAULT_ADDRESS,
        abi: MULTIVAULT_ABI,
        functionName: "isTermCreated",
        args: [id],
      }),
    ),
  );

  const missingUris: `0x${string}`[] = [];
  for (let i = 0; i < labels.length; i++) {
    if (!existChecks[i]) missingUris.push(uris[i] as `0x${string}`);
  }

  if (missingUris.length > 0) {
    const atomCost = await publicClient.readContract({
      address: MULTIVAULT_ADDRESS,
      abi: MULTIVAULT_ABI,
      functionName: "getAtomCost",
    });

    const deposits = missingUris.map(() => atomCost);
    const totalValue = atomCost * BigInt(missingUris.length);

    const hash = await walletClient.writeContract({
      address: MULTIVAULT_ADDRESS,
      abi: MULTIVAULT_ABI,
      functionName: "createAtoms",
      args: [missingUris, deposits],
      value: totalValue,
      chain: INTUITION_CHAIN,
      account: walletClient.account!,
    });

    await publicClient.waitForTransactionReceipt({ hash });
  }

  return ids as `0x${string}`[];
}

/**
 * Write a stamp triple to Intuition on the Intuition chain (1155).
 *
 * Flow:
 * 1. Batch-create atoms for ENS name, predicate, and stamp label (skips existing)
 * 2. Create triple (subject, predicate, object) on the MultiVault
 * 3. Return the transaction hash
 */
export async function createStamp(
  walletClient: WalletClient,
  publicClient: PublicClient,
  ensName: string,
  label: string,
): Promise<StampWriteResult> {
  if (!isValidStamp(label)) {
    return { ok: false, error: `Invalid stamp label: ${label}` };
  }

  if (!walletClient.account) {
    return { ok: false, error: "Wallet not connected" };
  }

  try {
    const [subjectId, predicateId, objectId] = await ensureAtoms(
      publicClient,
      walletClient,
      [ensName, LORE_PREDICATE, label],
    );

    const tripleCost = await publicClient.readContract({
      address: MULTIVAULT_ADDRESS,
      abi: MULTIVAULT_ABI,
      functionName: "getTripleCost",
    });

    const txHash = await walletClient.writeContract({
      address: MULTIVAULT_ADDRESS,
      abi: MULTIVAULT_ABI,
      functionName: "createTriples",
      args: [[subjectId], [predicateId], [objectId], [tripleCost]],
      value: tripleCost,
      chain: INTUITION_CHAIN,
      account: walletClient.account,
    });

    await publicClient.waitForTransactionReceipt({ hash: txHash });

    return { ok: true, txHash };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create stamp";
    return { ok: false, error: message };
  }
}
