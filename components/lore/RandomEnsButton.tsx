"use client";

import { useRouter } from "next/navigation";
import { NOTABLE_ENS, pickRandom } from "@/lib/ens/notable";

export function RandomEnsButton() {
  const router = useRouter();

  function handleClick() {
    const name = pickRandom(NOTABLE_ENS);
    router.push(`/?ens=${encodeURIComponent(name)}`);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-lg border border-dashed border-zinc-300 px-2.5 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:border-zinc-500 hover:text-zinc-700 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-zinc-400 dark:hover:text-zinc-200"
    >
      Explore
    </button>
  );
}
