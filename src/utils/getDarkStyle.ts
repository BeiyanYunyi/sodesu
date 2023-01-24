const style =
  '{--sodesu-white:#000;--sodesu-light-grey:#666;--sodesu-dark-grey:#999;--sodesu-color:#888;--sodesu-bgcolor:#1e1e1e;--sodesu-bgcolor-light:#272727;--sodesu-bgcolor-hover: #444;--sodesu-border-color:#333;--sodesu-disable-bgcolor:#444;--sodesu-disable-color:#272727;--sodesu-bq-color:#272727;--sodesu-info-bgcolor:#272727;--sodesu-info-color:#666}';

const getDarkStyle = (selector?: string | boolean): string => {
  if (typeof selector === 'string') {
    return selector === 'auto'
      ? `@media(prefers-color-scheme:dark){body${style}}`
      : `${selector}${style}`;
  }

  return selector === true ? `:root${style}` : '';
};

export default getDarkStyle;
