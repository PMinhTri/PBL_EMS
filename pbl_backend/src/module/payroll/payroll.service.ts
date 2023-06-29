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
import { LeaveService } from '../leave/leave.service';
import { PayrollStatus } from 'src/enumTypes/payroll.enum';

@Injectable()
export class PayrollService {
  constructor(
    private prisma: PrismaService,
    private timeSheetService: TimeSheetService,
    private leaveService: LeaveService,
  ) {}

  public async calculatePayrollInMonth(
    dto: PayrollDto,
  ): Promise<ServiceResponse<Payroll, ServiceFailure<PayrollFailure>>> {
    const payroll = await this.prisma.payroll.findFirst({
      where: {
        userId: dto.userId,
        month: dto.month,
        year: dto.year,
        status: PayrollStatus.Paid,
      },
    });

    if (payroll) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: PayrollFailure.PAYROLL_ALREADY_PAID,
        },
      };
    }

    const { result: totalHoursWorked } =
      await this.timeSheetService.totalWorkloadOfUser(
        dto.userId,
        dto.month,
        dto.year,
      );

    const { result: totalOvertime } =
      await this.timeSheetService.totalOvertimeOfUser(
        payroll.userId,
        payroll.month,
        payroll.year,
      );

    const leaveRequestInMonth = await this.leaveService.getAllLeaveRequest(
      dto.month,
      dto.year,
    );

    const totalLeaveRequestInMonthOfUser = leaveRequestInMonth
      .filter((leave) => leave.userId === dto.userId)
      .reduce((acc, leave) => {
        if (leave.status === 'APPROVED') return acc + leave.leaveDays;
      }, 0);

    const totalSalary =
      totalHoursWorked * dto.basicSalary +
      totalLeaveRequestInMonthOfUser +
      totalOvertime * dto.basicSalary +
      dto.additional;

    const newPayroll = await this.prisma.payroll.create({
      data: {
        userId: dto.userId,
        month: dto.month,
        year: dto.year,
        totalSalary: totalSalary,
        basicSalary: dto.basicSalary,
        additional: dto.additional,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: newPayroll,
    };
  }

  public async calculatePayrollForAllUserInMonth(
    dto: PayrollDto[],
  ): Promise<ServiceResponse<Payroll[], ServiceFailure<PayrollFailure>>> {
    const listNewPayroll: Payroll[] = [];
    for (const payroll of dto) {
      const existingPayroll = await this.prisma.payroll.findFirst({
        where: {
          userId: payroll.userId,
          month: payroll.month,
          year: payroll.year,
          status: PayrollStatus.Paid,
        },
      });

      if (existingPayroll) {
        return {
          status: ServiceResponseStatus.Failed,
          failure: {
            reason: PayrollFailure.PAYROLL_ALREADY_PAID,
          },
        };
      }

      const { result: totalHoursWorked } =
        await this.timeSheetService.totalWorkloadOfUser(
          payroll.userId,
          payroll.month,
          payroll.year,
        );

      const { result: totalOvertime } =
        await this.timeSheetService.totalOvertimeOfUser(
          payroll.userId,
          payroll.month,
          payroll.year,
        );

      const leaveRequestInMonth = await this.leaveService.getAllLeaveRequest(
        payroll.month,
        payroll.year,
      );

      const totalLeaveRequestInMonthOfUser = leaveRequestInMonth
        .filter((leave) => leave.userId === payroll.userId)
        .reduce((acc, leave) => {
          if (leave.status === 'APPROVED') return acc + leave.leaveDays;
        }, 0);

      const totalSalary =
        totalHoursWorked * payroll.basicSalary +
        totalOvertime * payroll.basicSalary +
        totalLeaveRequestInMonthOfUser +
        payroll.additional;

      const newPayroll = await this.prisma.payroll.create({
        data: {
          userId: payroll.userId,
          month: payroll.month,
          year: payroll.year,
          totalSalary: totalSalary,
          basicSalary: payroll.basicSalary,
          additional: payroll.additional,
          status: PayrollStatus.Unpaid,
        },
      });

      listNewPayroll.push(newPayroll);
    }

    return {
      status: ServiceResponseStatus.Success,
      result: listNewPayroll,
    };
  }

  public async updatePayroll(
    id: string,
    dto: Partial<Omit<PayrollDto, 'userId'>>,
  ): Promise<ServiceResponse<Payroll, ServiceFailure<PayrollFailure>>> {
    const payroll = await this.prisma.payroll.findFirst({
      where: {
        id: id,
        month: dto.month,
        year: dto.year,
      },
    });

    if (!payroll) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: PayrollFailure.PAYROLL_NOT_FOUND,
        },
      };
    }

    const { result: totalHoursWorked } =
      await this.timeSheetService.totalWorkloadOfUser(
        payroll.userId,
        payroll.month,
        payroll.year,
      );

    const { result: totalOvertime } =
      await this.timeSheetService.totalOvertimeOfUser(
        payroll.userId,
        payroll.month,
        payroll.year,
      );

    const leaveRequestInMonth = await this.leaveService.getAllLeaveRequest(
      payroll.month,
      payroll.year,
    );

    const totalLeaveRequestInMonthOfUser = leaveRequestInMonth
      .filter((leave) => leave.userId === payroll.userId)
      .reduce((acc, leave) => {
        if (leave.status === 'APPROVED') return acc + leave.leaveDays;
      }, 0);

    if (!dto.basicSalary) {
      dto.basicSalary = payroll.basicSalary;
    }

    if (!dto.additional) {
      dto.additional = payroll.additional;
    }

    const totalSalary =
      totalHoursWorked * dto.basicSalary +
      totalOvertime * dto.basicSalary +
      totalLeaveRequestInMonthOfUser +
      dto.additional;

    const updatedPayroll = await this.prisma.payroll.update({
      where: {
        id: id,
      },
      data: {
        basicSalary: dto.basicSalary,
        totalSalary: totalSalary,
        additional: dto.additional,
        status: dto.status,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: updatedPayroll,
    };
  }

  public async getAllPayrollOfUser(
    userId: string,
    year: number,
    month?: number,
  ): Promise<ServiceResponse<Payroll[], ServiceFailure<PayrollFailure>>> {
    const payrolls = await this.prisma.payroll.findMany({
      where: {
        userId: userId,
        month: {
          in: month ? [month] : undefined,
        },
        year: year,
      },
    });

    if (!payrolls) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: PayrollFailure.PAYROLL_NOT_FOUND,
        },
      };
    }

    return {
      status: ServiceResponseStatus.Success,
      result: payrolls,
    };
  }

  public getAllPayrollOfAllUser(
    year: number,
    month?: number,
  ): Promise<Payroll[]> {
    const payrolls = this.prisma.payroll.findMany({
      where: {
        month: {
          in: month ? [month] : undefined,
        },
        year: year,
      },
    });

    return payrolls;
  }
}
