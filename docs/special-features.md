# 特色功能

本文将介绍 Sodesu 相较于 Waline 官方前端的一些特色功能。

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

其中的 `commentClassName` 会被应用到每条评论的容器上。

## 自定义 Markdown 渲染器

Sodesu 默认使用 [starkdown](https://www.npmjs.com/package/starkdown) 渲染 Markdown 预览。作为一个体积只有 1.6kB Gzipped 的 Markdown 渲染器，starkdown 存在一些缺陷，例如不支持代码高亮。

Sodesu 提供了自定义 Markdown 渲染器的功能，你可以使用任何你喜欢的 Markdown 渲染器，例如 [marked](https://www.npmjs.com/package/marked)、[markdown-it](https://www.npmjs.com/package/markdown-it) 和 [remark](https://www.npmjs.com/package/remark) 等。

你可以通过在 init 时传入自定义参数来自定义 Markdown 渲染器。

```js
import Sodesu from 'sodesu-comment';
Sodesu.init({
  el: '#comment-container',
  // ...
  renderPreview: async text => myProcessor(text), // 需要返回 Promise
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
