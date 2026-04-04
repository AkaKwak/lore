"use client";

import { useState, useCallback, useEffect } from "react";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { mainnet } from "wagmi/chains";
import { writeLoreRecords } from "@/lib/ens/write-records";
import { deriveVibe } from "@/lib/stamps";
import type { LoreProfile } from "@/lib/intuition";

function buildStampsSummary(counts: Record<string, number>): string {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => `${label}:${count}`)
    .join(",");
}

export function ClaimToEns({
  profile,
  ownerAddress,
}: {
  profile: LoreProfile;
  ownerAddress?: string;
}) {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient({ chainId: mainnet.id });
  const publicClient = usePublicClient({ chainId: mainnet.id });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isOwner =
    mounted &&
    isConnected &&
    address &&
    ownerAddress &&
    address.toLowerCase() === ownerAddress.toLowerCase();

  const handleClaim = useCallback(async () => {
    if (!walletClient || !publicClient || !isOwner) return;

    setStatus("pending");
    setErrorMsg(null);

    const stamps = buildStampsSummary(profile.counts);
    const vibe = deriveVibe(profile.topTraits) || profile.topTraits.join(", ");
    const total = String(profile.total);

    const result = await writeLoreRecords(
      walletClient,
      publicClient,
      profile.ensName,
      { stamps, vibe, total },
    );

    if (result.ok) {
      setStatus("success");
      setTxHash(result.txHash);
    } else {
      setStatus("error");
      setErrorMsg(result.error);
    }
  }, [walletClient, publicClient, isOwner, profile]);

  if (!isOwner || profile.total === 0) return null;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Export to your ENS
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Write your stamps as text records — portable across all ENS apps
          </p>
        </div>

        {status === "idle" ? (
          <button
            type="button"
            onClick={handleClaim}
            className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            Claim
          </button>
        ) : null}

        {status === "pending" ? (
          <span className="shrink-0 text-sm text-zinc-500">
            Signing…
          </span>
        ) : null}

        {status === "success" ? (
          <a
            href={`https://etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-sm font-medium text-emerald-600 hover:underline"
          >
            Done ✓
          </a>
        ) : null}

        {status === "error" ? (
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-xs text-red-500">{errorMsg}</span>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="text-xs text-zinc-500 underline hover:text-zinc-700"
            >
              Retry
            </button>
          </div>
        ) : null}
      </div>

      {status === "success" ? (
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Your stamps are now on your ENS profile! Check{" "}
          <a
            href={`https://app.ens.domains/${profile.ensName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline"
          >
            {profile.ensName} on ENS
          </a>
        </p>
      ) : null}
    </div>
  );
}
