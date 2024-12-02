export function decodePath(path: string): string {
  try {
    path = decodeURI(path);
  }
  catch (err) {
    // ignore error
  }

  return path;
}

export function removeEndingSplash(content = ''): string {
  return content.replace(/\/$/u, '');
}

export function isLinkHttp(link: string): boolean {
  return /^(https?:)?\/\//.test(link);
}
