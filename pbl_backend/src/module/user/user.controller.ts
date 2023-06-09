import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { BadRequestResult, IResponse, SuccessResult } from 'src/httpResponse';
import { ServiceResponseStatus } from 'src/serviceResponse';
import { UserFailure } from 'src/enumTypes/failure.enum';
import { UserInformation } from './user.type';
import { Roles } from '../role/role.decorator';
import { RoleEnum } from 'src/enumTypes/role.enum';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  public async getAllUsers(
    @Query('search') search: string,
    @Query('gender') gender: string,
    @Query('jobTitleId') jobTitleId: string,
    @Query('departmentId') departmentId: string,
    @Query('employeeStatus') employeeStatus: string,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { result: users } = await this.userService.getAllUsers(search, {
      gender,
      jobTitleId,
      departmentId,
      employeeStatus,
    });

    return res.send(SuccessResult(users));
  }

  @Post('import')
  async importUsers(
    @Body() data: CreateUserDto[],
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { status, failure } = await this.userService.importUsers(data);

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case UserFailure.USER_ALREADY_EXISTS:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: `Người dùng đã tồn tại`,
            }),
          );
      }
    }

    return res.send(SuccessResult());
  }

  @Post('/create')
  @Roles(RoleEnum.ADMIN)
  public async createUser(
    @Body() dto: CreateUserDto,
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

  @Patch('/:id/update-personal-information')
  public async updatePersonalInformation(
    @Param('id') id: string,
    @Body() payload: Partial<UserInformation>,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: users,
      status,
      failure,
    } = await this.userService.updatePersonalInformation(id, payload);

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

    return res.send(SuccessResult(users));
  }

  @Patch('/:id/update-avatar/')
  public async updateAvatar(
    @Param('id') id: string,
    @Body() payload: { avatar: string },
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { avatar } = payload;
    const { status, failure } = await this.userService.updateAvatar(id, avatar);

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

  @Delete(':id/delete-avatar')
  public async deleteAvatar(
    @Param('id') id: string,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { status, failure } = await this.userService.deleteAvatar(id);

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

  @Get(':id')
  public async getById(
    @Param('id') id: string,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: user,
      status,
      failure,
    } = await this.userService.getById(id);

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

    return res.send(SuccessResult(user));
  }

  @Delete(':id')
  public async deleteById(
    @Param('id') id: string,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: user,
      status,
      failure,
    } = await this.userService.deleteById(id);

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

    return res.send(SuccessResult(user));
  }
}
