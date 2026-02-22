export type jwtPayload = {
  sub: string;
  role: string;
  email: string;
  iat: number;
  exp: number;
};

export type AuthUser = {
  userId: string;
  role: string;
  email: string;
};
