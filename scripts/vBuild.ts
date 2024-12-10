import { readFile, rm, writeFile } from 'node:fs/promises';
import { transform } from 'lightningcss';
import { build } from 'vite';
import dts from 'vite-plugin-dts';

await rm('dist', { recursive: true, force: true });

const p0 = await build({
  build: {
    lib: {
      entry: 'src/index.tsx',
      name: 'Sodesu',
      formats: ['es', 'umd'],
      fileName: (format) => (format === 'es' ? `sodesu.aio.mjs` : `sodesu.aio.umd.js`),
    },
    emptyOutDir: false,
  },
  plugins: [
    dts({
      outDir: ['dist'],
      exclude: ['scripts', 'node_modules', './*.ts', 'package.json'],
      copyDtsFiles: true,
      tsconfigPath: 'tsconfig.json',
      entryRoot: 'src',
    }),
  ],
});

const p1 = build({
  build: {
    lib: {
      entry: 'src/index.tsx',
      formats: ['es'],
      fileName: 'sodesu.solid',
    },
    rollupOptions: { external: ['solid-js', 'solid-js/web', 'solid-js/store'] },
    emptyOutDir: false,
  },
});

const p2 = build({
  build: {
    lib: {
      entry: 'src/ComponentEntry.tsx',
      formats: ['es'],
      fileName: 'component',
    },
    rollupOptions: { external: ['solid-js', 'solid-js/web', 'solid-js/store'] },
    emptyOutDir: false,
  },
});

const p3 = build({
  build: {
    lib: {
      entry: 'src/utils/presetSodesu.ts',
      formats: ['es', 'cjs'],
      fileName: 'preset',
    },
    emptyOutDir: false,
  },
});

await Promise.all([p0, p1, p2, p3]);

const file = await readFile('dist/sodesu-comment.css', 'utf-8');
const classes: string[] = [];
transform({
  code: new TextEncoder().encode(file),
  filename: '',
  visitor: {
    Selector: (t) => {
      t.forEach((item) => {
        if (item.type === 'class') {
          classes.push(item.name);
        }
      });
    },
  },
});
const result = Array.from(new Set(classes));
const pms2 = writeFile('dist/safeList.cjs', `module.exports=${JSON.stringify(result)}`);
const pms3 = writeFile('dist/safeList.js', `export default ${JSON.stringify(result)}`);
const pms4 = writeFile(
  'dist/safeList.d.ts',
  'declare const safeList: string[]; export default safeList;',
);
await Promise.all([pms2, pms3, pms4]);
