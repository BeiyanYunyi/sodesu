export function getRoot(el: string | HTMLElement | undefined): HTMLElement | null {
  return el instanceof HTMLElement
    ? el
    : typeof el === 'string'
      ? document.querySelector(el)
      : null;
}
