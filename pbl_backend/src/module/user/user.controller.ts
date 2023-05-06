import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './user.dto';
import { BadRequestResult, IResponse, SuccessResult } from 'src/httpResponse';
import { ServiceResponseStatus } from 'src/serviceResponse';
import { UserFailure } from 'src/enumTypes/failure.enum';
import { updateInformationInput } from './user.type';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  public async getAllUsers(@Res() res: IResponse): Promise<IResponse> {
    const { result: users } = await this.userService.getAllUsers();

    return res.send(SuccessResult(users));
  }

  @Post('/create')
  public async createUser(
    @Body() dto: createUserDto,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: user,
      status,
      failure,
    } = await this.userService.createUser(dto);

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case UserFailure.USER_ALREADY_EXISTS:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: `User already exists`,
            }),
          );
      }
    }

    return res.send(SuccessResult(user));
  }

  @Get('/emails')
  public async getAllEmails(@Res() res: IResponse): Promise<IResponse> {
    const emails = await this.userService.getAllEmails();

    return res.send(SuccessResult(emails));
  }

  @Post('/update-personal-information')
  public async updatePersonalInformation(
    @Body() payload: updateInformationInput,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { email, userInformation } = payload;
    console.log(payload);
    const { status, failure } =
      await this.userService.updatePersonalInformation(email, userInformation);

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case UserFailure.USER_NOT_FOUND:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: `User not found`,
            }),
          );
      }
    }

    return res.send(SuccessResult());
  }
}
