export const LORE_PREDICATE = "hasLoreStamp";

export const LORE_STAMPS_QUERY = `
query LoreStamps($subjectLabel: String!, $predicate: String!, $limit: Int!) {
  triples(
    where: {
      subject: { label: { _eq: $subjectLabel } }
      predicate: { label: { _eq: $predicate } }
    }
    limit: $limit
    order_by: { created_at: desc }
  ) {
    term_id
    created_at
    transaction_hash
    object {
      label
    }
    creator {
      id
      label
    }
  }
}
`;

export function loreStampsVariables(ensName: string) {
  return {
    subjectLabel: ensName,
    predicate: LORE_PREDICATE,
    limit: 200,
  };
}
