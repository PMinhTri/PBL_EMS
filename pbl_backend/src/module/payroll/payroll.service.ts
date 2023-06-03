import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TimeSheetService } from '../timeSheet/timeSheet.service';
import {
  ServiceFailure,
  ServiceResponse,
  ServiceResponseStatus,
} from 'src/serviceResponse';
import { Payroll } from '@prisma/client';
import { PayrollFailure } from 'src/enumTypes/failure.enum';
import { PayrollDto } from './payroll.dto';

@Injectable()
export class PayrollService {
  constructor(
    private prisma: PrismaService,
    private timeSheetService: TimeSheetService,
  ) {}

  // public async calculatePayrollInMonth(
  //   dto: PayrollDto,
  // ): Promise<ServiceResponse<Payroll, ServiceFailure<PayrollFailure>>> {
  //   const payroll = await this.prisma.payroll.findFirst({
  //     where: {
  //       userId: dto.userId,
  //       month: dto.month,
  //       year: dto.year,
  //     },
  //   });

  //   if (payroll) {
  //     return {
  //       status: ServiceResponseStatus.Failed,
  //       failure: {
  //         reason: PayrollFailure.PAYROLL_ALREADY_PAID,
  //       },
  //     };
  //   }

  //   const { result: totalHoursWorked } =
  //     await this.timeSheetService.totalTimeWorkedInMonth(
  //       dto.userId,
  //       dto.month,
  //       dto.year,
  //     );

  //   const totalSalary = totalHoursWorked * dto.basicSalary;

  //   const newPayroll = await this.prisma.payroll.create({
  //     data: {
  //       userId: dto.userId,
  //       month: dto.month,
  //       year: dto.year,
  //       totalSalary: totalSalary,
  //       basicSalary: dto.basicSalary,
  //       additional: dto.additional,
  //     },
  //   });

  //   return {
  //     status: ServiceResponseStatus.Success,
  //     result: newPayroll,
  //   };
  // }

  // public async getAllPayrollOfUser(
  //   userId: number,
  //   year: number,
  // ): Promise<ServiceResponse<Payroll[], ServiceFailure<PayrollFailure>>> {
  //   const payrolls = await this.prisma.payroll.findMany({
  //     where: {
  //       userId: userId,
  //       year: year,
  //     },
  //   });

  //   if (!payrolls) {
  //     return {
  //       status: ServiceResponseStatus.Failed,
  //       failure: {
  //         reason: PayrollFailure.PAYROLL_NOT_FOUND,
  //       },
  //     };
  //   }

  //   return {
  //     status: ServiceResponseStatus.Success,
  //     result: payrolls,
  //   };
  // }
}
