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
import { timeSheetStatus } from 'src/enumTypes/timeSheet.enum';

@Injectable()
export class TimeSheetService {
  constructor(private prisma: PrismaService) {}

  public async createTimeSheet(
    dto: TimeSheetDto,
  ): Promise<ServiceResponse<TimeSheet, ServiceFailure<TimeSheetFailure>>> {
    const extractDate = dayjs(dto.date).format('DD/MM/YYYY');
    const [date, month, year] = extractDate.split('/').map(Number);

    const existingLeave = await this.prisma.leaveRequest.findFirst({
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
      if (existingTimeSheet.status === timeSheetStatus.Submitted) {
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
    date?: number,
  ): Promise<ServiceResponse<TimeSheet[], ServiceFailure<TimeSheetFailure>>> {
    if (date) {
      const timeSheets = await this.prisma.timeSheet.findMany({
        where: {
          userId: userId,
          date: date,
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
        overtime: false,
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

  public async getAllTotalWorkloadOfAllUser(
    month: number,
    year: number,
  ): Promise<
    ServiceResponse<
      {
        userId: string;
        totalWorkload: number;
      }[],
      ServiceFailure<TimeSheetFailure>
    >
  > {
    const timeSheets = await this.prisma.timeSheet.findMany({
      where: {
        overtime: false,
        month: month,
        year: year,
      },
    });

    const users = await this.prisma.user.findMany({});

    if (!timeSheets) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: TimeSheetFailure.TIME_SHEET_NOT_FOUND,
        },
      };
    }

    const totalWorkloadOfAllUser: {
      userId: string;
      totalWorkload: number;
    }[] = [];

    for (const user of users) {
      const totalWorkload = timeSheets.reduce((acc, curr) => {
        if (curr.userId === user.id) {
          return acc + curr.hoursWorked;
        }
        return acc;
      }, 0);

      totalWorkloadOfAllUser.push({
        userId: user.id,
        totalWorkload: totalWorkload / 8,
      });
    }

    return {
      status: ServiceResponseStatus.Success,
      result: totalWorkloadOfAllUser,
    };
  }

  public async getAllTotalOvertimeOfAllUser(
    month: number,
    year: number,
  ): Promise<
    ServiceResponse<
      {
        userId: string;
        totalOvertime: number;
      }[],
      ServiceFailure<TimeSheetFailure>
    >
  > {
    const timeSheets = await this.prisma.timeSheet.findMany({
      where: {
        overtime: true,
        month: month,
        year: year,
      },
    });

    const users = await this.prisma.user.findMany({});

    if (!timeSheets) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: TimeSheetFailure.TIME_SHEET_NOT_FOUND,
        },
      };
    }

    const totalOvertimeOfAllUser: {
      userId: string;
      totalOvertime: number;
    }[] = [];

    for (const user of users) {
      const totalOvertime = timeSheets.reduce((acc, curr) => {
        if (curr.userId === user.id) {
          return acc + curr.hoursWorked;
        }
        return acc;
      }, 0);

      totalOvertimeOfAllUser.push({
        userId: user.id,
        totalOvertime: totalOvertime / 8,
      });
    }

    return {
      status: ServiceResponseStatus.Success,
      result: totalOvertimeOfAllUser,
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

  public async getAllOverTimeInMonth(
    month: number,
    year: number,
  ): Promise<ServiceResponse<TimeSheet[], ServiceFailure<TimeSheetFailure>>> {
    const timeSheets = await this.prisma.timeSheet.findMany({
      where: {
        month: month,
        year: year,
        overtime: true,
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
