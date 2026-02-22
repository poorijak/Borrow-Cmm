import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGurad extends AuthGuard('google') {
  getAuthenticateOptions(
    context: ExecutionContext,
  ): IAuthModuleOptions | undefined {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const callBackUrl = req.query.callBackUrl;

    if (callBackUrl) {
      res.cookie('return_to', callBackUrl, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 5 * 60 * 1000,
      });
    }
    return {}; // คืนค่า options ปกติ
  }
}
