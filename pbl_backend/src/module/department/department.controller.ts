import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentDto } from './department.dto';
import { BadRequestResult, IResponse, SuccessResult } from 'src/httpResponse';
import { ServiceResponseStatus } from 'src/serviceResponse';

@Controller('department')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  @Post('/create')
  public async create(
    @Body() dto: DepartmentDto,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { result, status, failure } =
      await this.departmentService.createDepartment(dto);

    if (status === ServiceResponseStatus.Failed) {
      return res.send(
        BadRequestResult({
          reason: failure.reason,
          message: 'Department already exists',
        }),
      );
    }

    return res.send(SuccessResult(result));
  }

  @Get('')
  public async getAll(@Res() res: IResponse): Promise<IResponse> {
    const { result } = await this.departmentService.getAllDepartment();
    return res.send(SuccessResult(result));
  }

  @Get(':id')
  public async getById(
    @Res() res: IResponse,
    @Param('id') id: string,
  ): Promise<IResponse> {
    const { result, status, failure } =
      await this.departmentService.getDepartmentById(id);

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case 'DEPARTMENT_NOT_FOUND':
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: 'Department not found',
            }),
          );
      }
    }

    return res.send(result);
  }
}
