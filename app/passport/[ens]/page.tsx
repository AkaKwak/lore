import Link from "next/link";

type Props = {
  params: Promise<{ ens: string }>;
};

export default async function PassportPage({ params }: Props) {
  const { ens } = await params;
  const decoded = decodeURIComponent(ens);

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-6 py-16">
      <Link href="/" className="text-sm underline underline-offset-4">
        Home
      </Link>
      <h1 className="text-2xl font-semibold">Passport</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        ENS read path is not wired yet. URL segment:{" "}
        <span className="font-mono text-foreground">{decoded}</span>
      </p>
    </main>
  );
}
