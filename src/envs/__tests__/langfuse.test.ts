// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  console.warn = vi.fn();
  vi.resetModules();
});

afterEach(() => {
  delete process.env.ENABLE_LANGFUSE;
  delete process.env.LANGFUSE_SECRET_KEY;
  delete process.env.LANGFUSE_PUBLIC_KEY;
  delete process.env.LANGFUSE_HOST;
  delete process.env.LANGFUSE_BASE_URL;
  vi.restoreAllMocks();
});

describe('getLangfuseConfig', () => {
  it('should support LANGFUSE_BASE_URL fallback', async () => {
    process.env.ENABLE_LANGFUSE = '1';
    process.env.LANGFUSE_SECRET_KEY = 'sk-test';
    process.env.LANGFUSE_PUBLIC_KEY = 'pk-test';
    process.env.LANGFUSE_BASE_URL = 'https://us.cloud.langfuse.com';

    const { getLangfuseConfig } = await import('../langfuse');
    const config = getLangfuseConfig();

    expect(config.LANGFUSE_HOST).toBe('https://us.cloud.langfuse.com');
    expect(config.ENABLE_LANGFUSE).toBe(true);
  });

  it('should parse ENABLE_LANGFUSE=true as enabled', async () => {
    process.env.ENABLE_LANGFUSE = 'true';

    const { getLangfuseConfig } = await import('../langfuse');
    const config = getLangfuseConfig();

    expect(config.ENABLE_LANGFUSE).toBe(true);
  });

  it('should normalize ENABLE_LANGFUSE whitespace and case', async () => {
    process.env.ENABLE_LANGFUSE = ' TRUE ';

    const { getLangfuseConfig } = await import('../langfuse');
    expect(getLangfuseConfig().ENABLE_LANGFUSE).toBe(true);
  });

  it('should disable ENABLE_LANGFUSE for false', async () => {
    process.env.ENABLE_LANGFUSE = 'false';
    const { getLangfuseConfig } = await import('../langfuse');

    expect(getLangfuseConfig().ENABLE_LANGFUSE).toBe(false);
  });

  it('should disable ENABLE_LANGFUSE for 0', async () => {
    process.env.ENABLE_LANGFUSE = '0';
    const { getLangfuseConfig } = await import('../langfuse');

    expect(getLangfuseConfig().ENABLE_LANGFUSE).toBe(false);
  });

  it('should disable ENABLE_LANGFUSE for empty string', async () => {
    process.env.ENABLE_LANGFUSE = '';
    const { getLangfuseConfig } = await import('../langfuse');

    expect(getLangfuseConfig().ENABLE_LANGFUSE).toBe(false);
  });

  it('should disable ENABLE_LANGFUSE when undefined', async () => {
    delete process.env.ENABLE_LANGFUSE;
    const { getLangfuseConfig } = await import('../langfuse');
    expect(getLangfuseConfig().ENABLE_LANGFUSE).toBe(false);
  });
});
