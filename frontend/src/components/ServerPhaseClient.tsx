"use client";

import React from 'react';

interface PlayerRow {
  id: string;
  name: string;
  trait?: string;
  connected: boolean;
}

interface Props {
  phase: string;
  initialPlayers?: PlayerRow[];
  initialVotes?: Record<string, any>;
}

export default function ServerPhaseClient({ phase, initialPlayers = [], initialVotes = {} }: Props) {
  const [View, setView] = React.useState<React.ComponentType<any> | null>(null);

  React.useEffect(() => {
    let mounted = true;
    // Try to dynamically import a server screen component matching the
    // pattern `screens_server/Screen{phase}`. If it fails, show a fallback.
    import(`../screens_server/Screen${phase}`)
      .then((mod) => {
        if (!mounted) return;
        setView(() => mod.default ?? null);
      })
      .catch((err) => {
        console.error('[ServerPhaseClient] failed to load screen', phase, err);
        if (!mounted) return;
        setView(() => () => (
          <div style={{ padding: 24 }}>
            <h2>Server screen {phase} not implemented</h2>
            <pre style={{ color: 'red' }}>{String(err && err.message)}</pre>
          </div>
        ));
      });
    return () => {
      mounted = false;
    };
  }, [phase]);

  if (!View) return <div style={{ padding: 24 }}>Loading server screen…</div>;

  return <View initialPlayers={initialPlayers} initialVotes={initialVotes} />;
}
