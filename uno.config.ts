import { presetWind3 } from 'unocss';
import { defineConfig } from 'unocss/vite';
import presetSodesu from './src/utils/presetSodesu.js';

export default defineConfig({
  presets: [presetWind3(), presetSodesu()],
});
