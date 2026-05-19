import type { Metadata } from 'next';
import './globals.css';
import { WalletContextProvider } from '@/components/WalletContextProvider';
import { AccessProvider } from '@/components/AccessProvider';
import { ImpactFeedProvider } from '@/components/ImpactFeedProvider';

export const metadata: Metadata = {
  title: 'S17 DEGEN by Impactory',
  description: '17 Ways Your Life is Broken — Pick One',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <WalletContextProvider>
          <AccessProvider>
            <ImpactFeedProvider>{children}</ImpactFeedProvider>
          </AccessProvider>
        </WalletContextProvider>
      </body>
    </html>
  );
}
