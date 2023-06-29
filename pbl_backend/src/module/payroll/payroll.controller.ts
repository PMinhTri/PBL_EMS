import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { BadRequestResult, IResponse, SuccessResult } from 'src/httpResponse';
import { ServiceResponseStatus } from 'src/serviceResponse';
import { PayrollFailure } from 'src/enumTypes/failure.enum';
import { PayrollDto } from './payroll.dto';

@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post('')
  public async calculatePayroll(
    @Body() dto: PayrollDto,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { status, result, failure } =
      await this.payrollService.calculatePayrollInMonth(dto);

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case PayrollFailure.PAYROLL_ALREADY_PAID:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: 'Payroll already paid',
            }),
          );
      }
    }

    return res.send(SuccessResult(result));
  }

  @Post('/all')
  public async calculatePayrollForAllUser(
    @Body() dto: PayrollDto[],
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { status, result, failure } =
      await this.payrollService.calculatePayrollForAllUserInMonth(dto);

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case PayrollFailure.PAYROLL_ALREADY_PAID:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: 'Có một vài nhân viên đã được thanh toán rồi',
            }),
          );
      }
    }

    return res.send(SuccessResult(result));
  }

  @Get('/user')
  public async getAllPayrollInYearOfUser(
    @Query('userId') userId: string,
    @Query('year') year: number,
    @Query('month') month: number,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      status,
      result: payroll,
      failure,
    } = await this.payrollService.getAllPayrollOfUser(
      userId,
      Number(year),
      Number(month),
    );

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case PayrollFailure.PAYROLL_NOT_FOUND:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: 'Payroll not found',
            }),
          );
      }
    }

    return res.send(SuccessResult(payroll));
  }

  @Get('')
  public async getAllPayrollOfAllUser(
    @Query('year') year: number,
    @Query('month') month: number,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const payrolls = await this.payrollService.getAllPayrollOfAllUser(
      Number(year),
      Number(month),
    );

    return res.send(SuccessResult(payrolls));
  }

  @Patch('/:id')
  public async updatePayroll(
    @Param('id') id: string,
    @Body() dto: Partial<Omit<PayrollDto, 'userId'>>,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { status, result, failure } = await this.payrollService.updatePayroll(
      id,
      dto,
    );

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case PayrollFailure.PAYROLL_NOT_FOUND:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: 'Payroll not found',
            }),
          );
      }
    }

    return res.send(SuccessResult(result));
  }
}
