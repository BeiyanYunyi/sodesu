/* eslint-disable import/no-extraneous-dependencies */
import { presetWind, transformerDirectives, transformerVariantGroup } from 'unocss';
import { defineConfig } from 'unocss/vite';
import presetSodesu from './src/utils/presetSodesu';

export default defineConfig({
  presets: [presetWind(), presetSodesu()],
  transformers: [transformerVariantGroup(), transformerDirectives()],
});
