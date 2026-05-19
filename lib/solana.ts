export const SOLANA_RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

export function isPlaceholderMint(mintAddress: string) {
  return mintAddress.startsWith('REPLACE_WITH_');
}
