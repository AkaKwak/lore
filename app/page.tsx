import { HeroIntro } from "@/components/motion/HeroIntro";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-24">
        <HeroIntro />
        <section className="flex flex-col gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          <h2 className="text-base font-medium text-foreground">MVP flow</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Search — enter an ENS name and load the passport</li>
            <li>Passport — address, avatar, text records, Intuition claims</li>
            <li>Attest — create a structured attestation</li>
            <li>Proof — transaction hash and explorer links</li>
          </ol>
        </section>
        <nav className="flex flex-wrap gap-4 text-sm font-medium">
          <Link className="underline underline-offset-4" href="/attest">
            Attest (stub)
          </Link>
          <Link
            className="underline underline-offset-4"
            href="/passport/example.eth"
          >
            Passport URL shape
          </Link>
        </nav>
      </main>
    </div>
  );
}
