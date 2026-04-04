import { normalize } from "viem/ens";
import type { EnsLoadError } from "./types";

export function tryNormalizeEnsName(raw: string): { name: string } | { error: EnsLoadError } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return {
      error: {
        code: "INVALID_NAME",
        message: "Enter an ENS name.",
      },
    };
  }

  try {
    return { name: normalize(trimmed) };
  } catch {
    return {
      error: {
        code: "INVALID_NAME",
        message: "This name is not a valid ENS name.",
      },
    };
  }
}
