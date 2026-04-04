export type HexAddress = `0x${string}`;

export type EnsIdentity = {
  name: string;
  address?: HexAddress;
  avatar?: string | null;
  records: Record<string, string>;
};

export type EnsLoadErrorCode =
  | "CONFIG"
  | "INVALID_NAME"
  | "NOT_FOUND"
  | "RPC_ERROR";

export type EnsLoadError = {
  code: EnsLoadErrorCode;
  message: string;
};

export type EnsLoadResult =
  | { ok: true; identity: EnsIdentity }
  | { ok: false; error: EnsLoadError };
