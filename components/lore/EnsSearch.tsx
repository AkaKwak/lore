"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

export function EnsSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("ens") ?? "";
  const [value, setValue] = useState(current);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    router.push(`/?ens=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-1.5">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="search ENS…"
        autoComplete="off"
        spellCheck={false}
        className="w-36 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-sm text-zinc-900 outline-none ring-zinc-400 transition-shadow placeholder:text-zinc-400 focus:w-48 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 sm:w-44 sm:focus:w-56"
      />
      <button
        type="submit"
        className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        Go
      </button>
    </form>
  );
}
