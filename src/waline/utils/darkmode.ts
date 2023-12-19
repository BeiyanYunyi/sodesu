const style = `{--waline-white:#000;--waline-light-grey:#666;--waline-dark-grey:#999;--waline-color:#888;--waline-bg-color:#1e1e1e;--waline-bg-color-light:#272727;--waline-bg-color-hover: #444;--waline-border-color:#333;--waline-disable-bg-color:#444;--waline-disable-color:#272727;--waline-bq-color:#272727;--waline-info-bg-color:#272727;--waline-info-color:#666}`;

export const getDarkStyle = (selector?: string | boolean): string => {
  if (typeof selector === 'string') {
    return selector === 'auto'
      ? `@media(prefers-color-scheme:dark){body${style}}`
      : `${selector}${style}`;
  }

  return selector === true ? `:root${style}` : '';
};
