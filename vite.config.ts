import Unocss from 'unocss/vite';
import { defineConfig } from 'vite';
import { analyzer } from 'vite-bundle-analyzer';
import Inspect from 'vite-plugin-inspect';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [
    Unocss(),
    solidPlugin(),
    Inspect(),
    // analyzer(),
  ],
  build: {
    target: 'esnext',
    lib: { entry: 'src/index.tsx', name: 'Sodesu' },
  },
});
