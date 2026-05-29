import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: '100-Day Carousel Factory · @saurav_dnj_24',
  description: '100 days × 5 posts/day of AI, ML, RAG, programming, and database carousel posts. Pick a theme, palette, and download as PNG, PDF, or MP4.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
