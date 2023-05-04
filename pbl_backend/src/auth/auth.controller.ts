import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, createUserDto } from './dto/auth.dto';
import {
  BadRequestResult,
  IResponse,
  NotFoundResult,
  SuccessResult,
} from 'src/httpResponse';
import { ServiceResponseStatus } from 'src/serviceResponse';
import { CreateUserFailure } from 'src/enumTypes/enumFailures/user.failure.enum';
import { AuthenticationFailure } from 'src/enumTypes/enumFailures/auth.failure.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/create-user')
  async createUser(
    @Body() dto: createUserDto,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: user,
      status,
      failure,
    } = await this.authService.createUser(dto);

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case CreateUserFailure.USER_ALREADY_EXISTS:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: `email already exists`,
            }),
          );
        case CreateUserFailure.ROLE_NOT_FOUND:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: `role not found`,
            }),
          );
        case CreateUserFailure.EMAIL_ALREADY_EXISTS:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: `email already exists`,
            }),
          );
      }
    }

    return res.send(SuccessResult(user));
  }

  @Post('/login')
  async login(
    @Body() dto: LoginDto,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: user,
      status,
      failure,
    } = await this.authService.authentication(dto);

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case AuthenticationFailure.USER_NOT_FOUND:
          return res.send(
            NotFoundResult({
              reason: failure.reason,
              message: `email not found`,
            }),
          );
        case AuthenticationFailure.INCORRECT_PASSWORD:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: `incorrect password`,
            }),
          );
      }
    }

    return res.send(SuccessResult(user));
  }
}
