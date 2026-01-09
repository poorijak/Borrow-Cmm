import { Role } from 'src/admin/role.enum';

export type googleUser = {
  provider: 'google';
  providerAccountId: string;
  email: string | null;
  name: string;
  picture: string | null;
  accessToken?: string;
  refreshToken?: string;
};

export type jwtGuardPayload = {
  user: {
    userId: string;
    role: Role;
    email: string;
  };
};
