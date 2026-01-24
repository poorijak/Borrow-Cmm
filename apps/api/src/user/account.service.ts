import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  async findAccount(data: Prisma.AccountWhereUniqueInput) {
    const account = await this.prisma.account.findUnique({
      where: data,
      include: { user: true },
    });
    return account;
  }

  async create(data: Prisma.AccountCreateInput) {
    const account = await this.prisma.account.create({
      data,
    });

    return account;
  }
}
