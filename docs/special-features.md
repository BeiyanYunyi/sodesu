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
