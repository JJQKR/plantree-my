import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReactQueryClientProvider } from '@/providers/query.provider';
import UserProvider from '@/lib/utils/FetchUserData';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Plantree',
  description: '효율적이고 풍부한 일상의 러닝메이트, 나만의 커스텀 다이어리'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryClientProvider>
      <UserProvider>
        <html lang="en">
          <body className={`${inter.className} font-sans`}>{children}</body>
        </html>
      </UserProvider>
    </ReactQueryClientProvider>
  );
}
