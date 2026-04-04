# Lore

**Lore** is a gamified, ENS-native social app. Stamp ENS identities with curated traits, compare them in head-to-head vibe checks, and collectively build a playful onchain social graph powered by **Intuition**.

> *Stamp ENS identities. Build their legend.*

## Game modes

### Profile
Look up any ENS name. See their identity card (avatar, bio, address). Stamp them with traits from a fixed grid. Watch the graph grow.

### Vibe Check
Two random ENS appear side by side. "Who's more Builder?" Tap your pick — one stamp goes onchain. New pair, new label. Infinite loop.

### Event Poll
A list of ENS (e.g. event speakers). One question: "Who's the best Speaker?" Crowd votes in real time. Live leaderboard.

## How it works

Every interaction — whether in Profile, Vibe Check, or Event Poll — writes the same atomic action:

**1 tap = 1 stamp = 1 Intuition triple**

```
subject: vitalik.eth
predicate: hasLoreStamp
object: Builder
```

Users play a fun game. The knowledge graph is the side effect.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4
- **viem** for ENS resolution
- **wagmi** + **@tanstack/react-query** for wallet
- **GSAP** for micro-animations
- **Intuition** via GraphQL (read) + protocol SDK (write)

## Getting started

```bash
pnpm install
cp .env.example .env.local
# Fill in NEXT_PUBLIC_MAINNET_RPC_URL — see .env.example
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

See **`.env.example`** for the full list. Never commit `.env.local` or secrets.

## Code organization

```
app/                    Routes, layout, server components
components/
  ens/                  ENS display (name, error banner)
  lore/                 Profile mode (search, identity card, claim)
  stamps/               Stamp grid and panel
  game/                 Vibe Check, Event Poll, Common Vibes
  wallet/               Connect button
lib/
  ens/                  ENS resolution, avatar, text records, caching
  intuition/            Intuition GraphQL reads, write service, types
  stamps/               Stamp registry, vibe derivation, service
  wallet/               wagmi config, providers
```

## Links

- [ENS docs](https://docs.ens.domains/)
- [Intuition docs](https://docs.intuition.systems/docs)
