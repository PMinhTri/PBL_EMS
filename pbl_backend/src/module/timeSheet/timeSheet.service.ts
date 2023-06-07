import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ServiceFailure,
  ServiceResponse,
  ServiceResponseStatus,
} from 'src/serviceResponse';
import { TimeSheet } from '@prisma/client';
import { TimeSheetFailure } from 'src/enumTypes/failure.enum';
import { TimeSheetDto } from './timeSheet.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class TimeSheetService {
  constructor(private prisma: PrismaService) {}

  public async createTimeSheet(
    dto: TimeSheetDto,
  ): Promise<ServiceResponse<TimeSheet, ServiceFailure<TimeSheetFailure>>> {
    const extractDate = dayjs(dto.date).format('DD/MM/YYYY');
    const [date, month, year] = extractDate.split('/').map(Number);

    const existingLeave = await this.prisma.leave.findFirst({
      where: {
        userId: dto.userId,
        startDate: {
          lte: new Date(dto.date),
        },
        endDate: {
          gte: new Date(dto.date),
        },
      },
    });

    if (existingLeave) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: TimeSheetFailure.REQUEST_ON_LEAVE_DATE,
        },
      };
    }

    const existingTimeSheet = await this.prisma.timeSheet.findFirst({
      where: {
        userId: dto.userId,
        session: dto.session,
        date: date,
        month: month,
        year: year,
      },
    });

    if (existingTimeSheet) {
      if (existingTimeSheet.status === 'Đã chấm') {
        return {
          status: ServiceResponseStatus.Failed,
          failure: {
            reason: TimeSheetFailure.TIME_SHEET_ALREADY_EXISTS,
          },
        };
      }
    }

    const timeSheet = await this.prisma.timeSheet.create({
      data: {
        userId: dto.userId,
        session: dto.session,
        status: dto.status,
        hoursWorked: dto.hoursWorked,
        timeIn: dto.timeIn,
        date: date,
        month: month,
        year: year,
        overtime: dto.overtime,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: timeSheet,
    };
  }

  public async getAllTimeSheetByUserId(
    userId: string,
  ): Promise<ServiceResponse<TimeSheet[], ServiceFailure<TimeSheetFailure>>> {
    const timeSheets = await this.prisma.timeSheet.findMany({
      where: {
        userId: userId,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: timeSheets,
    };
  }

  public async getAllTimeSheetByUserIdAndMonth(
    userId: string,
    month: number,
    year: number,
  ): Promise<ServiceResponse<TimeSheet[], ServiceFailure<TimeSheetFailure>>> {
    const timeSheets = await this.prisma.timeSheet.findMany({
      where: {
        userId: userId,
        month: month,
        year: year,
      },
    });

    if (!timeSheets) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: TimeSheetFailure.TIME_SHEET_NOT_FOUND,
        },
      };
    }

    return {
      status: ServiceResponseStatus.Success,
      result: timeSheets,
    };
  }

  public async deleteAllTimeSheetByUserId(
    userId: string,
  ): Promise<ServiceResponse<TimeSheet[], ServiceFailure<TimeSheetFailure>>> {
    await this.prisma.timeSheet.deleteMany({
      where: {
        userId: userId,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: null,
    };
  }

  public async totalWorkloadOfUser(
    userId: string,
    month: number,
    year: number,
  ): Promise<ServiceResponse<number, ServiceFailure<TimeSheetFailure>>> {
    const timeSheets = await this.prisma.timeSheet.findMany({
      where: {
        userId: userId,
        month: month,
        year: year,
      },
    });

    if (!timeSheets) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: TimeSheetFailure.TIME_SHEET_NOT_FOUND,
        },
      };
    }

    const totalWorkload =
      timeSheets.reduce((acc, curr) => {
        return acc + curr.hoursWorked;
      }, 0) / 8;

    return {
      status: ServiceResponseStatus.Success,
      result: totalWorkload,
    };
  }

  public async totalOvertimeOfUser(
    userId: string,
    month: number,
    year: number,
  ): Promise<ServiceResponse<number, ServiceFailure<TimeSheetFailure>>> {
    const overtime = await this.prisma.timeSheet.findMany({
      where: {
        userId: userId,
        month: month,
        year: year,
        overtime: true,
      },
    });

    if (!overtime) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: TimeSheetFailure.TIME_SHEET_NOT_FOUND,
        },
      };
    }

    const totalOvertime =
      overtime.reduce((acc, curr) => {
        return acc + curr.hoursWorked;
      }, 0) / 8;

    return {
      status: ServiceResponseStatus.Success,
      result: totalOvertime,
    };
  }

  public async getAllTimeSheetInMonth(
    month: number,
    year: number,
  ): Promise<ServiceResponse<TimeSheet[], ServiceFailure<TimeSheetFailure>>> {
    const timeSheets = await this.prisma.timeSheet.findMany({
      where: {
        month: month,
        year: year,
      },
    });

    if (!timeSheets) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: TimeSheetFailure.TIME_SHEET_NOT_FOUND,
        },
      };
    }

    return {
      status: ServiceResponseStatus.Success,
      result: timeSheets,
    };
  }
}
