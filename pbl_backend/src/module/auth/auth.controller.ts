import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, ChangePasswordDto, forgotPasswordDto } from './auth.dto';
import {
  BadRequestResult,
  IResponse,
  NotFoundResult,
  SuccessResult,
} from 'src/httpResponse';
import { ServiceResponseStatus } from 'src/serviceResponse';
import { AuthenticationFailure } from 'src/enumTypes/failure.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  public async login(
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

  @Post('/change-password')
  public async changePassword(
    @Body() dto: ChangePasswordDto,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: newPassword,
      status,
      failure,
    } = await this.authService.changePassword(dto);

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

  @Post('/forgot-password')
  public async forgotPassword(
    @Body() dto: forgotPasswordDto,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    console.log(dto.email);
    const { status, failure } = await this.authService.sendResetPasswordEmail(
      dto.email,
    );

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case AuthenticationFailure.USER_NOT_FOUND:
          return res.send(
            NotFoundResult({
              reason: failure.reason,
              message: `email not found`,
            }),
          );
      }
    }

    return res.send(SuccessResult());
  }
}
