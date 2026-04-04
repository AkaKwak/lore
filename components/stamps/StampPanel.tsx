"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { useAccount } from "wagmi";
import { CORE_STAMPS, submitStamp, deriveVibe } from "@/lib/stamps";
import type { LoreProfile } from "@/lib/intuition";
import { EnsName } from "@/components/ens/EnsName";
import { type Address, isAddress } from "viem";

const STAMP_COLORS: Record<string, { bg: string; bar: string; text: string }> =
  {
    Builder: {
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      bar: "bg-emerald-500",
      text: "text-emerald-700 dark:text-emerald-300",
    },
    Trusted: {
      bg: "bg-blue-50 dark:bg-blue-950/30",
      bar: "bg-blue-500",
      text: "text-blue-700 dark:text-blue-300",
    },
    Creative: {
      bg: "bg-violet-50 dark:bg-violet-950/30",
      bar: "bg-violet-500",
      text: "text-violet-700 dark:text-violet-300",
    },
    Helpful: {
      bg: "bg-amber-50 dark:bg-amber-950/30",
      bar: "bg-amber-500",
      text: "text-amber-700 dark:text-amber-300",
    },
    Speaker: {
      bg: "bg-rose-50 dark:bg-rose-950/30",
      bar: "bg-rose-500",
      text: "text-rose-700 dark:text-rose-300",
    },
    Curious: {
      bg: "bg-cyan-50 dark:bg-cyan-950/30",
      bar: "bg-cyan-500",
      text: "text-cyan-700 dark:text-cyan-300",
    },
    Onchain: {
      bg: "bg-orange-50 dark:bg-orange-950/30",
      bar: "bg-orange-500",
      text: "text-orange-700 dark:text-orange-300",
    },
    DeFi: {
      bg: "bg-pink-50 dark:bg-pink-950/30",
      bar: "bg-pink-500",
      text: "text-pink-700 dark:text-pink-300",
    },
  };

const DEFAULT_COLOR = {
  bg: "bg-zinc-50 dark:bg-zinc-900",
  bar: "bg-zinc-500",
  text: "text-zinc-700 dark:text-zinc-300",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function StampPanel({
  profile,
  ensName,
}: {
  profile: LoreProfile;
  ensName: string;
}) {
  const { isConnected, address } = useAccount();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [optimistic, setOptimistic] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const barRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const countRefs = useRef<Record<string, HTMLSpanElement | null>>({});
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
      setTimeout(() => setToast(null), 2500);
    },
    [],
  );

  function getCount(label: string) {
    return (profile.counts[label] ?? 0) + (optimistic[label] ?? 0);
  }

  const maxCount = Math.max(
    1,
    ...CORE_STAMPS.map((l) => getCount(l)),
  );

  const handleStamp = useCallback(
    async (label: string) => {
      if (!mounted) return;

      if (!isConnected || !address) {
        showToast("Connect your wallet first", "error");
        return;
      }

      // Optimistic update
      setOptimistic((prev) => ({
        ...prev,
        [label]: (prev[label] ?? 0) + 1,
      }));

      // GSAP bounce on button
      const btn = buttonRefs.current[label];
      if (btn) {
        gsap.fromTo(
          btn,
          { scale: 1 },
          { scale: 1.08, duration: 0.08, yoyo: true, repeat: 1 },
        );
      }

      // GSAP counter slide
      const countEl = countRefs.current[label];
      if (countEl) {
        gsap.fromTo(
          countEl,
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.2, ease: "power2.out" },
        );
      }

      // GSAP bar growth
      const barEl = barRefs.current[label];
      if (barEl) {
        const newCount = getCount(label) + 1;
        const newMax = Math.max(maxCount, newCount);
        const pct = Math.round((newCount / newMax) * 100);
        gsap.to(barEl, {
          width: `${pct}%`,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      const result = await submitStamp(ensName, label, address);

      if (!result.ok) {
        setOptimistic((prev) => ({
          ...prev,
          [label]: Math.max(0, (prev[label] ?? 1) - 1),
        }));
        showToast(result.error, "error");
      } else {
        showToast(`Added to the graph!`, "success");
      }
    },
    [mounted, isConnected, address, ensName, showToast, maxCount, getCount],
  );

  const vibe = deriveVibe(profile.topTraits);

  return (
    <div className="space-y-3">
      {/* Stamp grid — each button IS the graph visualization */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {CORE_STAMPS.map((label) => {
          const count = getCount(label);
          const colors = STAMP_COLORS[label] ?? DEFAULT_COLOR;
          const pct = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;

          return (
            <button
              key={label}
              ref={(el) => { buttonRefs.current[label] = el; }}
              type="button"
              onClick={() => handleStamp(label)}
              className={`relative flex items-center gap-2 overflow-hidden rounded-xl border-2 border-transparent px-3 py-3 text-left transition-all hover:border-zinc-300 active:scale-95 dark:hover:border-zinc-600 ${colors.bg}`}
            >
              {/* Background bar showing graph weight */}
              <div
                ref={(el) => { barRefs.current[label] = el; }}
                className={`absolute inset-y-0 left-0 opacity-20 ${colors.bar}`}
                style={{ width: `${pct}%` }}
              />
              <span
                className={`relative z-10 flex-1 text-sm font-semibold ${colors.text}`}
              >
                {label}
              </span>
              <span
                ref={(el) => { countRefs.current[label] = el; }}
                className="relative z-10 tabular-nums text-xs font-medium text-zinc-500 dark:text-zinc-400"
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Wallet prompt */}
      {mounted && !isConnected ? (
        <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
          Connect your wallet to stamp
        </p>
      ) : null}

      {/* Graph activity feed */}
      {profile.recent.length > 0 ? (
        <div className="space-y-1 border-t border-zinc-100 pt-2 dark:border-zinc-800">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Recent graph activity
          </h4>
          <ul className="space-y-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            {profile.recent.slice(0, 5).map((r, i) => (
              <li key={i} className="flex items-baseline gap-1">
                <span
                  className={`font-semibold ${(STAMP_COLORS[r.label] ?? DEFAULT_COLOR).text}`}
                >
                  {r.label}
                </span>
                {r.actor && isAddress(r.actor) ? (
                  <>
                    <span>by</span>
                    <EnsName
                      address={r.actor as Address}
                      className="font-medium text-zinc-600 dark:text-zinc-300"
                    />
                  </>
                ) : null}
                {r.createdAt ? (
                  <span className="ml-auto text-zinc-400 dark:text-zinc-500">
                    {timeAgo(r.createdAt)}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
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
