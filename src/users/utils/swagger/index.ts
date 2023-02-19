export const getAuthorizationApiHeader = (): {
  name: string;
  description: string;
} => ({
  name: 'Authorization',
  description: 'Bearer token',
});
