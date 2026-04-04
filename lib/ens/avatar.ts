import { type PublicClient } from "viem";
import { getEnsAvatar } from "viem/actions";
import { getIpfsGatewayBase } from "./config";

/**
 * Turn ipfs://… into HTTPS via configurable gateway for browser <img>.
 */
export function avatarUriToHttpUrl(uri: string): string {
  if (!uri.startsWith("ipfs://")) {
    return uri;
  }
  const gateway = getIpfsGatewayBase();
  const path = uri.slice("ipfs://".length).replace(/^ipfs\//, "");
  return `${gateway}/${path}`;
}

export async function fetchEnsAvatarDisplayUrl(
  client: PublicClient,
  normalizedName: string,
): Promise<string | null> {
  try {
    const uri = await getEnsAvatar(client, { name: normalizedName });
    if (uri == null || uri === "") {
      return null;
    }
    return avatarUriToHttpUrl(uri);
  } catch {
    return null;
  }
}
