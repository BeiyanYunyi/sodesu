# 功能精简

Sodesu 与 Waline 官方前端的设计目的并不相同。我写 Sodesu 的初衷是给我的 Astro 博客使用，它是一个 MPA 生成器，生成的 HTML 体积很小（平均未 Gzipped 体积<20kB，CSS 体积<15kB），因此我希望 Sodesu 的体积也能尽量小。

出于体积上的考虑，它会比 Waline 官方前端减少一些功能。有一些功能是我还没实现，另一些则是我确定不会在 Sodesu 中引入的。无论是哪种情况，我都将尝试在下方列举。如果你需要一些未被实现的功能，但它们并未在下方列出，欢迎提出 issue。

## Markdown 预览

这涉及 Markdown 的前端渲染。Waline 官方前端使用的方案是 marked。marked 的体积很大，引入它会使 Sodesu 的体积增加 48kB（16kB Gzipped），换句话说，让 Sodesu 的体积翻一倍。

我的博客偏技术型，相对而言，用户的 markdown 熟练度会更高一些，因此 Markdown 预览功能的优先度并不高。尽管如此，我仍然会尝试实现 Markdown 预览——用 [snarkdown](https://github.com/developit/snarkdown) ，或者暴露一个函数，以让用户调用例如自行反代的 [GitHub 现成的接口](https://docs.github.com/en/rest/markdown#render-a-markdown-document)来实现。

## 表情选择

我认为直接让用户输入 Emoji 会是个更好的选择。尽管如此，引入一个表情选择器的代价并不大，我可以尝试着去做，但优先级并不高。

## 评论管理

我极少管理我博客内的评论，并且 Waline 后端也可以进行管理，因此它的优先级也不高。

## 样式修改

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
