export function errorHandler(err: Error): void {
  if (err.name !== 'AbortError') console.error(err.message);
}
