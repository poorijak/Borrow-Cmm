import {
  Controller,
  Get,
  UseGuards,
  Request,
  Req,
  Res,
  UnauthorizedException,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGurad } from '../common/guards/google-auth.guard';
import type { Request as ExpressRequest, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { googleUser } from './types/auth';
import { AuthUser } from '@repo/types';

type GoogleRequest = ExpressRequest & {
  user: googleUser;
};

type ValidateUser = ExpressRequest & {
  user: AuthUser;
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('google')
  @UseGuards(GoogleAuthGurad)
  async googleLogin(@Request() req: ExpressRequest, @Res() res: Response) {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGurad)
  async googleCallback(@Req() req: GoogleRequest, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.loginWithGoogle(req.user);

    res.cookie(
      'accessToken',
      accessToken,
      this.authService.getCookieOptions('access'),
    );

    res.cookie(
      'refreshToken',
      refreshToken,
      this.authService.getCookieOptions('refresh'),
    );

    const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const savedCallbackUrl = req.cookies?.['return_to'] || '/';

    res.clearCookie('return_to');

    console.log('Redirecting to:', `${redirectUrl}${savedCallbackUrl}`);
    return res.redirect(`${redirectUrl}${savedCallbackUrl}`);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@Req() req: ValidateUser) {
    return this.userService.findOne({
      id: req.user.userId,
    });
  }

  @Get('refresh')
  async refreshToken(
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken: string = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh Token');
    }

    const newAccessToken =
      await this.authService.refreshAccessToken(refreshToken);

    res.cookie(
      'accessToken',
      newAccessToken,
      this.authService.getCookieOptions('access'),
    );

    return { ok: true };
  }

  @Post('signout')
  signout(@Res({ passthrough: true }) res: Response) {
    const options = this.authService.getCookieOptions('access');

    res.clearCookie('accessToken', { ...options, maxAge: 0 });
    res.clearCookie('refreshToken', { ...options, maxAge: 0 });

    return { success: true };
  }
}
