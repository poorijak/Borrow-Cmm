import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthUser, jwtPayload } from '@repo/types';
import type { Request } from 'express';
import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not set');
    }
    const cookieExtractor: JwtFromRequestFunction<Request> = (
      req: Request,
    ): string | null => {
      const token = req?.cookies?.accessToken;

      return typeof token === 'string' ? token : null;
    };

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  validate(payload: jwtPayload): AuthUser {
    return { userId: payload.sub, role: payload.role, email: payload.email };
  }
}
