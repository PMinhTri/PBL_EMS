import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, ResetPasswordDto } from './dto/auth.dto';
import {
  BadRequestResult,
  IResponse,
  NotFoundResult,
  SuccessResult,
} from 'src/httpResponse';
import { ServiceResponseStatus } from 'src/serviceResponse';
import { AuthenticationFailure } from 'src/enumTypes/enumFailures/auth.failure.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() dto: LoginDto,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: user,
      status,
      failure,
    } = await this.authService.authenticate(dto);

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

  @Post('/reset-password')
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: newPassword,
      status,
      failure,
    } = await this.authService.resetPassword(dto);

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case AuthenticationFailure.USER_NOT_FOUND:
          return res.send(
            NotFoundResult({
              reason: failure.reason,
              message: `email not found`,
            }),
          );
        case AuthenticationFailure.PASSWORDS_DO_NOT_MATCH:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: `passwords do not match`,
            }),
          );
      }
    }

    return res.send(SuccessResult(newPassword));
  }
}
