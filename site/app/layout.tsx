import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Autonomous Product Engineering Harness',
  description: 'A deterministic presentation simulator for building an autonomous product engineering harness.',
  openGraph: {
    title: 'Autonomous Product Engineering Harness',
    description: 'A controlled presentation simulator',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Autonomous Product Engineering Harness',
    description: 'A controlled presentation simulator',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
