export type StampRecord = {
  label: string;
  createdAt?: string;
  transactionHash?: string;
  actor?: string;
};

export type LoreProfile = {
  ensName: string;
  total: number;
  counts: Record<string, number>;
  topTraits: string[];
  recent: StampRecord[];
};

export type IntuitionFetchErrorCode = "GRAPHQL_ERROR" | "NETWORK_ERROR";

export type IntuitionFetchError = {
  code: IntuitionFetchErrorCode;
  message: string;
};

export type LoreProfileResult =
  | { ok: true; profile: LoreProfile }
  | { ok: false; error: IntuitionFetchError };
