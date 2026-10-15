import Head from 'next/head';
import { JSX, useRef, useState } from 'react';
import { resetDemoBrowserIdentity } from 'lib/demo-persona';
import { synchronizeDemoGuest } from 'lib/native-guest';

export default function DemoLaunch(): JSX.Element {
  const launching = useRef(false);
  const [status, setStatus] = useState('Start a fresh, anonymous Instagram journey.');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  const launch = async () => {
    if (launching.current) return;
    launching.current = true;
    setBusy(true);
    setError(false);
    setStatus('Starting a fresh anonymous session…');
    try {
      await resetDemoBrowserIdentity();
      await synchronizeDemoGuest();
      setStatus('Anonymous session ready. Opening the Instagram campaign…');
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
          <p className="westfield-demo-launch__eyebrow">Presenter tools</p>
          <h1>Start the Westfield demo</h1>
          <p>
            Open the Instagram campaign without identifying a customer. Follow the ad, then sign in
            with a synthetic MyWestfield account to see the matching account experience.
          </p>
          <p>
            Demo accounts: <strong>casey@example.com</strong> or <strong>jordan@example.com</strong>
            . Both use the password <strong>password</strong>.
          </p>
          <button type="button" disabled={busy} onClick={() => void launch()}>
            {busy ? 'Starting…' : 'Start anonymous Instagram journey'}
          </button>
          <p aria-live="polite" role={error ? 'alert' : 'status'} aria-atomic="true">
            {status}
          </p>
        </div>
      </main>
    </>
  );
}
