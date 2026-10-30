import { resolve } from 'node:path';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { transform } from 'lightningcss';
import { build } from 'vite';
import { emitDts } from 'svelte2tsx';

await rm('dist', { recursive: true, force: true });
const external = (id: string) => id === 'svelte' || id.startsWith('svelte/');
// Run sequentially: every variant emits the same shared stylesheet.
for (const variant of [
  {
    entry: 'src/index.ts',
    name: 'Sodesu',
    formats: ['es', 'umd'] as const,
    fileName: (format: string) => (format === 'es' ? 'sodesu.aio.mjs' : 'sodesu.aio.umd.cjs'),
  },
  { entry: 'src/index.ts', formats: ['es'] as const, fileName: () => 'sodesu.mjs', external },
  {
    entry: 'src/ComponentEntry.ts',
    formats: ['es'] as const,
    fileName: () => 'component.js',
    external,
  },
  {
    entry: 'src/utils/presetSodesu.ts',
    formats: ['es', 'cjs'] as const,
    fileName: (format: string) => (format === 'es' ? 'preset.js' : 'preset.cjs'),
  },
]) {
  await build({
    build: {
      lib: {
        entry: variant.entry,
        name: 'name' in variant ? variant.name : undefined,
        formats: [...variant.formats],
        fileName: variant.fileName,
        cssFileName: 'sodesu-comment',
      },
      rolldownOptions: {
        output: { exports: variant.entry === 'src/index.ts' ? 'named' : 'auto' },
        external: 'external' in variant ? variant.external : undefined,
      },
      emptyOutDir: false,
    },
  });
}
// Keep the original CDN filename; .cjs is the Node-compatible UMD entry.
await writeFile('dist/sodesu.aio.umd.js', await readFile('dist/sodesu.aio.umd.cjs'));
await emitDts({
  declarationDir: 'dist',
  libRoot: 'src',
  tsconfig: resolve('tsconfig.json'),
  svelteShimsPath: 'node_modules/svelte2tsx/svelte-shims-v4.d.ts',
});
const declarations = await readFile('dist/index.d.ts', 'utf8');
await writeFile('dist/index.d.ts', declarations.replace("import 'virtual:uno.css';", ''));
const classes = new Set<string>();
transform({
  code: await readFile('dist/sodesu-comment.css'),
  filename: 'sodesu-comment.css',
  visitor: {
    Selector: (selector) => {
      for (const item of selector) if (item.type === 'class') classes.add(item.name);
    },
  },
});
const safeList = JSON.stringify([...classes].sort());
await Promise.all([
  writeFile('dist/safeList.cjs', `module.exports=${safeList};\n`),
  writeFile('dist/safeList.js', `export default ${safeList};\n`),
  writeFile('dist/safeList.d.ts', 'declare const safeList: string[]; export default safeList;\n'),
]);
