import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { BottomNav } from '@/components/bottom-nav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Devocional Diário - Caminhando com Deus',
  description: 'Aplicativo devocional cristão completo',
  themeColor: '#0A2540',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`} suppressHydrationWarning>
        <div className="mx-auto max-w-md min-h-screen bg-white shadow-xl relative pb-16">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
