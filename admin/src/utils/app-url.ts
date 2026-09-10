export const appURL = (path?: string, relative?: boolean): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH;
  const normalizedPath = basePath && path?.startsWith(basePath) ? path.replace(basePath, '') : path;
  return relative ? `${normalizedPath}` : `${window.location.origin}${basePath}${normalizedPath}`;
};
