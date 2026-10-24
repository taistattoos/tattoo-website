export function getCurrentLocale(pathname: string): string {
  return pathname.split('/')[1];
}

export function getLocalizedPath(pathname: string, code: string): string {
  const segments = pathname.split('/');
  segments[1] = code;
  return segments.join('/') || '/';
}