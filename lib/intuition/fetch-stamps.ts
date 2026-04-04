import "server-only";

import { getIntuitionGraphqlUrl } from "./config";
import { LORE_STAMPS_QUERY, loreStampsVariables } from "./queries";
import type { LoreProfile, LoreProfileResult, StampRecord } from "./types";

type TripleRow = {
  term_id: string;
  created_at: string;
  transaction_hash?: string;
  object: { label: string } | null;
  creator: { id: string; label: string } | null;
};

type GraphQLResponse = {
  data?: { triples: TripleRow[] };
  errors?: Array<{ message: string }>;
};

export async function fetchLoreProfile(
  normalizedEnsName: string,
): Promise<LoreProfileResult> {
  const url = getIntuitionGraphqlUrl();

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: LORE_STAMPS_QUERY,
        variables: loreStampsVariables(normalizedEnsName),
      }),
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return {
        ok: false,
        error: {
          code: "NETWORK_ERROR",
          message: `GraphQL HTTP ${res.status}: ${res.statusText}`,
        },
      };
    }

    const json = (await res.json()) as GraphQLResponse;

    if (json.errors?.length) {
      return {
        ok: false,
        error: {
          code: "GRAPHQL_ERROR",
          message: json.errors.map((e) => e.message).join("; "),
        },
      };
    }

    const rows = json.data?.triples ?? [];
    return { ok: true, profile: aggregate(normalizedEnsName, rows) };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to reach Intuition GraphQL.";
    return { ok: false, error: { code: "NETWORK_ERROR", message } };
  }
}

function aggregate(ensName: string, rows: TripleRow[]): LoreProfile {
  const counts: Record<string, number> = {};
  const recent: StampRecord[] = [];

  for (const row of rows) {
    const label = row.object?.label;
    if (!label) continue;

    counts[label] = (counts[label] ?? 0) + 1;

    if (recent.length < 5) {
      recent.push({
        label,
        createdAt: row.created_at,
        transactionHash: row.transaction_hash,
        actor: row.creator?.id,
      });
    }
  }

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const topTraits = sorted.slice(0, 3).map(([label]) => label);

  return { ensName, total: rows.length, counts, topTraits, recent };
}
