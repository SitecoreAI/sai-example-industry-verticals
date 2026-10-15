import Head from 'next/head';
import { FormEvent, JSX, useEffect, useRef, useState } from 'react';
import { demoAccountDestination, signInDemoAccount } from 'lib/demo-persona';
import styles from 'assets/westfield-login.module.css';

export default function DemoAccountLogin(): JSX.Element {
  const submitting = useRef(false);
  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => setReady(true), []);

  const showHelp = (message: string) => {
    setError(false);
    setStatus(message);
  };

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setError(false);
    setStatus('Signing in…');

    try {
      // These local-only credentials are never serialized into a request or URL.
      await signInDemoAccount(emailInput.current?.value || '', passwordInput.current?.value || '');
      if (passwordInput.current) passwordInput.current.value = '';
      setStatus('Signed in. Opening your account…');
      window.location.assign(demoAccountDestination(window.location.search));
    } catch (cause) {
      if (passwordInput.current) passwordInput.current.value = '';
      setError(true);
      setStatus(
        cause instanceof Error ? cause.message : 'Sign in is unavailable. Please try again.'
      );
      submitting.current = false;
      setBusy(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign in | MyWestfield demo</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className={styles.page}>
        <section className={styles.panel} aria-labelledby="sign-in-title">
          {/* The source wordmark is reproduced from the public MyWestfield sign-in page. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.logo}
            src="/westfield/login/logo_header_desktop_registered_trademark.svg"
            width="305"
            height="42"
            alt="Westfield"
          />
          <h1 id="sign-in-title" className={styles.title}>
            Sign into My Westfield
          </h1>
          <p className={styles.demoNotice}>Synthetic demo accounts only</p>
          <form onSubmit={(event) => void signIn(event)}>
            <fieldset className={styles.fields} disabled={!ready || busy}>
              <legend className={styles.visuallyHidden}>Account sign in</legend>
              <label className={styles.visuallyHidden} htmlFor="demo-email">
                Email
              </label>
              <input
                ref={emailInput}
                className={styles.input}
                id="demo-email"
                type="email"
                placeholder="Email"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                aria-invalid={error || undefined}
                aria-describedby="sign-in-status"
                required
              />
              <button
                className={styles.forgotLink}
                type="button"
                onClick={() =>
                  showHelp('Use casey@example.com or jordan@example.com for this demo.')
                }
              >
                Forgot Email?
              </button>
              <div className={styles.passwordField}>
                <label className={styles.visuallyHidden} htmlFor="demo-password">
                  Password
                </label>
                <input
                  ref={passwordInput}
                  className={`${styles.input} ${styles.passwordInput}`}
                  id="demo-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  autoComplete="current-password"
                  aria-invalid={error || undefined}
                  aria-describedby="sign-in-status"
                  required
                />
                <button
                  className={styles.passwordToggle}
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((shown) => !shown)}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
              <button
                className={styles.forgotLink}
                type="button"
                onClick={() => showHelp('Both demo accounts use the password: password.')}
              >
                Forgot Password?
              </button>
              <button className={styles.signIn} type="submit">
                {busy ? 'SIGNING IN…' : 'SIGN IN'}
              </button>
            </fieldset>
          </form>
          <p
            id="sign-in-status"
            className={`${styles.status} ${error ? styles.error : ''}`}
            aria-live="polite"
            role={error ? 'alert' : 'status'}
            aria-atomic="true"
          >
            {status}
          </p>
          <button
            className={styles.createAccount}
            type="button"
            disabled={!ready || busy}
            onClick={() => showHelp('For this demo, use Casey or Jordan’s provided account.')}
          >
            Create Account
          </button>
          <button
            className={styles.paymentTitle}
            type="button"
            disabled={!ready || busy}
            onClick={() => showHelp('Payment processing is outside this synthetic account demo.')}
          >
            <span>One-Time Payment</span>
          </button>
          <p className={styles.accountHelp}>
            casey@example.com or jordan@example.com
            <br />
            Password: password
          </p>
        </section>
      </main>
    </>
  );
}
