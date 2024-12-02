export function getQuery(element: HTMLElement): string | null {
  return element.dataset.path || null;
}
