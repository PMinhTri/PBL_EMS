import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './dto/user.dto';
import { BadRequestResult, IResponse, SuccessResult } from 'src/httpResponse';
import { ServiceResponseStatus } from 'src/serviceResponse';
import { CreateUserFailure } from 'src/enumTypes/enumFailures/user.failure.enum';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/create')
  async createUser(
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
        case CreateUserFailure.USER_ALREADY_EXISTS:
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
}
