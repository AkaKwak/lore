const MAINNET_RPC_ENV = "NEXT_PUBLIC_MAINNET_RPC_URL";

export function getMainnetRpcUrl(): string | null {
  const url = process.env[MAINNET_RPC_ENV]?.trim();
  return url && url.length > 0 ? url : null;
}

const DEFAULT_IPFS_GATEWAY = "https://ipfs.io/ipfs";

/**
 * Base URL for converting ipfs:// avatar URIs to HTTPS (trailing slashes stripped).
 */
export function getIpfsGatewayBase(): string {
  const raw = process.env.NEXT_PUBLIC_IPFS_GATEWAY?.trim();
  const base = raw && raw.length > 0 ? raw : DEFAULT_IPFS_GATEWAY;
  return base.replace(/\/+$/, "");
}
