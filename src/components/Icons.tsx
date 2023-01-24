import type { Component } from 'solid-js';

export const LoadingIcon: Component<{ size: number }> = (prop) => (
  <svg width={prop.size} height={prop.size} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
    <circle
      cx="50"
      cy="50"
      fill="none"
      stroke="currentColor"
      stroke-width="4"
      r="40"
      stroke-dasharray="85 30"
    />
    <animateTransform
      attributeName="transform"
      type="rotate"
      repeatCount="indefinite"
      dur="1s"
      values="0 50 50;360 50 50"
      keyTimes="0;1"
    />
  </svg>
);

export const MarkdownIcon: Component = () => (
  <svg width="16" height="16" aria-hidden="true">
    <path
      d="M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z"
      fill="currentColor"
    />
  </svg>
);
