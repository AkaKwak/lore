import "server-only";

import { unstable_cache } from "next/cache";
import { fetchEnsIdentity } from "./fetch-identity";
import type { EnsLoadResult } from "./types";

/**
 * Cached version of fetchEnsIdentity.
 * Revalidates every 5 minutes — ENS data rarely changes, so this
 * eliminates ~7 RPC calls per visitor for popular names.
 */
export const getCachedEnsIdentity: (
  rawName: string,
) => Promise<EnsLoadResult> = unstable_cache(
  fetchEnsIdentity,
  ["ens-identity"],
  { revalidate: 300 },
);
