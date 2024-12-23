# 快速开始

<script setup lang='ts'>
import { version } from 'sodesu-comment/package.json';
</script>

首先这只是一个评论系统前端，所以在开始之前，你需要按照 [Waline 的教程](https://waline.js.org/guide/get-started/)部署好 Waline 后端（服务端）。

## 引入 Sodesu 前端（客户端）

有很多种引入 Sodesu 的方式。

### CDN 引入（UMD）

如果在构建过程中没有类似 Rollup 和 Webpack 那样的打包器，而你只能接触到 HTML 或者页面模板，那就直接修改它们吧。

```html-vue
<head>
  <!-- ... -->
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/sodesu-comment@{{version}}/dist/sodesu-comment.css"
  />
  <!-- ... -->
</head>
<body>
  <!-- ... -->
  <div id="sodesu"></div>
  <script src="https://cdn.jsdelivr.net/npm/sodesu-comment@{{version}}/dist/sodesu.aio.umd.js"></script>
  <script>
    Sodesu.init({
      el: '#sodesu',
      serverURL: 'https://your-domain.vercel.app',
    });
  </script>
</body>
```

### npm 引入（ES Module）

如果你的项目使用了类似 Rollup 和 Webpack 这样的打包器，那么你可以使用 npm 安装 Sodesu：

```bash
pnpm add sodesu-comment
```

安装好以后，在你的项目中引入并初始化 Sodesu。

如果你的项目中已经存在 Solid.js，那么你可以引入不含 Solid.js 的 Sodesu，这可以让你的 JS 体积小十几 kB。

```ts
import { init } from 'sodesu-comment';
init({
  el: '#sodesu',
  serverURL: 'https://your-domain.vercel.app',
});
```

如果你的项目中没有 Solid.js，那么你可以选择安装它，然后回到上一步：

```bash
pnpm add solid-js
```

当然，你也可以选择引入已经包含了 Solid.js 的 Sodesu：

```ts
import { init } from 'sodesu-comment/aio';
init({
  el: '#sodesu',
  serverURL: 'https://your-domain.vercel.app',
});
```

无论是哪一种方式，都没有引入样式。所以你可以参考 CDN 引入时的办法，在 html 中引入它。但如果你的项目足够工程化，那么你可以直接在你的页面中引入样式：

```ts
import 'sodesu-comment/sodesu-comment.css';
```

或者，如果你的项目已经在使用 UnoCSS，那么你可以将它配置一下：

```ts
import presetSodesu from 'sodesu-comment/preset';
import safeList from 'sodesu-comment/safeList';
import { defineConfig, presetWind } from 'unocss';

export default defineConfig({
  presets: [presetWind(), presetSodesu()],
  safelist: safeList,
});
```

这是在 UnoCSS 下兼容性最好的方案，例如我的博客就是[这样配置](https://github.com/BeiyanYunyi/Astro-blog-Lithium/blob/main/uno.config.ts)的，因为 Astro 的构建过程似乎会让 UnoCSS 无法正确识别依赖项里存在的类名，所以我在构建时将使用过的类名一并导出，只要把它们加入 safelist，就能让 UnoCSS 正确处理它们。

如果你用的不是 Astro，那么你或许可以使用类似这样的配置，只要确保 `include` 能覆盖到位于 `node_modules` 里的 `sodesu` 源码就可以了：

```ts
import presetSodesu from 'sodesu-comment/preset';
import { defineConfig, presetWind } from 'unocss';

export default defineConfig({
  presets: [presetWind(), presetSodesu()],
  include: ['**/*.jsx', '**/*.tsx', '**/*.vue', '**/*.html', '**/*.astro', /.*sodesu.*/],
});
```

## 单页应用支持

`init` 函数会返回一个对象，你可以将其视作 Sodesu 的实例。其中包含两个方法，分别是 `update` 和 `destroy`。

通过如下方式来对 Sodesu 的配置项进行更新：

```ts{7-10}
import { init } from 'sodesu-comment/aio';
const sodesu = init({
  el: '#sodesu',
  serverURL: 'https://your-domain.vercel.app',
});

sodesu.update({
  path: '/new-path',
  /* any other options here */
});
```

通过如下方式来销毁 Sodesu 实例：

```ts{7}
import { init } from 'sodesu-comment/aio';
const sodesu = init({
  el: '#sodesu',
  serverURL: 'https://your-domain.vercel.app',
});

sodesu.destroy();
```

## 效果预览

嗯哼，就在下面。文档的评论区用的就是 Sodesu。什么？你说它像 Waline 官方前端？我照抄的样式能不像么（笑

咳咳。正经说的话，是因为我对自己审美能力有自知之明，就不自己写样式了。当然，我也不是直接照搬样式，而是用 UnoCSS 重写了一遍。
