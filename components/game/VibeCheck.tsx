"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import gsap from "gsap";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { INTUITION_CHAIN } from "@/lib/intuition/contract";
import { CORE_STAMPS, submitStamp } from "@/lib/stamps";
import { NOTABLE_ENS, pickRandomPair, pickRandom } from "@/lib/ens/notable";
import { STAMP_COLORS } from "@/components/stamps/StampPanel";

type CardData = {
  ensName: string;
  avatar?: string | null;
};

const DEFAULT_COLOR = {
  bg: "bg-zinc-50 dark:bg-zinc-900",
  text: "text-zinc-700 dark:text-zinc-300",
};

function avatarUrl(ensName: string): string {
  return `https://metadata.ens.domains/mainnet/avatar/${ensName}`;
}

export function VibeCheck() {
  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient({ chainId: INTUITION_CHAIN.id });
  const publicClient = usePublicClient({ chainId: INTUITION_CHAIN.id });

  const [pair, setPair] = useState<[CardData, CardData] | null>(null);
  const [label, setLabel] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const [a, b] = pickRandomPair(NOTABLE_ENS);
    setPair([{ ensName: a }, { ensName: b }]);
    setLabel(pickRandom(CORE_STAMPS));
    setMounted(true);
  }, []);
  const [busy, setBusy] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const cardRefs = useRef<(HTMLButtonElement | null)[]>([null, null]);
  const containerRef = useRef<HTMLDivElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      setToast({ message, type });
      if (toastRef.current) {
        gsap.fromTo(
          toastRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.25, ease: "power2.out" },
        );
      }
      setTimeout(() => setToast(null), 2000);
    },
    [],
  );

  const nextRound = useCallback(() => {
    const [a, b] = pickRandomPair(NOTABLE_ENS);
    setPair([{ ensName: a }, { ensName: b }]);
    setLabel(pickRandom(CORE_STAMPS));

    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
      );
    }
  }, []);

  const handlePick = useCallback(
    async (index: 0 | 1) => {
      if (!mounted || busy || !pair || !label) return;

      if (!isConnected || !address) {
        showToast("Connect your wallet first", "error");
        return;
      }

      setBusy(true);

      const chosen = cardRefs.current[index];
      const other = cardRefs.current[index === 0 ? 1 : 0];

      if (chosen) {
        gsap.to(chosen, {
          scale: 1.05,
          boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)",
          duration: 0.2,
          ease: "power2.out",
        });
      }
      if (other) {
        gsap.to(other, { opacity: 0.4, scale: 0.97, duration: 0.2 });
      }

      const result = await submitStamp(
        pair[index].ensName,
        label,
        address,
        walletClient ?? undefined,
        publicClient ?? undefined,
      );

      if (chosen) {
        gsap.to(chosen, { scale: 1, boxShadow: "none", duration: 0.2 });
      }
      if (other) {
        gsap.to(other, { opacity: 1, scale: 1, duration: 0.2 });
      }

      setBusy(false);

      if (!result.ok) {
        showToast(result.error, "error");
      } else {
        setSessionCount((c) => c + 1);
        showToast(
          `${pair[index].ensName} stamped as ${label}!`,
          "success",
        );
        setTimeout(nextRound, 600);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mounted, busy, isConnected, address, pair, label, walletClient, publicClient, showToast, nextRound],
  );

  if (!mounted || !pair || !label) {
    return (
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="h-6 w-40 rounded bg-zinc-100 dark:bg-zinc-800" />
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
          <div className="h-40 flex-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-40 flex-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
        </div>
      </div>
    );
  }

  const colors = STAMP_COLORS[label] ?? DEFAULT_COLOR;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Label prompt */}
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Vibe Check
        </p>
        <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Who&apos;s more{" "}
          <span className={colors.text}>{label}</span>?
        </p>
      </div>

      {/* Cards */}
      <div
        ref={containerRef}
        className="flex w-full flex-col gap-3 sm:flex-row sm:gap-4"
      >
        {pair.map((card, i) => (
          <button
            key={`${card.ensName}-${i}`}
            ref={(el) => { cardRefs.current[i] = el; }}
            type="button"
            disabled={busy}
            onClick={() => handlePick(i as 0 | 1)}
            className={`group relative flex flex-1 flex-col items-center gap-3 rounded-2xl border-2 border-zinc-200 bg-white px-6 py-6 transition-all hover:border-zinc-400 hover:shadow-md active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-zinc-500 ${busy ? "pointer-events-none" : ""}`}
          >
            {/* Avatar */}
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl(card.ensName)}
                alt={card.ensName}
                className="h-16 w-16 rounded-full border-2 border-zinc-100 object-cover dark:border-zinc-800 sm:h-20 sm:w-20"
                width={80}
                height={80}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>

            {/* Name */}
            <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100 sm:text-lg">
              {card.ensName}
            </span>

            {/* Hover hint */}
            <span className="text-[11px] text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-zinc-500">
              Tap to stamp
            </span>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={nextRound}
          disabled={busy}
          className="rounded-lg border border-dashed border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:border-zinc-500 hover:text-zinc-700 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-zinc-400 dark:hover:text-zinc-200"
        >
          Skip
        </button>

        {sessionCount > 0 ? (
          <span className="text-xs tabular-nums text-zinc-400 dark:text-zinc-500">
            {sessionCount} vibe check{sessionCount !== 1 ? "s" : ""}
          </span>
        ) : null}
      </div>

      {/* Wallet prompt */}
      {mounted && !isConnected ? (
        <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
          Connect your wallet to start stamping
        </p>
      ) : null}

      {/* Toast */}
      {toast ? (
        <div
          ref={toastRef}
          className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
          }`}
        >
          {toast.message}
        </div>
      ) : null}
    </div>
  );
}
