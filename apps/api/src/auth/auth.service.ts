import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'prisma/prisma.service';
import { googleUser } from './types/auth';
import { JwtService } from '@nestjs/jwt';

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
  ) {}

  async loginWithGoogle(googleUser: googleUser): Promise<loginToken> {
    if (!googleUser.email)
      throw new UnauthorizedException('จะพบอีเมลล์ที่เชื่อมกับ Google');

    const existingAccount = await this.prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: googleUser.provider,
          providerAccountId: googleUser.providerAccountId,
        },
      },
      include: { user: true },
    });

    let userId: string;

    if (existingAccount) {
      userId = existingAccount.userId;

      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name: googleUser.name || existingAccount.user.name,
          profileImage: googleUser.picture || existingAccount.user.profileImage,
        },
      });
    } else {
      const existingUserByEmail = await this.prisma.user.findUnique({
        where: {
          email: googleUser.email,
        },
      });

      if (existingUserByEmail) {
        userId = existingUserByEmail.id;
      } else {
        const newUser = await this.prisma.user.create({
          data: {
            email: googleUser.email,
            name: googleUser.name,
            profileImage: googleUser.picture,
            role: 'Student',
          },
        });
        userId = newUser.id;
      }

      await this.prisma.account.create({
        data: {
          userId,
          provider: googleUser.provider,
          providerAccountId: googleUser.providerAccountId,
        },
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

  async findUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    return user;
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

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
