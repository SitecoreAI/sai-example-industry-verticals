/**
 * Loaded first from `sitecore.cli.config.ts` so `sitecore-tools project build` sees `.env` /
 * `.env.local` before `sitecore.config.ts` is evaluated. Missing files are ignored by dotenv.
 */
import { resolve } from 'path';
import { config as loadEnvFile } from 'dotenv';

loadEnvFile({ path: resolve(process.cwd(), '.env') });
loadEnvFile({ path: resolve(process.cwd(), '.env.local'), override: true });
