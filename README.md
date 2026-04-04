# Lore

**Lore** is a playful, ENS-native social stamping app. Look up any ENS name, stamp it with curated traits, and collectively build a fun onchain social graph powered by **Intuition**.

> *Stamp ENS identities. Build their legend.*

## What the app does

1. **Single-page experience** (`/`) — search for an ENS name, view identity (avatar, address, text records), stamp it, and see aggregated results.
2. **Stamp grid** — 8 core stamps (Builder, Trusted, Creative...), 3 wild cards per ENS, and a rotating daily stamp.
3. **Wallet connect** — connect via injected wallet (MetaMask etc.) to write stamps to Intuition.
4. **Lore profile** — aggregated stamp counts, top traits, vibe label, and recent activity.
5. **OG image** — shareable card via `/api/og?ens=name.eth`.

## Architecture

- **ENS** = human-readable identity layer (resolution via viem + Universal Resolver).
- **Intuition** = structured reputation graph (Triple: subject=ENS, predicate=`hasLoreStamp`, object=stamp label).
- **Cache** = `unstable_cache` for ENS (5min), fetch cache for Intuition (30s), optimistic UI for writes.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4
- **viem** for ENS / Ethereum
- **wagmi** + **@tanstack/react-query** for wallet integration
- **GSAP** for micro-animations
- Intuition via GraphQL

## Prerequisites

- Node.js **>= 20.9** (see `package.json` / `engines`)

## Getting started

```bash
npm install
cp .env.example .env.local
# Fill in at minimum NEXT_PUBLIC_MAINNET_RPC_URL — see .env.example
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts: `npm run build`, `npm run lint`.

## Environment variables

See **`.env.example`** for the full list.
Never commit `.env.local` or secrets.

## Code organization

- `app/` — routes, layout, server components
- `components/lore/` — stamp grid, identity card, search, results, feed
- `components/wallet/` — connect button
- `components/motion/` — GSAP-based hero animation
- `lib/ens/` — ENS resolution, avatar, text records, caching
- `lib/intuition/` — GraphQL reads, write service, types
- `lib/stamps/` — stamp registry (core, wild, daily), vibe derivation
- `lib/wallet/` — wagmi config, providers

Agent/contributor rules: `.cursor/rules/*.mdc`.

## Links

- [ENS docs](https://docs.ens.domains/)
- [Intuition docs](https://docs.intuition.systems/docs)
