/* eslint-disable import/no-extraneous-dependencies */
import { transform } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
import { createGenerator } from 'unocss';
import config from '../uno.config.js';

(async () => {
  const generator = createGenerator(config);
  const file = await readFile('dist/sodesu.solid.mjs', 'utf-8');
  const result = await generator.generate(file);
  const res = await transform(result.css, {
    minify: true,
    loader: 'css',
  });
  const pms1 = writeFile('dist/sodesu.css', res.code);
  const pms2 = writeFile(
    'dist/safeList.cjs',
    `module.exports=${JSON.stringify(Array.from(result.matched))}`,
  );
  const pms3 = writeFile(
    'dist/safeList.mjs',
    `export default ${JSON.stringify(Array.from(result.matched))}`,
  );
  const pms4 = writeFile(
    'dist/safeList.d.ts',
    'declare const safeList: string[]; export default safeList;',
  );
  await Promise.all([pms1, pms2, pms3, pms4]);
})();
