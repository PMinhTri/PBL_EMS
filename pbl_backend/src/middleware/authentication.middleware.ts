import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { IRequest, IResponse, UnauthorizedResult } from 'src/httpResponse';
import { HttpStatus } from '@nestjs/common/enums';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  use(req: IRequest, res: IResponse, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
          ignoreExpiration: true,
        });
        req['user'] = decoded;
        next();
      } catch (error) {
        return res.status(HttpStatus.UNAUTHORIZED).send(
          UnauthorizedResult({
            message: 'Invalid Token',
          }),
        );
      }
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).send(
        UnauthorizedResult({
          message: 'Unauthorized',
        }),
      );
    }
  }
}
