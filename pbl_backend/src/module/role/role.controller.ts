import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { RoleService } from './role.service';
import { BadRequestResult, IResponse, SuccessResult } from 'src/httpResponse';
import { RoleEnum } from 'src/enumTypes/role.enum';
import { ServiceResponseStatus } from 'src/serviceResponse';
import { RoleFailure } from 'src/enumTypes/failure.enum';
import { Roles } from './role.decorator';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  public async getRoles(@Res() res: IResponse): Promise<IResponse> {
    const roles = await this.roleService.getRoles();

    return res.send(SuccessResult(roles));
  }

  @Post('/add')
  @Roles(RoleEnum.ADMIN)
  public async addRole(
    @Body() dto: { role: string },
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { result, status, failure } = await this.roleService.addRole(
      dto.role as RoleEnum,
    );

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case RoleFailure.ROLE_ALREADY_EXISTS:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: `Role already exists`,
            }),
          );
      }
    }

    return res.send(SuccessResult(result));
  }
}
