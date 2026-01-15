import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from '../common/strategies/google.strategies';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PassportModule, PrismaModule, ConfigModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
})
export class AuthModule {}
