export const appURL = (path?: string, relative?: boolean): string => {
  return `${relative ? '' : window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH}${path}`;
};
