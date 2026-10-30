# 特色功能

本文将介绍 Sodesu 相较于 Waline 官方前端的一些特色功能。

## Svelte

Sodesu 使用 Svelte 编写，区别于 Waline 官方前端使用的 Vue。加上一系列功能精简，减小了 50% 左右的体积。

此前 Sodesu 使用 Solid.js v1，相比 Vue 版可减小 75%，但 Solid.js v2 加入了（对一个评论系统而言）过于臃肿的调度器，构建后大小已和 Vue 不相上下。因此，Sodesu 决定切换到 Svelte。

## 评论样式

在博客中，我们有时会希望对用户的评论应用一些样式，Sodesu 提供了这个功能。

```js
import Sodesu from 'sodesu-comment';
Sodesu.init({
  el: '#comment-container',
  serverURL: 'https://your.server.url/',
  dark: 'html.dark',
  pageview: true,
  commentClassName: 'prose prose-neutral dark:prose-invert min-w-0 max-w-none',
});
```

`commentClassName` 会应用到每条评论和预览的内容容器，替代默认的 `sds-content` 类及其排版样式。未设置或设为空字符串时，使用默认样式。

使用 UnoCSS preset 时，可通过 `content: false` 排除默认内容样式：

```ts
import presetSodesu from 'sodesu-comment/preset';

presetSodesu({ content: false });
```

`content` 默认为 `true`。`sodesu-comment.css` 包含默认内容样式；指定 `commentClassName` 后，内容容器不再应用这些样式。

## 自定义 Markdown 渲染器

Sodesu 默认使用 [starkdown](https://www.npmjs.com/package/starkdown) 渲染 Markdown 预览。作为一个体积只有 1.6kB Gzipped 的 Markdown 渲染器，starkdown 存在一些缺陷，例如不支持代码高亮。

Sodesu 提供了自定义 Markdown 渲染器的功能，你可以使用任何你喜欢的 Markdown 渲染器，例如 [marked](https://www.npmjs.com/package/marked)、[markdown-it](https://www.npmjs.com/package/markdown-it) 和 [remark](https://www.npmjs.com/package/remark) 等。

你可以通过在 init 时传入自定义参数来自定义 Markdown 渲染器。

```js
import Sodesu from 'sodesu-comment';
Sodesu.init({
  el: '#comment-container',
  // ...
  renderPreview: async (text) => myProcessor(text), // 需要返回 Promise
});
```

对于使用 `remark` 的情况，项目代码中提供了一个[示例](https://github.com/BeiyanYunyi/sodesu/blob/main/src/utils/remarkRenderer.ts)，你正在阅读的文档页面也[使用了它](https://github.com/BeiyanYunyi/sodesu/blob/main/docs/.vitepress/theme/SodesuComment.vue)。因此，你可以试着在评论框里键入如下内容，并点击“预览”图标：

```markdown
| 114  | 514 |
| :--: | :-: |
| 1919 | 810 |

$$
\frac{\text d\rho}{\text dt}+\rho\bold\nabla\cdot\vec V=0
$$
```

它的渲染结果应该如下所示：

| 114  | 514 |
| :--: | :-: |
| 1919 | 810 |

$$
\frac{\text d\rho}{\text dt}+\rho\bold\nabla\cdot\vec V=0
$$

从一致性的角度出发，我会推荐 `markdown-it`，这是 waline 后端使用的渲染器。你可以参照它的代码，对渲染器进行配置。
