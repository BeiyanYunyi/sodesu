/* eslint-disable import/no-extraneous-dependencies */
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import type { RollupOptions } from 'rollup';
import dts from 'rollup-plugin-dts';
import summary from 'rollup-plugin-summary';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const basePlugins = [
  nodeResolve({
    extensions,
    browser: true,
    exportConditions: ['default', 'module', 'import'],
    preferBuiltins: true,
  }),
  commonjs(),
  babel({
    extensions,
    babelHelpers: 'bundled',
    presets: ['babel-preset-solid', '@babel/preset-typescript'],
  }),
  summary({ showGzippedSize: true, showBrotliSize: true }),
];

const dtsPlugins = [...basePlugins, dts()];
const commonPlugins = [...basePlugins, terser()];

const solidConfig: RollupOptions = {
  treeshake: 'recommended',
  input: 'src/index.tsx',
  external: ['solid-js', 'solid-js/web', 'solid-js/store'],
  output: [{ dir: './dist', format: 'esm', entryFileNames: 'sodesu.solid.module.js' }],
  plugins: commonPlugins,
};

const solidDtsConfig = {
  ...solidConfig,
  output: [{ dir: './dist', format: 'esm', entryFileNames: 'sodesu.solid.module.d.ts' }],
  plugins: dtsPlugins,
};

const aioConfig = {
  ...solidConfig,
  external: [],
  output: [
    { dir: './dist', format: 'esm', entryFileNames: 'sodesu.aio.module.js' },
    { dir: './dist', format: 'umd', name: 'Sodesu', entryFileNames: 'sodesu.aio.umd.js' },
  ],
};

const aioDtsConfig = {
  ...aioConfig,
  output: [
    { dir: './dist', format: 'esm', entryFileNames: 'sodesu.aio.module.d.ts' },
    { dir: './dist', format: 'umd', name: 'Sodesu', entryFileNames: 'sodesu.aio.umd.d.ts' },
  ],
  plugins: dtsPlugins,
};

// const solidConfig = withSolid({ input: 'src/index.tsx', targets: ['esm'] });

export default [solidConfig, solidDtsConfig, aioConfig, aioDtsConfig];
