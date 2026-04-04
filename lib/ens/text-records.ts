import { type PublicClient } from "viem";
import { getEnsText } from "viem/actions";
import type { EnsTextRecordKey } from "./constants";

export async function fetchEnsTextRecords(
  client: PublicClient,
  normalizedName: string,
  keys: readonly EnsTextRecordKey[],
): Promise<Record<string, string>> {
  const entries = await Promise.all(
    keys.map(async (key) => {
      try {
        const value = await getEnsText(client, {
          name: normalizedName,
          key,
        });
        if (value == null || value === "") {
          return null;
        }
        return [key, value] as const;
      } catch {
        return null;
      }
    }),
  );

  const out: Record<string, string> = {};
  for (const row of entries) {
    if (row) {
      out[row[0]] = row[1];
    }
  }
  return out;
}
