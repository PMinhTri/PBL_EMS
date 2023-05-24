import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
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

  @Get('/user')
  public async getAllPayrollInYearOfUser(
    @Query('userId') userId: number,
    @Query('year') year: number,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      status,
      result: payroll,
      failure,
    } = await this.payrollService.getAllPayrollOfUser(
      Number(userId),
      Number(year),
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
}
