"use client";

import { useRouter, useSearchParams } from "next/navigation";

const MODES = [
  { id: "vibe", label: "Vibe Check" },
  { id: "profile", label: "Profile" },
] as const;

export type GameMode = (typeof MODES)[number]["id"];

export function ModeTabs({ current }: { current: GameMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSwitch(mode: GameMode) {
    const params = new URLSearchParams(searchParams.toString());
    if (mode === "vibe") {
      params.delete("ens");
    }
    params.set("mode", mode);
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex gap-1 rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800">
      {MODES.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => handleSwitch(id)}
          className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
            current === id
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
              : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
