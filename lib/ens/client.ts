import { createPublicClient, http, type PublicClient } from "viem";
import { mainnet } from "viem/chains";

export function createEnsPublicClient(rpcUrl: string): PublicClient {
  return createPublicClient({
    chain: mainnet,
    transport: http(rpcUrl),
  });
}
