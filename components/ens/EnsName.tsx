"use client";

import { useEnsName } from "wagmi";
import { mainnet } from "wagmi/chains";
import { type Address } from "viem";

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function EnsName({
  address,
  className,
}: {
  address: Address;
  className?: string;
}) {
  const { data: ensName } = useEnsName({
    address,
    chainId: mainnet.id,
  });

  return (
    <span className={className} title={address}>
      {ensName ?? truncateAddress(address)}
    </span>
  );
}
