import type { Metadata } from 'next';
import { DM_Mono } from 'next/font/google';
import './globals.css';

const dmMono = DM_Mono({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SIREN - Forensic Voice AI',
  description: 'Semantic Interaction & Response for Extracting Nodes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmMono.className}>
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
