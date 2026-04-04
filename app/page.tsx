import { Suspense } from "react";
import { EnsSearch } from "@/components/lore/EnsSearch";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { RandomEnsButton } from "@/components/lore/RandomEnsButton";
import { LoreProfileSection } from "./lore-section";

const DEFAULT_ENS = "vitalik.eth";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const ensQuery =
    typeof params.ens === "string" ? params.ens.trim() : undefined;
  const ensToLoad = ensQuery || DEFAULT_ENS;

  return (
    <div className="flex min-h-full flex-col">
      <header className="mx-auto flex w-full max-w-2xl flex-wrap items-center gap-2 px-4 pt-4 sm:px-6">
        <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          lore
        </span>
        <div className="flex flex-1 items-center justify-center gap-1.5">
          <Suspense fallback={null}>
            <EnsSearch />
          </Suspense>
          <RandomEnsButton />
        </div>
        <ConnectButton />
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-4 sm:px-6">
        <Suspense
          fallback={
            <div className="animate-pulse space-y-3">
              <div className="h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800"
                  />
                ))}
              </div>
            </div>
          }
        >
          <LoreProfileSection ensName={ensToLoad} />
        </Suspense>
      </main>
    </div>
  );
}
