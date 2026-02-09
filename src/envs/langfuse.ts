/* eslint-disable sort-keys-fix/sort-keys-fix , typescript-sort-keys/interface */
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const parseEnableLangfuse = (value?: string) => {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) return false;

  // Accept the same truthy values used across env configs.
  return normalized === '1' || normalized === 'true';
};

export const getLangfuseConfig = () => {
  const enableLangfuse = parseEnableLangfuse(process.env.ENABLE_LANGFUSE);
  // LANGFUSE_HOST takes precedence, LANGFUSE_BASE_URL is kept as a compatibility alias.
  const langfuseHost =
    process.env.LANGFUSE_HOST ||
    process.env.LANGFUSE_BASE_URL ||
    'https://cloud.langfuse.com';

  return createEnv({
    runtimeEnv: {
      ENABLE_LANGFUSE: enableLangfuse,
      LANGFUSE_SECRET_KEY: process.env.LANGFUSE_SECRET_KEY || '',
      LANGFUSE_PUBLIC_KEY: process.env.LANGFUSE_PUBLIC_KEY || '',
      LANGFUSE_HOST: langfuseHost,
    },

    server: {
      ENABLE_LANGFUSE: z.boolean(),
      LANGFUSE_SECRET_KEY: z.string().optional(),
      LANGFUSE_PUBLIC_KEY: z.string().optional(),
      LANGFUSE_HOST: z.string().url(),
    },
  });
};

export const langfuseEnv = getLangfuseConfig();
