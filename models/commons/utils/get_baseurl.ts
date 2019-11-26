export function getBaseUrl(isServer: boolean) {
  if (isServer) {
    const protocol = process.env.PROTOCOL || 'http';
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || '3000';
    return `${protocol}://${host}:${port}`;
  }
  return '';
}
