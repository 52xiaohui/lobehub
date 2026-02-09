// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getLangfuseConfig } from '../langfuse';

beforeEach(() => {
  console.warn = vi.fn();
});

afterEach(() => {
  delete process.env.ENABLE_LANGFUSE;
  delete process.env.LANGFUSE_SECRET_KEY;
  delete process.env.LANGFUSE_PUBLIC_KEY;
  delete process.env.LANGFUSE_HOST;
  delete process.env.LANGFUSE_BASE_URL;
  vi.resetModules();
  vi.restoreAllMocks();
});

describe('getLangfuseConfig', () => {
  it('should support LANGFUSE_BASE_URL fallback', () => {
    process.env.ENABLE_LANGFUSE = '1';
    process.env.LANGFUSE_SECRET_KEY = 'sk-test';
    process.env.LANGFUSE_PUBLIC_KEY = 'pk-test';
    process.env.LANGFUSE_BASE_URL = 'https://us.cloud.langfuse.com';

    const config = getLangfuseConfig();

    expect(config.LANGFUSE_HOST).toBe('https://us.cloud.langfuse.com');
    expect(config.ENABLE_LANGFUSE).toBe(true);
  });

  it('should parse ENABLE_LANGFUSE=true as enabled', () => {
    process.env.ENABLE_LANGFUSE = 'true';

    const config = getLangfuseConfig();

    expect(config.ENABLE_LANGFUSE).toBe(true);
  });
});
