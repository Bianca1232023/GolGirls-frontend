import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/__tests__/e2e/**/*.e2e.test.ts'],
    testTimeout: 15000,
  },
});
