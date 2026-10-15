import { createContext } from 'react';

/** Active native news-card identity; fields and SDK editing metadata stay untouched. */
export const HomeNewsContext = createContext<string | undefined>(undefined);
