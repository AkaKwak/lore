import { getCachedEnsIdentity } from "@/lib/ens";
import { fetchLoreProfile, type LoreProfile } from "@/lib/intuition";
import { deriveVibe } from "@/lib/stamps";
import { EnsIdentityCard } from "@/components/lore/EnsIdentityCard";
import { EnsErrorBanner } from "@/components/ens/EnsErrorBanner";
import { StampPanel } from "@/components/stamps/StampPanel";
import { ClaimToEns } from "@/components/lore/ClaimToEns";

export async function LoreProfileSection({
  ensName,
}: {
  ensName: string;
}) {
  const ensResult = await getCachedEnsIdentity(ensName);

  if (!ensResult.ok) {
    return <EnsErrorBanner error={ensResult.error} />;
  }

  const loreResult = await fetchLoreProfile(ensResult.identity.name);

  const emptyProfile: LoreProfile = {
    ensName: ensResult.identity.name,
    total: 0,
    counts: {},
    topTraits: [],
    recent: [],
  };

  const profile = loreResult.ok ? loreResult.profile : emptyProfile;
  const vibe = deriveVibe(profile.topTraits);

  return (
    <div className="space-y-3">
      <EnsIdentityCard
        identity={ensResult.identity}
        vibe={vibe || undefined}
        total={profile.total}
      />

      <StampPanel profile={profile} ensName={ensResult.identity.name} />

      <ClaimToEns
        profile={profile}
        ownerAddress={ensResult.identity.address}
      />

      {!loreResult.ok ? (
        <p className="text-center text-xs text-amber-600 dark:text-amber-400">
          Intuition data unavailable — stamps shown locally only.
        </p>
      ) : null}
    </div>
  );
}
