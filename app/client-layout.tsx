'use client';

import { ReactNode } from 'react';
import { WalletProvider } from '@/components/wallet/WalletProvider';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return <WalletProvider>{children}</WalletProvider>;
}