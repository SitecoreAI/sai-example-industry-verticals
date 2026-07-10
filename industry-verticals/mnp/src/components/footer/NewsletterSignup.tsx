'use client';

import type React from 'react';
import { useState } from 'react';
import { TextField, useSitecore } from '@sitecore-content-sdk/nextjs';
import { identity } from '@sitecore-cloudsdk/events/browser';
import config from 'sitecore.config';

type NewsletterSignupProps = {
  title?: TextField;
  description?: TextField;
  buttonText?: TextField;
  successMessage?: TextField;
};

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const getFieldValue = (field?: TextField, fallback = '') => field?.value?.toString() || fallback;

const validateForm = (values: FormValues): FormErrors => {
  const errors: FormErrors = {};

  if (!values.firstName.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!values.lastName.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!values.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = 'Please enter a valid email address';
  }

  return errors;
};

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  title,
  description,
  buttonText,
  successMessage,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [values, setValues] = useState<FormValues>({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const { page } = useSitecore();
  const { isEditing, isPreview } = page.mode;
  const { route } = page.layout.sitecore;

  const heading = getFieldValue(title, 'Business insights that make an impact');
  const body = getFieldValue(
    description,
    'Sign up to receive the monthly MNP Business Insights Newsletter.'
  );
  const submitLabel = getFieldValue(buttonText, 'Sign Me Up');
  const confirmationMessage = getFieldValue(
    successMessage,
    'Thank you for signing up for the MNP Business Insights Newsletter.'
  );

  const handleChange =
    (field: keyof FormValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));

      if (errors[field]) {
        setErrors((current) => {
          const next = { ...current };
          delete next[field];
          return next;
        });
      }
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const shouldSendIdentityEvent =
      process.env.NODE_ENV !== 'development' && !isEditing && !isPreview;

    if (shouldSendIdentityEvent) {
      const email = values.email.trim().toLowerCase();
      const language = route?.itemLanguage || config.defaultLanguage;

      await identity({
        channel: 'WEB',
        currency: 'USD',
        language,
        page: route?.name,
        email,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        identifiers: [
          {
            id: email,
            provider: 'email',
          },
        ],
      }).catch((error) => {
        if (error?.status !== 404 && error?.status !== 0) {
          console.debug('Newsletter IDENTITY event error:', error);
        }
      });
    }

    setIsSubmitted(true);
  };

  return (
    <div className="bg-foreground text-background flex flex-col gap-4 p-6">
      <div>
        <h2 className="font-heading mb-3 text-xl leading-tight font-semibold">{heading}</h2>
        <div className="bg-background mb-4 h-px w-full" aria-hidden="true" />
        <p className="text-sm leading-relaxed">{body}</p>
      </div>

      {isSubmitted ? (
        <p className="text-sm leading-relaxed">{confirmationMessage}</p>
      ) : (
        <form className="flex flex-col gap-3" noValidate onSubmit={handleSubmit}>
          <div>
            <label htmlFor="newsletter-first-name" className="sr-only">
              First name
            </label>
            <input
              id="newsletter-first-name"
              type="text"
              autoComplete="given-name"
              placeholder="First name"
              value={values.firstName}
              onChange={handleChange('firstName')}
              className="form-input bg-background text-foreground placeholder:text-foreground-light w-full"
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby={errors.firstName ? 'newsletter-first-name-error' : undefined}
            />
            {errors.firstName && (
              <p id="newsletter-first-name-error" className="text-danger mt-1 text-xs">
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="newsletter-last-name" className="sr-only">
              Last name
            </label>
            <input
              id="newsletter-last-name"
              type="text"
              autoComplete="family-name"
              placeholder="Last name"
              value={values.lastName}
              onChange={handleChange('lastName')}
              className="form-input bg-background text-foreground placeholder:text-foreground-light w-full"
              aria-invalid={Boolean(errors.lastName)}
              aria-describedby={errors.lastName ? 'newsletter-last-name-error' : undefined}
            />
            {errors.lastName && (
              <p id="newsletter-last-name-error" className="text-danger mt-1 text-xs">
                {errors.lastName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              autoComplete="email"
              placeholder="Email address"
              value={values.email}
              onChange={handleChange('email')}
              className="form-input bg-background text-foreground placeholder:text-foreground-light w-full"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'newsletter-email-error' : undefined}
            />
            {errors.email && (
              <p id="newsletter-email-error" className="text-danger mt-1 text-xs">
                {errors.email}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-accent hover:bg-accent/90 text-background w-full px-4 py-2.5 text-sm font-semibold transition-colors"
          >
            {submitLabel}
          </button>
        </form>
      )}
    </div>
  );
};
