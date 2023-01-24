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
