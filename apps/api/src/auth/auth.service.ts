import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'prisma/prisma.service';
import { googleUser } from './types/auth';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async loginWithGoogle(googleUser: googleUser) {
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
        const role = await this.prisma.role.findUnique({
          where: { slug: 'student' },
        });

        if (!role)
          throw new Error('Role "student" not found. Seed roles first');

        const newUser = await this.prisma.user.create({
          data: {
            email: googleUser.email,
            name: googleUser.name,
            profileImage: googleUser.picture,
            roleId: role.id,
          },
        });

        userId = newUser.id;
      }

      await this.prisma.account.create({
        data: {
          userId,
          provider: 'google',
          providerAccountId: googleUser.providerAccountId,
        },
      });

      const payload = { sub: userId };
      const accessToken = await this.jwt.signAsync(payload);
      console.log('accessToken', accessToken);

      return { accessToken };
    }
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
