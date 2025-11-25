export const getBaseUrl = (): string => {
  if (typeof window === 'undefined') return '';
  
  const { protocol, hostname, port } = window.location;
  
  // Development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${hostname}:${port}`;
  }
  
  // Production
  return `${protocol}//${hostname}`;
};

export const getHotelWebsiteUrl = (slug: string): string => {
  return `${getBaseUrl()}/hotel/${slug}`;
};
