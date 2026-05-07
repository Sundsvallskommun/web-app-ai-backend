export const maskApiKey = (apiKey?: string | null) => {
  return apiKey ? `****${apiKey.slice(-4)}` : '';
};
