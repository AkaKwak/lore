import "server-only";

import { createEnsPublicClient } from "./client";
import { getMainnetRpcUrl } from "./config";
import { ENS_TEXT_RECORD_KEYS } from "./constants";
import { fetchEnsAvatarDisplayUrl } from "./avatar";
import { tryNormalizeEnsName } from "./normalize-name";
import { resolveEnsAddress } from "./resolve-address";
import { fetchEnsTextRecords } from "./text-records";
import type { EnsIdentity, EnsLoadError, EnsLoadResult } from "./types";

function rpcErrorMessage(err: unknown): EnsLoadError {
  const message =
    err instanceof Error && err.message
      ? err.message
      : "Could not reach the Ethereum RPC endpoint.";
  return { code: "RPC_ERROR", message };
}

export async function fetchEnsIdentity(rawName: string): Promise<EnsLoadResult> {
  const rpcUrl = getMainnetRpcUrl();
  if (!rpcUrl) {
    return {
      ok: false,
      error: {
        code: "CONFIG",
        message:
          "Missing NEXT_PUBLIC_MAINNET_RPC_URL. Add an Ethereum mainnet HTTP RPC URL to your environment.",
      },
    };
  }

  const normalized = tryNormalizeEnsName(rawName);
  if ("error" in normalized) {
    return { ok: false, error: normalized.error };
  }

  const client = createEnsPublicClient(rpcUrl);
  const { name } = normalized;

  let address: EnsIdentity["address"];
  try {
    address = (await resolveEnsAddress(client, name)) ?? undefined;
  } catch (err) {
    return { ok: false, error: rpcErrorMessage(err) };
  }

  if (!address) {
    return {
      ok: false,
      error: {
        code: "NOT_FOUND",
        message: "This ENS name does not resolve to an address on Ethereum mainnet.",
      },
    };
  }

  let records: Record<string, string> = {};
  let avatar: string | null = null;

  try {
    const [textResult, avatarResult] = await Promise.all([
      fetchEnsTextRecords(client, name, ENS_TEXT_RECORD_KEYS),
      fetchEnsAvatarDisplayUrl(client, name),
    ]);
    records = textResult;
    avatar = avatarResult;
  } catch (err) {
    return { ok: false, error: rpcErrorMessage(err) };
  }

  return {
    ok: true,
    identity: {
      name,
      address,
      avatar,
      records,
    },
  };
}
