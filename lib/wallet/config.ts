import { http, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { INTUITION_CHAIN } from "@/lib/intuition/contract";

export const wagmiConfig = createConfig({
  chains: [INTUITION_CHAIN, mainnet],
  connectors: [injected()],
  transports: {
    [INTUITION_CHAIN.id]: http(INTUITION_CHAIN.rpcUrls.default.http[0]),
    [mainnet.id]: http(),
  },
  ssr: true,
});
