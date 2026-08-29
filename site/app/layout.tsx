import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://flogi-ohayo-demo-v2.developsvai5096.chatgpt.site'),
  title: 'Autonomous Product Engineering Harness',
  description: 'Auto Plan Loom으로 제품 목표를 구성하고 실행하는 Autonomous Product Engineering Harness',
  openGraph: {
    title: 'Autonomous Product Engineering Harness',
    description: 'Auto Plan Loom으로 제품 목표를 구성하고 실행하는 Autonomous Product Engineering Harness',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Autonomous Product Engineering Harness',
    description: 'Auto Plan Loom으로 제품 목표를 구성하고 실행하는 Autonomous Product Engineering Harness',
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
