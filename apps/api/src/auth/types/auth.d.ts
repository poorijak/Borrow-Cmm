export type googleUser = {
  provider: 'google';
  providerAccountId: string;
  email: string | null;
  name: string;
  picture: string | null;
  accessToken?: string;
  refreshToken?: string;
};
