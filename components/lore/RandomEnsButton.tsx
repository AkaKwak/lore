"use client";

import { useRouter } from "next/navigation";

const NOTABLE_ENS = [
  "vitalik.eth",
  "nick.eth",
  "brantly.eth",
  "griff.eth",
  "lefteris.eth",
  "sassal.eth",
  "superphiz.eth",
  "poap.eth",
  "punk6529.eth",
  "0xdesigner.eth",
  "coltron.eth",
  "fireyes.eth",
];

export function RandomEnsButton() {
  const router = useRouter();

  function handleClick() {
    const name = NOTABLE_ENS[Math.floor(Math.random() * NOTABLE_ENS.length)];
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
