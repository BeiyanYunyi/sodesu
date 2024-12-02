import Unocss from 'unocss/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin(), Unocss()],
  build: {
    target: 'esnext',
    lib: { entry: 'src/index.tsx', name: 'Sodesu' },
    rollupOptions: {},
  },
});
