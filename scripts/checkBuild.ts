import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import { createGenerator, presetWind3 } from 'unocss';
import pkg from '../package.json';

async function checkExports(value: unknown): Promise<void> {
  if (typeof value === 'string' && !value.includes('*')) await access(value);
  else if (value && typeof value === 'object')
    await Promise.all(Object.values(value).map(checkExports));
}
await checkExports(pkg.exports);
const require = createRequire(import.meta.url);
const aio = await import('sodesu-comment/aio');
assert.equal(typeof aio.init, 'function');
assert.equal(typeof require('sodesu-comment/aio').init, 'function');
assert.equal(typeof (await import('sodesu-comment')).init, 'function');
assert.equal(typeof (await import('sodesu-comment/component')).default, 'function');
const preset = (await import('sodesu-comment/preset')).default;
assert.equal(typeof preset, 'function');
assert.equal(typeof require('sodesu-comment/preset'), 'function');
const safeList = (await import('sodesu-comment/safeList')).default;
assert.deepEqual(safeList, require('sodesu-comment/safeList'));
assert.ok(safeList.includes('sds-panel'));
const generator = await createGenerator({ presets: [presetWind3(), preset()] });
const generated = await generator.generate(safeList.join(' '));
assert.ok(generated.css.includes('.sds-panel'));
assert.ok(generated.css.includes('--sds-warning-bg-color'));
const upstream = await readFile('waline/packages/client/src/styles/config.scss', 'utf8');
const css = await readFile('dist/sodesu-comment.css', 'utf8');
for (const token of new Set(upstream.match(/--waline-[\w-]+/g))) {
  assert.ok(css.includes(token.replace('--waline-', '--sds-')), `Missing upstream token ${token}`);
}
const context: Record<string, unknown> = {};
runInNewContext(await readFile('dist/sodesu.aio.umd.js', 'utf8'), context);
assert.equal(typeof (context.Sodesu as typeof aio).init, 'function');
assert.equal(
  await readFile('dist/sodesu.aio.umd.js', 'utf8'),
  await readFile('dist/sodesu.aio.umd.cjs', 'utf8'),
);
console.log(
  'All package exports, UMD global, UnoCSS preset/safelist, and upstream tokens verified.',
);
