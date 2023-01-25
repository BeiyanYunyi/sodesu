/* eslint-disable import/no-extraneous-dependencies */
import { transform } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
import { createGenerator } from 'unocss';
import config from '../uno.config.js';

(async () => {
  const generator = createGenerator(config);
  const file = await readFile('dist/sodesu.solid.module.js', 'utf-8');
  const result = await generator.generate(file);
  const res = await transform(result.css, {
    minify: true,
    loader: 'css',
  });
  await writeFile('dist/sodesu.css', res.code);
})();
