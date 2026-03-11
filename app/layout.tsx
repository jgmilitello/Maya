import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Maya',
  description: 'A friendly place to learn your money',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
