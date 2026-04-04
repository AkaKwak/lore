import type { EnsIdentity } from "@/lib/ens";

function isBrowserUrl(url: string): boolean {
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:")
  );
}

export function EnsIdentityCard({
  identity,
  vibe,
  total,
}: {
  identity: EnsIdentity;
  vibe?: string;
  total?: number;
}) {
  const { name, avatar, records } = identity;
  const showAvatar = avatar && isBrowserUrl(avatar);
  const twitter = records["com.twitter"];
  const github = records["com.github"];
  const url = records["url"];
  const loreStamps = records["com.lore.stamps"];
  const loreVibe = records["com.lore.vibe"];

  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
      {showAvatar ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={avatar}
          alt={`${name} avatar`}
          className="h-10 w-10 shrink-0 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
          width={40}
          height={40}
        />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dashed border-zinc-300 bg-zinc-50 text-[10px] text-zinc-400 dark:border-zinc-600 dark:bg-zinc-900">
          ?
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <h2 className="truncate text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {name}
          </h2>
          {loreStamps ? (
            <span
              className="inline-flex items-center rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
              title={`Lore stamps on ENS: ${loreStamps}${loreVibe ? ` — "${loreVibe}"` : ""}`}
            >
              Lore ✓
            </span>
          ) : null}
          {(twitter || github || url) ? (
            <div className="flex gap-2 text-[11px]">
              {twitter ? (
                <a
                  href={`https://x.com/${twitter.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  @{twitter.replace(/^@/, "")}
                </a>
              ) : null}
              {github ? (
                <a
                  href={`https://github.com/${github.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  gh/{github.replace(/^@/, "")}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="shrink-0 text-right">
        {vibe ? (
          <p className="text-xs italic text-zinc-500 dark:text-zinc-400">
            &ldquo;{vibe}&rdquo;
          </p>
        ) : null}
        {typeof total === "number" ? (
          <p className="tabular-nums text-xs font-medium text-zinc-400 dark:text-zinc-500">
            {total} stamp{total !== 1 ? "s" : ""}
          </p>
        ) : null}
      </div>
    </div>
  );
}
