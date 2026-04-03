import Link from "next/link";

export default function AttestPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-6 px-6 py-16">
      <Link href="/" className="text-sm underline underline-offset-4">
        Home
      </Link>
      <h1 className="text-2xl font-semibold">Attest</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Intuition attestation flow is not wired yet. This route is a placeholder
        for subject / predicate / object and wallet-backed submission.
      </p>
    </main>
  );
}
