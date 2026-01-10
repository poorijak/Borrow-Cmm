import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../../admin/role.enum';
import { ROLE_KEY } from 'src/common/decorators/role.decorator';
import { jwtGuardPayload } from 'src/auth/types/auth';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflactor: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflactor.getAllAndOverride<Role[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user }: jwtGuardPayload = context.switchToHttp().getRequest();

    console.log(user);

    if (!user) {
      throw new ForbiddenException('user not found');
    }

    console.log(user.role);

    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException("You don't have permission");
    }

    return true;
  }
}
