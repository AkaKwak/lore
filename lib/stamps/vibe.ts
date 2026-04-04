const VIBE_TEMPLATES: Record<string, string> = {
  "Builder+Creative": "creative builder energy",
  "Builder+Onchain": "onchain builder",
  "Trusted+Helpful": "community pillar",
  "Onchain+DeFi": "full degen",
};

export function deriveVibe(topTraits: string[]): string {
  if (topTraits.length === 0) return "";
  if (topTraits.length === 1) return topTraits[0].toLowerCase();

  for (let i = 0; i < topTraits.length - 1; i++) {
    for (let j = i + 1; j < topTraits.length; j++) {
      const key = `${topTraits[i]}+${topTraits[j]}`;
      const reverse = `${topTraits[j]}+${topTraits[i]}`;
      if (VIBE_TEMPLATES[key]) return VIBE_TEMPLATES[key];
      if (VIBE_TEMPLATES[reverse]) return VIBE_TEMPLATES[reverse];
    }
  }

  return topTraits.slice(0, 3).map((t) => t.toLowerCase()).join(", ");
}
