// Custom App component for Next.js pages router
// This file wraps all pages in the SnapshotProvider so that the
// snapshot state is available throughout the application.

import type { AppProps } from 'next/app';
import React from 'react';

// Import global styles so CSS custom properties defined in
// `src/styles/theme.css` are available in all components.  Without
// importing this file the CSS variables (e.g. `--bg`, `--text`)
// defined in the theme will not be applied to module styles.  See
// `frontend/src/styles/globals.css` for details.
import '../src/styles/globals.css';
import { SnapshotProvider } from '@/app/state/SnapshotContext';

/**
 * The custom App component is used by Next.js to initialize pages. By
 * wrapping the provided page component with the SnapshotProvider we
 * ensure that all pages have access to the latest game snapshot and
 * also have the global CSS loaded once.
 */
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SnapshotProvider>
      <Component {...pageProps} />
    </SnapshotProvider>
  );
}

export default MyApp;