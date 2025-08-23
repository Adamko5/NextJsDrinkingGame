/*
 * Root layout for the Next.js application. The App Router requires a
 * top‑level layout component in order to render pages. We keep this file
 * minimal; it renders children directly without additional chrome. You may
 * add global stylesheets or providers here when extending the app.
 */
import React from 'react';

export const metadata = {
  title: 'Couch Roguelite Party Game',
  description: 'A LAN‑only party game using Next.js and WebSockets',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'sans-serif' }}>{children}</body>
    </html>
  );
}