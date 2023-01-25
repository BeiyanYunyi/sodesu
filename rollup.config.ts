/* eslint-disable import/no-extraneous-dependencies */
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { resolve } from 'node:path';
import type { RollupOptions } from 'rollup';
import ts from 'typescript';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const solidConfig: RollupOptions = {
  treeshake: 'recommended',
  input: 'src/index.tsx',
  external: ['solid-js', 'solid-js/web', 'solid-js/store'],
  output: [{ dir: './dist', format: 'esm', entryFileNames: 'sodesu.solid.module.js' }],
  plugins: [
    terser(),
    babel({
      extensions,
      babelHelpers: 'bundled',
      presets: ['babel-preset-solid', '@babel/preset-typescript'],
    }),
    nodeResolve({
      extensions,
      browser: true,
      exportConditions: ['default', 'module', 'import'],
    }),
    {
      name: 'ts',
      buildEnd() {
        const program = ts.createProgram([resolve('src/index.tsx')], {
          target: ts.ScriptTarget.ESNext,
          module: ts.ModuleKind.ESNext,
          moduleResolution: ts.ModuleResolutionKind.NodeJs,
          jsx: ts.JsxEmit.Preserve,
          jsxImportSource: 'solid-js',
          allowSyntheticDefaultImports: true,
          esModuleInterop: true,
          outDir: 'dist/source',
          declarationDir: 'dist/types',
          declaration: true,
          allowJs: true,
          emitDeclarationOnly: true,
        });
        program.emit();
      },
    },
  ],
};

const aioConfig = {
  ...solidConfig,
  external: [],
  output: [
    { dir: './dist', format: 'esm', entryFileNames: 'sodesu.aio.module.js' },
    { dir: './dist', format: 'umd', name: 'Sodesu', entryFileNames: 'sodesu.aio.umd.js' },
  ],
};

// const solidConfig = withSolid({ input: 'src/index.tsx', targets: ['esm'] });

export default [solidConfig, aioConfig];
