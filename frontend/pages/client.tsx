// 'use client' marks this page as a client-side component.  Without
// this directive Next.js would treat the file as a server component and
// disallow the use of hooks inside the imported components.
'use client';

import React from 'react';
import Router from '../src/app/router';
import { CookieProvider } from '@/app/state/CookieManager';

/**
 * ClientPage renders the game for the player/client role.  Like the
 * server page, it wraps the Router with the SnapshotProvider to
 * provide snapshot data throughout the component tree.  This page is
 * served at `/client` when running the development server on port 8081.
 */
export default function ClientPage() {
  return (
    <CookieProvider>
      <Router role="client" />
    </CookieProvider>
  );
}