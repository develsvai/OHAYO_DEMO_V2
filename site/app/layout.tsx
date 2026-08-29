import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Autonomous Product Engineering Harness',
  description: 'Auto Plan Loom 구성과 OHAYO 실행을 재현하는 발표용 Simulator',
  openGraph: {
    title: 'Autonomous Product Engineering Harness',
    description: 'Auto Plan Loom 구성과 OHAYO 실행을 재현하는 발표용 Simulator',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Autonomous Product Engineering Harness',
    description: 'Auto Plan Loom 구성과 OHAYO 실행을 재현하는 발표용 Simulator',
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
