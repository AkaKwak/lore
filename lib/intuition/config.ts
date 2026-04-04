/**
 * Default read endpoint (mainnet) — see Intuition GraphQL docs.
 * Override with NEXT_PUBLIC_INTUITION_GRAPHQL_URL when needed.
 */
export const DEFAULT_INTUITION_GRAPHQL_URL =
  "https://mainnet.intuition.sh/v1/graphql";

export function getIntuitionGraphqlUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_INTUITION_GRAPHQL_URL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_INTUITION_GRAPHQL_URL;
}

export function getIntuitionExplorerBase(): string | null {
  const u = process.env.NEXT_PUBLIC_INTUITION_EXPLORER_URL?.trim();
  return u && u.length > 0 ? u.replace(/\/+$/, "") : null;
}
