import Head from 'next/head';
import { JSX, useRef, useState } from 'react';
import { demoPersonas, startDemoPersona } from 'lib/demo-persona';

export default function DemoLaunch(): JSX.Element {
  const launching = useRef(false);
  const [status, setStatus] = useState('Choose a synthetic person to start the Instagram journey.');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  const launch = async (email: (typeof demoPersonas)[number]['email']) => {
    if (launching.current) return;
    launching.current = true;
    setBusy(true);
    setError(false);
    setStatus('Starting a fresh demo session and identifying this person in SitecoreAI…');
    try {
      await startDemoPersona(email);
      setStatus('Identity accepted. Opening the Instagram campaign…');
      window.location.assign('/instagram/index.html');
    } catch (cause) {
      setError(true);
      setStatus(cause instanceof Error ? cause.message : 'The demo session could not be started.');
      launching.current = false;
      setBusy(false);
    }
  };

  return (
    <>
      <Head>
        <title>Westfield demo launch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="westfield-demo-launch">
        <div className="westfield-demo-launch__inner">
          <p className="westfield-demo-launch__eyebrow">Presenter tools · Synthetic profiles</p>
          <h1>Start the Westfield demo</h1>
          <p>
            Select a person, then follow the Instagram campaign to the paperless page. Both people
            are fictional. Each start creates a fresh browser identity and sends an identity event
            to SitecoreAI.
          </p>
          <div className="westfield-demo-launch__people">
            {demoPersonas.map((persona) => (
              <section key={persona.email} className="westfield-demo-launch__person">
                <h2>{persona.name}</h2>
                <p>{persona.description}</p>
                <p className="westfield-demo-launch__email">{persona.email}</p>
                <button type="button" disabled={busy} onClick={() => void launch(persona.email)}>
                  Start as {persona.name.split(' ')[0]}
                </button>
              </section>
            ))}
          </div>
          <p aria-live="polite" role={error ? 'alert' : 'status'} aria-atomic="true">
            {status}
          </p>
        </div>
      </main>
    </>
  );
}
