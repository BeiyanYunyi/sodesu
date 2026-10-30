import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

export default mergeConfig(
  viteConfig,
  defineConfig({
    resolve: { conditions: ['browser'] },
    test: { environment: 'jsdom', include: ['tests/**/*.test.ts'], clearMocks: true },
  }),
);
