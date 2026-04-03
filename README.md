# ENS Reputation Passport

Projet hackathon bootstrapé pour le prize **Most Creative Use of ENS**.

## Pitch

**ENS Reputation Passport** transforme un nom ENS en identité programmable et lisible, enrichie par des attestations vérifiables provenant d'Intuition.

- **ENS** = couche d'identité, de résolution, de portabilité et de découverte
- **Intuition** = couche de graphe de connaissance, de claims structurés et de signaux de confiance
- **App** = un passeport web3 consultable, attestable, partageable et demo-friendly

L'utilisateur saisit `alice.eth`, l'application :

1. résout le nom ENS ;
2. lit l'avatar et les text records utiles ;
3. récupère les attestations et relations Intuition ;
4. calcule des badges / catégories / score synthétique ;
5. permet à un wallet connecté d'ajouter une attestation.

---

## Pourquoi ce projet a du sens pour le prize ENS

Le brief ENS veut des usages où ENS n'est **pas juste un lookup name → address**.

Ici, ENS est central :

- identité primaire utilisateur (`nom.eth` au lieu d'une adresse hex) ;
- couche publique de découverte via les **text records** ;
- compatibilité avec les wallets et les applications ;
- support naturel d'un profil lisible par des humains et exploitable de façon programmatique.

Intuition renforce ENS avec des **claims vérifiables** :

- Atoms = entités
- Triples = relations / assertions structurées
- Signals = poids / conviction / réputation

---

## MVP cible

### Écran 1 — Search
- champ ENS
- CTA `Load Passport`

### Écran 2 — Passport
- nom ENS
- adresse résolue
- avatar ENS
- text records clés
- attestations Intuition
- score résumé
- badges

### Écran 3 — Attest
- subject
- predicate
- object
- bouton de création d'attestation

### Écran 4 — Proof / Demo
- hash de transaction
- lien vers Intuition Portal
- lien vers ENS Manager / resolver state si utile

---

## Stack recommandée

- **Next.js 14+**
- **TypeScript**
- **Tailwind CSS**
- **viem**
- **wagmi**
- **@0xintuition/sdk**
- **GraphQL** pour les lectures Intuition si plus rapide à ship que l'intégration write-first
- **Vercel** pour le déploiement rapide

---

## Arborescence recommandée

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

## Décisions produit importantes

### 1. ENS est l'entrée canonique
Tout part d'un nom ENS. Évite une UX centrée d'abord sur l'adresse.

### 2. ENS text records = couche légère et interopérable
Utiliser les text records pour des métadonnées **simples et publiques** :

- `description`
- `url`
- `avatar`
- `com.twitter`
- `com.github`
- `org.intuition.profile`
- `org.intuition.subject`
- `org.project.version`

### 3. Intuition = source de vérité réputationnelle
Ne pas tenter de tout écrire dans ENS. ENS pointe, Intuition structure.

### 4. Lecture rapide, écriture ciblée
Pour le hackathon :
- lecture ENS fiable et immédiate ;
- lecture Intuition riche ;
- écriture Intuition sur un flow unique d'attestation.

---

## Plan de build en 6 étapes

### Étape 1 — Base app
- init Next.js + TypeScript + Tailwind
- brancher wagmi / viem
- page home simple

### Étape 2 — ENS read path
- resolve ENS
- fetch address
- fetch avatar
- fetch text records
- afficher erreurs propres

### Étape 3 — Intuition read path
- récupérer claims / triples liés à l'identité
- mapper en badges lisibles
- définir un score simple et transparent

### Étape 4 — Passport UI
- carte identité
- bloc records
- bloc attestations
- bloc score

### Étape 5 — Attestation flow
- wallet connecté
- formulaire S-P-O
- create atom / triple si nécessaire
- afficher résultat

### Étape 6 — Demo polish
- ENS d'exemple réels
- seed data lisible
- vidéo de démo
- page judges / booth flow en 30 secondes

---

## Heuristique de score recommandée

Le score ne doit pas être “magique”. Il doit être explicable.

Exemple de formule MVP :

```txt
reputationScore =
  baseClaimsWeight
+ uniqueAttestorsWeight
+ recentClaimsBonus
+ positiveSignalsWeight
```

Exemple d'affichage :
- `Trusted Builder`
- `Frontend Contributor`
- `Hackathon Shipper`
- `Verified Collaborator`

---

## Sources et docs à garder ouvertes pendant le build

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

## Variables d'environnement suggérées

Créer un `.env.local` basé sur `.env.example`.

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_MAINNET_RPC_URL=
NEXT_PUBLIC_BASE_RPC_URL=
NEXT_PUBLIC_INTUITION_GRAPHQL_URL=
NEXT_PUBLIC_INTUITION_EXPLORER_URL=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> Garde les variables de lecture en `NEXT_PUBLIC_` uniquement si elles sont vraiment publiques.

---

## Commandes démarrage rapide

```bash
pnpm install
pnpm dev
```

Build de prod :

```bash
pnpm build
pnpm start
```

---

## Démo hackathon idéale

Script de démo :

1. saisir `alice.eth`
2. voir l'adresse, l'avatar, les records ENS
3. afficher les claims Intuition
4. expliquer le score
5. créer une nouvelle attestation en live
6. recharger et montrer qu'aucune donnée n'est hardcodée

---

## Extensions bonus si temps restant

### A. Subnames comme access tokens
- `alice.builder.project.eth`
- rôle et accès portés par ENS + attestés via Intuition

### B. Privacy mode
- records ENS minimaux + preuves riches dans Intuition
- segmentation public / attesté / privé

### C. Expérience contextuelle
- un client ou service tiers peut s'appuyer sur ENS, les records et la réputation pour personnaliser l'expérience

---

## Définition du succès

Le projet est prêt quand :

- ENS est indispensable à l'UX ;
- l'app résout de vrais noms ;
- les records ENS sont réellement lus ;
- les données Intuition sont réellement requêtées ;
- au moins un flow d'attestation est live ;
- la démo passe en moins de 60 secondes ;
- rien de critique n'est hardcodé.

---

## Licence / usage

Usage libre pour bootstrap de hackathon et démarrage rapide.
