import Unocss from 'unocss/vite';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [Unocss({ inspector: false }), svelte()],
  optimizeDeps: { entries: ['index.html'] },
  build: {
    target: 'es2022',
    lib: { entry: 'src/index.ts', name: 'Sodesu', cssFileName: 'sodesu-comment' },
  },
});
