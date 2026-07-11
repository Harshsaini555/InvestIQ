import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/shared/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'InvestIQ Investment Intelligence Agent',
  description: 'Production-grade automated equity analysis and pipeline orchestration engine.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans min-h-screen bg-[#030303]`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
