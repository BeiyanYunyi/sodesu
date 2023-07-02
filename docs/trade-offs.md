# 功能精简

Sodesu 与 Waline 官方前端的设计目的并不相同。我写 Sodesu 的初衷是给我的 Astro 博客使用，它是一个 MPA 生成器，生成的 HTML 体积很小（平均未 Gzipped 体积<20kB，CSS 体积<15kB），因此我希望 Sodesu 的体积也能尽量小。

出于体积上的考虑，它会比 Waline 官方前端减少一些功能。有一些功能是我还没实现，另一些则是我确定不会在 Sodesu 中引入的。无论是哪种情况，我都将尝试在下方列举。如果你需要一些未被实现的功能，但它们并未在下方列出，欢迎提出 issue。

## 已实现并需要选择启用的特性

### 代码高亮

Waline 后端使用 Prism 将 markdown 中的代码块进行高亮处理，而 Sodesu 的样式中并未包括 Prism。为了让 Sodesu 正确呈现代码样式（而非一片灰），你需要在前端额外引入 Prism 的样式。经测试，在所有官方主题中，`prism-tomorrow` 主题的效果是最好的。示例引入方式如下：

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css"
/>
```

::: info
可观察[本项目开发用的 html](https://github.com/BeiyanYunyi/sodesu/blob/main/index.html) 来了解这个标签应当被插入到哪里，不过随便挑一个地方放应该都没问题，只会造成首屏加载速度上的微妙差别。当然，别放到 `<body>` 和 `<head>` 外面。
:::

## 将来可能实现的特性

### 表情选择

我认为直接让用户输入 Emoji 会是个更好的选择。尽管如此，引入一个表情选择器的代价并不大，我可以尝试着去做，但优先级并不高。

### 评论管理

我极少管理我博客内的评论，并且 Waline 后端也可以进行管理，因此它的优先级也不高。

## 不会实现 / 无法实现的特性

### 样式修改

由于使用了 UnoCSS 这样的 Atomic CSS 库，Sodesu 的样式是基本不可修改的——你没法通过自己写一个 CSS 文件把它改成你想要的样子。Atomic CSS 使得 Sodesu 各元素存在很大程度上的类名复用，你没法只修改一个元素的样子。如果你确实这么需要，请使用 Waline 官方客户端，或者直接 fork 下 Sodesu 的源码进行修改。

当然，Sodesu 的配色方案是可以调整的，方法与 Waline 一致——用自己的 CSS 覆盖掉即可。

可以修改的变量如下（与 Waline 里的各变量名完全一致，只是把 `waline` 换成了 `sds`）：

```css
:root {
  --sds-font-size: 1rem;
  --sds-white: #fff;
  --sds-light-grey: #999;
  --sds-dark-grey: #666;
  --sds-theme-color: #27ae60;
  --sds-active-color: #2ecc71;
  --sds-color: #444;
  --sds-bgcolor: #fff;
  --sds-bgcolor-light: #f8f8f8;
  --sds-bgcolor-hover: #f0f0f0;
  --sds-border-color: #ddd;
  --sds-disable-bgcolor: #f8f8f8;
  --sds-disable-color: #000;
  --sds-code-bgcolor: #282c34;
  --sds-bq-color: #f0f0f0;
  --sds-avatar-size: 3.25rem;
  --sds-avatar-radius: 50%;
  --sds-m-avatar-size: calc(var(--sds-avatar-size) * 9 / 13);
  --sds-badge-color: #3498db;
  --sds-badge-font-size: 0.75em;
  --sds-info-bgcolor: #f8f8f8;
  --sds-info-color: #999;
  --sds-info-font-size: 0.625em;
  --sds-border: 1px solid var(--sds-border-color);
  --sds-box-shadow: none;
}
```

### 关闭页脚版权信息

Sodesu 会在评论区右下角显示一行类似这样的版权信息：

<p class="py-1 text-sLightGrey text-info">Powered by Sodesu v1.1.4-alpha.514</p>

与 Waline 的页脚版权信息可以开关不同，Sodesu 的页脚版权信息是强制开启的。这是因为 Sodesu 使用了 AGPL-3.0 协议 ~~（为什么？因为我喜欢）~~ ，这要求它的源码随服务一同分发。而如果把这个任务交给博客主，那么他们将需要经过比较复杂的配置才能做到这一点，因此 Sodesu 的页脚版权信息将强制开启，以确保源码（以链接的形式）与服务一并分发。

据观察，关闭了 Waline 页脚版权信息的博客并不多。而对 Sodesu 用户来说，插入上面的版权信息，可以避免自己的整个博客都被 AGPL 协议“传染”着要求开源。在我看来这是一笔划算的交易。
