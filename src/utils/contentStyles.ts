export const contentClasses =
  "mb-[0.75em] pt-[0.625em] text-[0.875em] leading-[2] [overflow-wrap:break-word]";

export const contentStyles = `.sds-content pre, .sds-content pre[class*="language-"] {
    background: var(--sds-code-bg-color, var(--sds-code-bgcolor));
    margin: .75rem 0;
    padding: 1rem 1.25rem;
    border-radius: 6px;
    line-height: 1.4;
    overflow: auto;
  }
  .sds-content p { color: var(--sds-color); }
  .sds-content code { padding: .2em .4em; border-radius: 3px; background: var(--sds-bg-color-light, var(--sds-bgcolor-light)); font-size: 85%; }
  .sds-content pre code { color: #bbb; direction: ltr; padding: 0; background: transparent; white-space: pre-wrap; word-break: keep-all; }
  .sds-content blockquote { margin: .5em 0; padding: .5em 0 .5em 1em; border-inline-start: 8px solid var(--sds-bq-color); color: var(--sds-dark-grey); }
  .sds-content blockquote > p { margin: 0; }
  .sds-content ol, .sds-content ul { margin-inline-start: 1.25em; padding: 0; }
  .sds-content table { display: block; overflow: auto; border-collapse: collapse; }
  .sds-content td, .sds-content th { padding: .25em .5em; border: 1px solid var(--sds-border-color); }
  .sds-content .vemoji, .sds-content .wl-emoji { display: inline-block; height: 1.25em; margin: -.125em .25em; vertical-align: baseline; }
  .sds-content .katex-display { overflow: auto hidden; padding: .2em 0; }
`;
