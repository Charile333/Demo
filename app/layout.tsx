import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './dynamic-bg-full.css';
import ClientLayout from './client-layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LUMI预测市场',
  description: '实时展示预测市场数据，支持多端适配和市场搜索',
  icons: {
    icon: '/image/LUMI1.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}