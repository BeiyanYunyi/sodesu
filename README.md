# 💬 Sodesu - そです

[Waline](https://github.com/walinejs/waline) compatible comment system, made with [Svelte](https://github.com/sveltejs/svelte) and [UnoCSS](https://github.com/unocss/unocss).

## ✨ Inspiration

Sodesu began as a smaller Waline-compatible frontend for a blog. It now uses Svelte 5 with per-instance state and keeps UnoCSS, Waline colors, and starkdown previews.

## Development

```sh
pnpm install
pnpm dev
pnpm build
pnpm test
pnpm test:ssr
pnpm test:build
pnpm docs:build
pnpm lint
pnpm format:check
```

`pnpm build` produces standalone ESM/UMD, runtime-external ESM (`sodesu.mjs`), a Svelte component, CSS, and ESM/CommonJS UnoCSS preset and safelist entries. After building, open `/tests/preview.html` on the dev server for a local light/dark fixture without a live backend.

Type checking uses TypeScript 7 (`@typescript/native`); Svelte's current declaration tooling still requires the TypeScript 6 compatibility API. The consumer type check skips dependency-internal declarations because upstream `unconfig` currently references an undeclared `Args` type.
