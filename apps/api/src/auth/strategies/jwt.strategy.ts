import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
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

  async validate(payload: any) {
    // This payload will be the decrypted token payload you provided when signing the token
    return { id: payload.sub };
  }
}
