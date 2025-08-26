import BlankScreen from '../../../screens_client/BlankScreen';
import Screen1 from '../../../screens_client/Screen1';

interface Props {
  params: { phase: string };
}

export default async function ClientPhasePage({ params }: Props) {
  const { phase } = await params;
  if (phase === '1') {
    return <Screen1 />;
  }
  return (
    <div style={{ padding: 24 }}>
      <h1>Client Phase {phase}</h1>
      <p>No client page defined for this phase yet.</p>
    </div>
  );
}
