"use client";

import { useEnsName } from "wagmi";
import { mainnet } from "wagmi/chains";
import { type Address } from "viem";

export function EnsName({
  address,
  className,
  fallback = "anon",
}: {
  address: Address;
  className?: string;
  fallback?: string;
}) {
  const { data: ensName } = useEnsName({
    address,
    chainId: mainnet.id,
  });

  return (
    <span className={className} title={ensName ?? fallback}>
      {ensName ?? fallback}
    </span>
  );
}
