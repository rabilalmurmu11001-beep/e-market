import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role, ROLES_KEY } from 'src/common/utils/decorators/role.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getClass(), context.getHandler()]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    const isAuthorized = requiredRoles.includes(user.role);
    return isAuthorized;
  }
}
