# ENS Reputation Passport

Hackathon bootstrap project for the **Most Creative Use of ENS** prize.

## Pitch

**ENS Reputation Passport** turns an ENS name into a programmable, human-readable identity enriched with verifiable attestations from Intuition.

- **ENS** = identity, resolution, portability, and discovery layer
- **Intuition** = knowledge graph layer with structured claims and trust signals
- **App** = a web3 passport that is viewable, attestable, shareable, and demo-friendly

The user enters `alice.eth`; the application:

1. resolves the ENS name;
2. reads the avatar and useful text records;
3. fetches Intuition attestations and relations;
4. derives badges / categories / a concise score;
5. lets a connected wallet add an attestation.

---

## Why this fits the ENS prize

The ENS brief calls for use cases where ENS is **not just a name → address lookup**.

Here, ENS is central:

- primary user identity (`name.eth` instead of a hex address);
- public discovery via **text records**;
- compatibility with wallets and applications;
- a profile that is human-readable and programmatically usable.

Intuition strengthens ENS with **verifiable claims**:

- Atoms = entities
- Triples = relations / structured assertions
- Signals = weight / conviction / reputation

---

## Target MVP

### Screen 1 — Search
- ENS input field
- CTA `Load Passport`

### Screen 2 — Passport
- ENS name
- resolved address
- ENS avatar
- key text records
- Intuition attestations
- summary score
- badges

### Screen 3 — Attest
- subject
- predicate
- object
- create-attestation action

### Screen 4 — Proof / Demo
- transaction hash
- link to Intuition Portal
- link to ENS Manager / resolver state if useful

---

## Recommended stack

- **Next.js 14+**
- **TypeScript**
- **Tailwind CSS**
- **viem**
- **wagmi**
- **@0xintuition/sdk**
- **GraphQL** for Intuition reads if faster to ship than a write-first integration
- **Vercel** for quick deployment

---

## Recommended layout

```txt
.
├─ app/
│  ├─ page.tsx
│  ├─ passport/[ens]/page.tsx
│  ├─ attest/page.tsx
│  └─ api/
├─ components/
│  ├─ ens/
│  ├─ intuition/
│  ├─ passport/
│  └─ ui/
├─ lib/
│  ├─ ens/
│  │  ├─ client.ts
│  │  ├─ resolve.ts
│  │  ├─ records.ts
│  │  └─ avatar.ts
│  ├─ intuition/
│  │  ├─ client.ts
│  │  ├─ queries.ts
│  │  ├─ graph.ts
│  │  └─ writes.ts
│  ├─ score/
│  │  └─ reputation.ts
│  └─ utils/
├─ public/
├─ .env.example
└─ README.md
```

---

## Key product decisions

### 1. ENS is the canonical entry
Everything starts from an ENS name. Avoid UX that centers the raw address first.

### 2. ENS text records = light, interoperable layer
Use text records for **simple, public** metadata:

- `description`
- `url`
- `avatar`
- `com.twitter`
- `com.github`
- `org.intuition.profile`
- `org.intuition.subject`
- `org.project.version`

### 3. Intuition = source of reputation truth
Do not try to write everything into ENS. ENS points; Intuition structures.

### 4. Fast reads, focused writes
For the hackathon:

- reliable, immediate ENS reads;
- rich Intuition reads;
- Intuition writes on a single attestation flow.

---

## Six-step build plan

### Step 1 — App shell
- init Next.js + TypeScript + Tailwind
- wire wagmi / viem
- simple home page

### Step 2 — ENS read path
- resolve ENS
- fetch address
- fetch avatar
- fetch text records
- clear error states

### Step 3 — Intuition read path
- fetch claims / triples tied to identity
- map to readable badges
- define a simple, transparent score

### Step 4 — Passport UI
- identity card
- records block
- attestations block
- score block

### Step 5 — Attestation flow
- connected wallet
- S-P-O form
- create atom / triple when needed
- show result

### Step 6 — Demo polish
- real example ENS names
- readable seed data
- demo video
- judges / booth flow page under ~30 seconds

---

## Recommended score heuristic

The score should not feel like a black box. It should be explainable.

Example MVP formula:

```txt
reputationScore =
  baseClaimsWeight
+ uniqueAttestorsWeight
+ recentClaimsBonus
+ positiveSignalsWeight
```

Example labels:

- `Trusted Builder`
- `Frontend Contributor`
- `Hackathon Shipper`
- `Verified Collaborator`

---

## References to keep handy while building

### ENS
- Docs: https://docs.ens.domains/
- Resolution: https://docs.ens.domains/resolution/
- Universal Resolver: https://docs.ens.domains/resolvers/universal/
- Text Records / ENSIP-5: https://docs.ens.domains/ens-improvement-proposals/ensip-5-text-records
- Avatar / ENSIP-12: https://docs.ens.domains/ensip/12
- Profile Text Records / ENSIP-18: https://docs.ens.domains/ensip/18

### Intuition
- Docs: https://docs.intuition.systems/docs
- Choose Your Path: https://docs.intuition.systems/docs/getting-started/choose-your-path
- Tutorials Overview: https://docs.intuition.systems/docs/tutorials/overview
- Create Triple: https://docs.intuition.systems/docs/interaction-guide/create-triple
- Portal: https://portal.intuition.systems

---

## Suggested environment variables

Create `.env.local` from `.env.example`.

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_MAINNET_RPC_URL=
NEXT_PUBLIC_BASE_RPC_URL=
NEXT_PUBLIC_INTUITION_GRAPHQL_URL=
NEXT_PUBLIC_INTUITION_EXPLORER_URL=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> Only use `NEXT_PUBLIC_` for values that are truly safe to expose in the browser.

---

## Quick start commands

```bash
pnpm install
pnpm dev
```

Production build:

```bash
pnpm build
pnpm start
```

---

## Ideal hackathon demo script

1. Enter `alice.eth`
2. Show address, avatar, ENS records
3. Show Intuition claims
4. Explain the score
5. Create a new attestation live
6. Refresh and show that nothing critical is hardcoded

---

## Bonus extensions if time allows

### A. Subnames as access tokens
- `alice.builder.project.eth`
- role and access carried by ENS + attested via Intuition

### B. Privacy mode
- minimal ENS records + richer proofs in Intuition
- segmentation public / attested / private

### C. Contextual experience
- a third-party client or service can use ENS, records, and reputation to tailor the experience

---

## Definition of done

The project is ready when:

- ENS is essential to the UX;
- the app resolves real names;
- ENS records are actually read;
- Intuition data is actually queried;
- at least one attestation flow is live;
- the demo fits in under 60 seconds;
- nothing critical is hardcoded.

---

## License / usage

Free to use for hackathon bootstrapping and fast iteration.
