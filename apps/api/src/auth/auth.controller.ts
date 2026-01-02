import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { GoogleAuthGurad } from './guards/google-auth.guard';
import type { Request as ExpressRequest, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from 'prisma/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get('google')
  @UseGuards(GoogleAuthGurad)
  async googleLogin(@Request() req) {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGurad)
  async googleCallback(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.loginWithGoogle(req.user);

    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${redirectUrl}`);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@Req() req) {
    return this.authService.findUser(req.user.id);
  }

  @Get('refresh')
  refreshToken(
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken : string = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh Token');
    }

    const newAccessToken = this.authService.refreshAccessToken(refreshToken);

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });

    return { ok: true };
  }

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
