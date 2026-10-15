import Head from 'next/head';
import { JSX, useEffect, useRef, useState } from 'react';
import { recordCampaignArrival } from 'lib/campaign-entry';
import styles from 'assets/westfield-campaign-entry.module.css';

export default function CampaignEntry(): JSX.Element {
  const pending = useRef<Promise<string> | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    // Reuse the in-flight attempt when React replays the effect; send one entry event per attempt.
    const arrival = pending.current || (pending.current = recordCampaignArrival());
    arrival
      .then((destination) => {
        if (active) window.location.replace(destination);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  const retry = () => {
    if (!error) return;
    pending.current = null;
    setError(false);
    setAttempt((value) => value + 1);
  };

  return (
    <>
      <Head>
        <title>Welcome | Westfield</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className={styles.page}>
        <div className={styles.card}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.logo}
            src="/westfield/login/logo_header_desktop_registered_trademark.svg"
            alt="Westfield"
            width="305"
            height="42"
          />
          <h1 className={styles.heading}>Welcome to Westfield</h1>
          <p role={error ? 'alert' : 'status'} aria-live="polite" aria-atomic="true">
            {error ? 'We couldn’t open this page. Please try again.' : 'Opening your campaign…'}
          </p>
          {error ? (
            <button className={styles.retry} type="button" onClick={retry}>
              Try again
            </button>
          ) : (
            <span className={styles.progress} aria-hidden="true" />
          )}
          <noscript>Enable JavaScript to open this campaign.</noscript>
        </div>
      </main>
    </>
  );
}
