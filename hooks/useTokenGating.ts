'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { SDEGEN_TOKENS } from '@/constants/tokens';
import { isPlaceholderMint, SOLANA_RPC_ENDPOINT } from '@/lib/solana';

type BalancesByMint = Record<string, number>;

type ParsedTokenAmount = {
  amount: string;
  decimals: number;
  uiAmount: number | null;
};

type ParsedTokenAccount = {
  account: {
    data: {
      parsed: {
        info: {
          mint: string;
          tokenAmount: ParsedTokenAmount;
        };
      };
    };
  };
};

function getUiBalance(tokenAmount: ParsedTokenAmount) {
  if (typeof tokenAmount.uiAmount === 'number') return tokenAmount.uiAmount;
  const raw = Number(tokenAmount.amount);
  if (!Number.isFinite(raw)) return 0;
  return raw / 10 ** tokenAmount.decimals;
}

export function useTokenGating() {
  const { publicKey, connected } = useWallet();
  const [balancesByMint, setBalancesByMint] = useState<BalancesByMint>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshNonce, setRefreshNonce] = useState(0);

  const connection = useMemo(() => new Connection(SOLANA_RPC_ENDPOINT, 'confirmed'), []);

  const refresh = useCallback(() => {
    setRefreshNonce((value) => value + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchBalances() {
      if (!connected || !publicKey) {
        setBalancesByMint({});
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await connection.getParsedTokenAccountsByOwner(publicKey, {
          programId: TOKEN_PROGRAM_ID,
        });

        if (cancelled) return;

        const nextBalances = response.value.reduce<BalancesByMint>((acc, item) => {
          const parsedItem = item as unknown as ParsedTokenAccount;
          const info = parsedItem.account.data.parsed.info;
          acc[info.mint] = (acc[info.mint] || 0) + getUiBalance(info.tokenAmount);
          return acc;
        }, {});

        setBalancesByMint(nextBalances);
      } catch (fetchError) {
        if (cancelled) return;
        const message = fetchError instanceof Error ? fetchError.message : 'RPC request failed. Try again in a moment.';
        setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchBalances();

    return () => {
      cancelled = true;
    };
  }, [connected, publicKey, connection, refreshNonce]);

  const unlockedSdgNumbers = useMemo(() => {
    return SDEGEN_TOKENS.filter((token) => {
      if (isPlaceholderMint(token.mintAddress)) return false;
      return (balancesByMint[token.mintAddress] || 0) >= token.requiredBalance;
    }).map((token) => token.sdgNumber);
  }, [balancesByMint]);

  const isUnlocked = useCallback(
    (sdgNumber: number) => unlockedSdgNumbers.includes(sdgNumber),
    [unlockedSdgNumbers],
  );

  const getTokenBalance = useCallback(
    (mintAddress: string) => {
      if (isPlaceholderMint(mintAddress)) return 0;
      return balancesByMint[mintAddress] || 0;
    },
    [balancesByMint],
  );

  return {
    balancesByMint,
    unlockedSdgNumbers,
    isUnlocked,
    getTokenBalance,
    loading,
    error,
    refresh,
    connected,
    publicKey,
  };
}
