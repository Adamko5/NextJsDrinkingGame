// Custom App component for Next.js pages router
// This file wraps all pages in the SnapshotProvider so that the
// snapshot state is available throughout the application.
import type { AppProps } from 'next/app';
import React from 'react';
// Import the SnapshotProvider from the app's state context.  The
// relative import assumes this file lives in `frontend/pages` and the
// context lives in `frontend/src/app/state`.
import { SnapshotProvider } from '../src/app/state/SnapshotContext';

/**
 * The custom App component is used by Next.js to initialize pages. By
 * wrapping the provided page component with the SnapshotProvider we
 * ensure that all pages have access to the latest game snapshot.
 */
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SnapshotProvider>
      <Component {...pageProps} />
    </SnapshotProvider>
  );
}

export default MyApp;