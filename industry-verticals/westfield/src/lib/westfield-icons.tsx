import type { JSX, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export const Caret = (props: IconProps): JSX.Element => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="9"
    height="5"
    fill="none"
    className="navigation_arrow__p4kL1 navigation_desktopCaret__cGFs4"
    {...props}
  >
    <path
      fill="currentColor"
      d="M4.21 4.29a.723.723 0 0 0 1.056 0l3-3c.21-.212.28-.54.164-.821A.74.74 0 0 0 7.75 0h-6a.77.77 0 0 0-.703.469.76.76 0 0 0 .164.82z"
    />
  </svg>
);

export const Chevron = (props: IconProps): JSX.Element => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="8"
    height="12"
    fill="none"
    className="navigation_arrow__p4kL1 navigation_mobileChevron__I7GRF"
    {...props}
  >
    <path fill="currentColor" d="M.59 1.41 5.17 6 .59 10.59 2 12l6-6-6-6z" />
  </svg>
);

export const SearchIcon = (props: IconProps): JSX.Element => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" {...props}>
    <path d="m10.957 9.874 3.823 3.824a.76.76 0 0 1-.003 1.08.77.77 0 0 1-1.08.002l-3.822-3.823a6.122 6.122 0 1 1 1.082-1.082Zm-1.59-.507a4.59 4.59 0 1 0-6.492-6.492 4.59 4.59 0 0 0 6.492 6.492" />
  </svg>
);

export const MenuIcon = (props: IconProps): JSX.Element => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className="hamburger_svg__icon"
    viewBox="0 0 21 18"
    {...props}
  >
    <path
      fill="#E03100"
      d="M19.875 15.375H1.078C.468 15.375 0 15.891 0 16.5c0 .656.469 1.125 1.078 1.125h18.797c.61 0 1.125-.469 1.125-1.078 0-.656-.516-1.172-1.125-1.172m0-15H1.078C.468.375 0 .891 0 1.5c0 .563.469 1.125 1.078 1.125h18.797c.61 0 1.125-.469 1.125-1.078 0-.563-.516-1.172-1.125-1.172m0 7.5H1.078C.468 7.875 0 8.391 0 9c0 .656.469 1.125 1.078 1.125h18.797A1.11 1.11 0 0 0 21 9a1.14 1.14 0 0 0-1.125-1.125"
    />
  </svg>
);

export const CloseIcon = (props: IconProps): JSX.Element => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className="close_svg__icon"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill="#E03100"
      d="m19.333 2.547-1.88-1.88L10 8.12 2.547.667l-1.88 1.88L8.12 10 .667 17.453l1.88 1.88L10 11.88l7.453 7.453 1.88-1.88L11.88 10z"
    />
  </svg>
);

export const BackToTopIcon = (props: IconProps): JSX.Element => (
  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
    <g clipPath="url(#up-arrow_svg__a)">
      <path fill="currentColor" d="m4 12 1.41 1.41L11 7.83V20h2V7.83l5.59 5.58L20 12l-8-8z" />
    </g>
    <defs>
      <clipPath id="up-arrow_svg__a">
        <path fill="#fff" d="M0 24V0h24v24z" />
      </clipPath>
    </defs>
  </svg>
);

export const HeroSun = (props: IconProps): JSX.Element => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className="sun-logo_svg__logo"
    viewBox="0 0 225 225"
    {...props}
  >
    <g clipPath="url(#sun-logo_svg__a)">
      <path
        fill="#5F615F"
        d="M112.5 165.329c29.163 0 52.829-23.666 52.829-52.829S141.663 59.671 112.5 59.671 59.671 83.337 59.671 112.5s23.666 52.829 52.829 52.829M145.458 192.042h46.614v-46.614zm-112.5-46.614v46.614h46.584zm46.584-112.47H32.958v46.614zm112.5 46.614V32.958h-46.614z"
      />
      <path
        fill="#F05335"
        d="M112.5 0 79.542 32.958h65.886zm79.542 145.458L225 112.5l-32.958-32.958v65.916M0 112.5l32.958 32.958V79.572zm79.542 79.542L112.5 225l32.958-32.958z"
      />
    </g>
    <defs>
      <clipPath id="sun-logo_svg__a">
        <path fill="#fff" d="M0 0h225v225H0z" />
      </clipPath>
    </defs>
  </svg>
);

export const LocationIcon = (props: IconProps): JSX.Element => (
  <svg aria-hidden="true" viewBox="0 0 14 20" {...props}>
    <path
      fill="#fff"
      d="M7 0C3.13 0 0 3.13 0 7c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5"
    />
  </svg>
);

export const PhoneIcon = (props: IconProps): JSX.Element => (
  <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
    <path
      fill="#fff"
      d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.98.98 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99"
    />
  </svg>
);

export const MailIcon = (props: IconProps): JSX.Element => (
  <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
    <path
      fill="#fff"
      d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4-8 5-8-5V6l8 5 8-5z"
    />
  </svg>
);
