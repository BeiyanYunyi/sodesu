# 功能精简

Sodesu 与 Waline 官方前端的设计目的并不相同。我写 Sodesu 的初衷是给我的 Astro 博客使用，它是一个 MPA 生成器，生成的 HTML 体积很小（平均未 Gzipped 体积<20kB，CSS 体积<15kB），因此我希望 Sodesu 的体积也能尽量小。

出于体积上的考虑，它会比 Waline 官方前端减少一些功能。有一些功能是我还没实现，另一些则是我确定不会在 Sodesu 中引入的。无论是哪种情况，我都将尝试在下方列举。如果你需要一些未被实现的功能，但它们并未在下方列出，欢迎提出 issue。

## Markdown 预览

这涉及 Markdown 的前端渲染。Waline 官方前端使用的方案是 marked。marked 的体积很大，引入它会使 Sodesu 的体积增加 48kB（16kB Gzipped），换句话说，让 Sodesu 的体积翻一倍。

我的博客偏技术型，相对而言，用户的 markdown 熟练度会更高一些，因此 Markdown 预览功能的优先度并不高。尽管如此，我仍然会尝试实现 Markdown 预览——用 [snarkdown](https://github.com/developit/snarkdown) 或者 GitHub 现成的接口（api.github.com 尚未被墙）来实现。

## 表情选择

我认为直接让用户输入 Emoji 会是个更好的选择。尽管如此，引入一个表情选择器的代价并不大，我可以尝试着去做，但优先级并不高。

## 评论管理

我极少管理我博客内的评论，并且 Waline 后端也可以进行管理，因此它的优先级也不高。
