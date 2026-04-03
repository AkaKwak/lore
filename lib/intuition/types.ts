export type PassportClaim = {
  id: string;
  subject: string;
  predicate: string;
  object: string;
  confidence?: number;
  source?: string;
  createdAt?: string;
};

/**
 * Read-side adapter — implement when Intuition SDK or GraphQL contract is wired.
 * Do not couple UI components to raw protocol responses; map into PassportClaim[].
 */
export interface IntuitionReadAdapter {
  listClaimsForEns(normalizedName: string): Promise<PassportClaim[]>;
}
