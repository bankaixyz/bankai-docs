import { Provider } from '@/components/provider';
import './global.css';
import type { Metadata } from 'next';
import { IBM_Plex_Mono, Manrope } from 'next/font/google';

const sans = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-sans',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Bankai Docs',
    template: '%s | Bankai Docs',
  },
  description: 'Public documentation for Bankai product concepts, chains, SDK guidance, and API reference.',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${mono.variable} flex min-h-screen flex-col`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
