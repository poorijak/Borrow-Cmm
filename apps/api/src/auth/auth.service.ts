import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { googleUser } from './types/auth';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AccountService } from 'src/user/account.service';

type loginToken = {
  accessToken: string;
  refreshToken: string;
};

type jwtRefreshToken = {
  sub: string;
  iat: number;
  exp: number;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly userService: UserService,
    private readonly accountService: AccountService,
  ) {}

  async loginWithGoogle(googleUser: googleUser): Promise<loginToken> {
    if (!googleUser.email)
      throw new UnauthorizedException('จะพบอีเมลล์ที่เชื่อมกับ Google');

    const existingAccount = await this.accountService.findAccount({
      provider_providerAccountId: {
        provider: googleUser.provider,
        providerAccountId: googleUser.providerAccountId,
      },
    });

    let userId: string;

    if (existingAccount) {
      userId = existingAccount.userId;

      await this.userService.update(userId, {
        name: googleUser.name || existingAccount.user.name,
        profileImage: googleUser.picture || existingAccount.user.profileImage,
      });
    } else {
      const existingUserByEmail = await this.userService.findUser({
        email: googleUser.email,
      });

      if (existingUserByEmail) {
        userId = existingUserByEmail.id;
      } else {
        const newUser = await this.userService.create({
          email: googleUser.email,
          name: googleUser.name,
          profileImage: googleUser.picture,
          role: 'Student',
        });
        userId = newUser.id;
      }

      await this.accountService.create({
        user: {
          connect: { id: userId },
        },
        provider: googleUser.provider,
        providerAccountId: googleUser.providerAccountId,
      });
    }
    const accessToken = await this.jwt.signAsync(
      { sub: userId },
      { expiresIn: '30m' },
    );
    const refreshToken = await this.jwt.signAsync(
      { sub: userId },
      { expiresIn: '30d' },
    );

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload: jwtRefreshToken = await this.jwt.verifyAsync(refreshToken);

      const newAccessToken = await this.jwt.signAsync(
        { sub: payload.sub },
        { expiresIn: '30m' },
      );

      return newAccessToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh Token');
    }
  }

  getCookieOptions(type: 'access' | 'refresh') {
    const isProd = process.env.NODE_ENV === 'production';
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? ('none' as const) : ('lax' as const),
      path: '/',
      maxAge: type === 'access' ? 1000 * 60 * 30 : 1000 * 60 * 60 * 24 * 30,
    };
  }
}
