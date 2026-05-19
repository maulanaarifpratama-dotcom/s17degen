# S17 DEGEN Token Launch Checklist

S17 DEGEN: Sustainable 17: Digital Engagement for Global Empowerment Network.

Use this checklist for each of the 17 experimental meme-based access tokens before and after launch.

## 1. Token identity checklist

- Confirm SDG number and SDG name.
- Confirm token symbol exactly matches `constants/tokens.ts`.
- Confirm token name and meme narrative.
- Confirm hidden acronym and utility framing.
- Confirm required access balance.
- Confirm token image asset path:
  - `/public/tokens/<symbol-lowercase>.png`
  - Example: `/public/tokens/bumipanas.png`
- Avoid financial-return language in token metadata, social copy, and app copy.
- Avoid donation or crowdfunding framing.
- Frame the token as an experimental access token.

## 2. Pump.fun launch checklist

- Create the token on Pump.fun using the approved symbol, name, and image.
- Verify the token metadata renders correctly on Pump.fun.
- Copy the official Pump.fun token URL.
- Copy the official SPL mint address.
- Confirm S17 DEGEN does not iframe, embed, or replicate Pump.fun trading.
- Confirm users are instructed to buy externally, return, connect wallet, and verify access.

## 3. Mint address update workflow

For each launched token:

1. Open `constants/tokens.ts`.
2. Find the token by `symbol`.
3. Replace:
   - `mintAddress: 'REPLACE_WITH_<SYMBOL>_MINT'`
4. With the real SPL mint address from Pump.fun.
5. Replace:
   - `pumpFunLink: 'https://pump.fun/REPLACE_WITH_<SYMBOL>'`
6. With the official Pump.fun token URL.
7. Keep `requiredBalance` aligned with product access rules.
8. Run validation locally before deployment.

## 4. Vercel redeploy checklist

- Confirm `NEXT_PUBLIC_SOLANA_RPC_URL` is configured in Vercel if using a dedicated RPC provider.
- If not configured, app falls back to `https://api.mainnet-beta.solana.com`.
- Push updated `constants/tokens.ts` and any token image assets.
- Trigger Vercel deployment.
- Confirm build completes successfully.
- Confirm `/`, `/dashboard`, and `/transparency` load correctly.

## 5. Post-launch verification checklist

- Connect Phantom wallet.
- Connect Solflare wallet.
- Test a wallet with no S17 DEGEN tokens:
  - Cards should remain locked.
  - Dashboard gated features should show locked states.
- Test a wallet holding a launched token:
  - Balance should be detected through Solana RPC.
  - Matching SDG feature should unlock.
- Click each Pump.fun CTA:
  - Must open in a new tab.
  - Must use external Pump.fun URL.
  - Must set `s17:last-buy-intent` in localStorage.
- Return to S17 DEGEN:
  - Banner should show: `Bought $SYMBOL? Connect wallet and Verify Access.`
  - Banner should be dismissible.
- Verify no seed phrase, private key, custody, donation, crowdfunding, or in-app trading flow exists.
