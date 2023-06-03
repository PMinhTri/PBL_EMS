import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './role.decorator';
import { Role } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const token = context
      .switchToHttp()
      .getRequest()
      .rawHeaders.find((header) => header.startsWith('Bearer'));

    const user = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, {
      ignoreExpiration: true,
    });

    return requiredRoles.some((role) => user['role'] === role);
  }
}
