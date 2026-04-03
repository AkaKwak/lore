export type HexAddress = `0x${string}`;

export type EnsIdentity = {
  name: string;
  address?: HexAddress;
  avatar?: string | null;
  records: Record<string, string>;
};
