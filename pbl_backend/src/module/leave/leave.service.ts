import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LeaveRequestDto } from './leave.dto';
import {
  ServiceFailure,
  ServiceResponse,
  ServiceResponseStatus,
} from 'src/serviceResponse';
import { LeaveFailure } from 'src/enumTypes/failure.enum';
import { dateTimeUtils, isWeekend } from 'src/utils/datetime';
import { Session } from 'src/constant/leaveSession.constant';
import { LeaveRequest, LeaveType } from '@prisma/client';
import { LeaveStatus } from 'src/enumTypes/leave.enum';
import * as dayjs from 'dayjs';
import { intersection, isEqual } from 'lodash';
import { LeaveBalance } from './leave.type';

@Injectable()
export class LeaveService {
  constructor(private prisma: PrismaService) {}

  private async checkValidLeaveRequest(
    dto: LeaveRequestDto,
    requestId?: string,
  ): Promise<{
    valid: boolean;
    failure?: ServiceFailure<LeaveFailure>;
  }> {
    const validLeaveDays = dateTimeUtils.getDatesWithCondition(
      dto.startDate,
      dto.endDate,
    );

    if (
      isWeekend(new Date(dto.startDate)) ||
      isWeekend(new Date(dto.endDate))
    ) {
      return {
        valid: false,
        failure: {
          reason: LeaveFailure.LEAVE_REQUEST_ON_WEEKEND,
        },
      };
    }

    if (Session[dto.session] < 1 && Session[dto.session] !== dto.leaveDays) {
      return {
        valid: false,
        failure: {
          reason: LeaveFailure.INVALID_LEAVE_REQUEST,
        },
      };
    } else {
      if (validLeaveDays.length !== dto.leaveDays) {
        return {
          valid: false,
          failure: {
            reason: LeaveFailure.INVALID_LEAVE_REQUEST,
          },
        };
      }
    }

    if (dayjs(dto.startDate).isSame(dto.endDate)) {
      const existedLeaveRequestByDate = await this.prisma.leaveRequest.findMany(
        {
          where: {
            user: {
              id: dto.userId,
            },
            status: {
              in: [LeaveStatus.Pending, LeaveStatus.Approved],
            },
          },
          select: {
            id: true,
            session: true,
            leaveDays: true,
            startDate: true,
            endDate: true,
          },
        },
      );

      const existedInOneDay = existedLeaveRequestByDate.filter((leaveRequest) =>
        dayjs(leaveRequest.startDate).isSame(dayjs(leaveRequest.endDate)),
      );

      for (const leave of existedInOneDay) {
        if (leave.id === requestId) continue;

        if (
          isEqual(
            dateTimeUtils.getDatesWithCondition(dto.startDate, dto.endDate),
            dateTimeUtils.getDatesWithCondition(leave.startDate, leave.endDate),
          )
        ) {
          if (
            dto.session === leave.session ||
            Session[dto.session] + Session[leave.session] > 1
          ) {
            return {
              valid: false,
              failure: {
                reason: LeaveFailure.LEAVE_REQUEST_OVERLAP,
              },
            };
          }
        }
      }

      const existedInDays = existedLeaveRequestByDate.filter((leaveRequest) =>
        dayjs(leaveRequest.startDate).isBefore(dayjs(leaveRequest.endDate)),
      );

      for (const leave of existedInDays) {
        if (leave.id === requestId) continue;

        const overlapped = intersection(
          dateTimeUtils.getDatesWithCondition(leave.startDate, leave.endDate),
          dateTimeUtils.getDatesWithCondition(dto.startDate, dto.endDate),
        );

        if (overlapped.length) {
          return {
            valid: false,
            failure: {
              reason: LeaveFailure.LEAVE_REQUEST_OVERLAP,
            },
          };
        }
      }
    } else {
      const allLeaveRequest = await this.prisma.leaveRequest.findMany({
        where: {
          user: {
            id: dto.userId,
          },
          status: {
            in: [LeaveStatus.Pending, LeaveStatus.Approved],
          },
        },
      });

      const allDatesRequested = [];

      for (const leave of allLeaveRequest) {
        if (leave.id === requestId) continue;
        const dates = dateTimeUtils.getDatesWithCondition(
          leave.startDate,
          leave.endDate,
        );
        allDatesRequested.push(...dates);
      }

      const overlapped = intersection(
        allDatesRequested,
        dateTimeUtils.getDatesWithCondition(dto.startDate, dto.endDate),
      );

      if (overlapped.length) {
        return {
          valid: false,
          failure: {
            reason: LeaveFailure.LEAVE_REQUEST_OVERLAP,
          },
        };
      }
    }

    return {
      valid: true,
    };
  }

  public async createLeaveRequest(
    dto: LeaveRequestDto,
  ): Promise<ServiceResponse<LeaveRequest, ServiceFailure<LeaveFailure>>> {
    const { valid, failure } = await this.checkValidLeaveRequest(dto);

    const year = dayjs(dto.startDate).year();

    if (!valid) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: failure,
      };
    }

    const { result: remainingLeaveDays } = await this.getRemainingBalance(
      dto.userId,
      dto.leaveTypeId,
      year,
    );

    if (remainingLeaveDays < dto.leaveDays) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: LeaveFailure.LEAVE_BALANCE_EXCEEDED,
        },
      };
    }

    const leaveRequest = await this.prisma.leaveRequest.create({
      data: {
        user: {
          connect: {
            id: dto.userId,
          },
        },
        leaveType: {
          connect: {
            id: dto.leaveTypeId,
          },
        },
        leaveDays: dto.leaveDays,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        session: dto.session,
        reason: dto.reason,
        status: LeaveStatus.Pending,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: leaveRequest,
    };
  }

  public async updateLeaveRequest(
    id: string,
    dto: LeaveRequestDto,
  ): Promise<ServiceResponse<LeaveRequest, ServiceFailure<LeaveFailure>>> {
    const existedLeaveRequest = await this.prisma.leaveRequest.findUnique({
      where: {
        id: id,
      },
    });

    const year = dayjs(dto.startDate).year();

    if (!existedLeaveRequest) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: LeaveFailure.LEAVE_NOT_FOUND,
        },
      };
    }

    const { valid, failure } = await this.checkValidLeaveRequest(
      dto,
      existedLeaveRequest.id,
    );

    if (!valid) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: failure,
      };
    }

    const { result: remainingLeaveDays } = await this.getRemainingBalance(
      dto.userId,
      dto.leaveTypeId,
      year,
    );

    if (remainingLeaveDays + existedLeaveRequest.leaveDays < dto.leaveDays) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: LeaveFailure.LEAVE_BALANCE_EXCEEDED,
        },
      };
    }

    const leaveRequest = await this.prisma.leaveRequest.update({
      where: {
        id: id,
      },
      data: {
        leaveType: {
          connect: {
            id: dto.leaveTypeId,
          },
        },
        leaveDays: dto.leaveDays,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        session: dto.session,
        reason: dto.reason,
        status: LeaveStatus.Pending,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: leaveRequest,
    };
  }

  public async createLeaveType(
    leaveType: string,
    balance: number,
  ): Promise<ServiceResponse<string, ServiceFailure<LeaveFailure>>> {
    try {
      const result = await this.prisma.leaveType.create({
        data: {
          name: leaveType,
          balance: balance,
        },
      });
      return {
        result: result.name,
        status: ServiceResponseStatus.Success,
      };
    } catch (error) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: LeaveFailure.LEAVE_ALREADY_EXISTS,
        },
      };
    }
  }

  public async getAllLeaveTypes(): Promise<LeaveType[]> {
    return this.prisma.leaveType.findMany();
  }

  public async getRemainingBalance(
    userId: string,
    leaveTypeId: string,
    year: number,
  ): Promise<ServiceResponse<number, ServiceFailure<LeaveFailure>>> {
    const firstDate = new Date(year, 0, 1);
    const lastDate = new Date(year, 11, 31);

    const allLeaveRequest = await this.prisma.leaveRequest.findMany({
      where: {
        user: {
          id: userId,
        },
        leaveType: {
          id: leaveTypeId,
        },
        status: {
          in: [LeaveStatus.Approved],
        },
        AND: [
          {
            startDate: {
              gte: firstDate,
            },
          },
          {
            endDate: {
              lte: lastDate,
            },
          },
        ],
      },
    });

    const leaveType = await this.prisma.leaveType.findUnique({
      where: {
        id: leaveTypeId,
      },
    });

    if (!leaveType) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: LeaveFailure.LEAVE_NOT_FOUND,
        },
      };
    }

    const remainingLeaveDays =
      leaveType.balance -
      allLeaveRequest.reduce((acc, curr) => {
        return acc + curr.leaveDays;
      }, 0);

    return {
      result: remainingLeaveDays,
      status: ServiceResponseStatus.Success,
    };
  }

  public async getAllRemainingBalance(
    year: number,
  ): Promise<ServiceResponse<LeaveBalance[], ServiceFailure<LeaveFailure>>> {
    const firstDate = new Date(year, 0, 1);
    const lastDate = new Date(year, 11, 31);

    const users = await this.prisma.user.findMany();

    const allLeaveRequest = await this.prisma.leaveRequest.findMany({
      where: {
        status: LeaveStatus.Approved,
        AND: [
          {
            startDate: {
              gte: firstDate,
            },
          },
          {
            endDate: {
              lte: lastDate,
            },
          },
        ],
      },
    });

    const leaveTypes = await this.prisma.leaveType.findMany();

    const remainingBalance = users.map((user) => {
      const balance = leaveTypes.map((leaveType) => {
        const remainingLeaveDays =
          leaveType.balance -
          allLeaveRequest.reduce((acc, curr) => {
            if (curr.userId === user.id && curr.leaveTypeId === leaveType.id) {
              return acc + curr.leaveDays;
            }
            return acc;
          }, 0);

        return {
          leaveTypeId: leaveType.id,
          leaveTypeName: leaveType.name,
          remainingLeaveDays: remainingLeaveDays,
        };
      });

      return {
        userId: user.id,
        balance: balance,
      };
    });

    return {
      result: remainingBalance,
      status: ServiceResponseStatus.Success,
    };
  }

  public async approveLeaveRequest(
    id: string,
    status: string,
  ): Promise<ServiceResponse<LeaveRequest, ServiceFailure<LeaveFailure>>> {
    const existedLeaveRequest = await this.prisma.leaveRequest.findUnique({
      where: {
        id: id,
      },
    });

    if (!existedLeaveRequest) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: LeaveFailure.LEAVE_NOT_FOUND,
        },
      };
    }

    const leaveRequest = await this.prisma.leaveRequest.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });

    return {
      result: leaveRequest,
      status: ServiceResponseStatus.Success,
    };
  }

  public async cancelLeaveRequest(
    id: string,
    status: string,
  ): Promise<ServiceResponse<LeaveRequest, ServiceFailure<LeaveFailure>>> {
    const existedLeaveRequest = await this.prisma.leaveRequest.findUnique({
      where: {
        id: id,
      },
    });

    if (!existedLeaveRequest) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: LeaveFailure.LEAVE_NOT_FOUND,
        },
      };
    }

    const leaveRequest = await this.prisma.leaveRequest.update({
      where: {
        id: id,
      },
      data: {
        status: status,
        isDeleted: true,
      },
    });

    return {
      result: leaveRequest,
      status: ServiceResponseStatus.Success,
    };
  }

  public async rejectLeaveRequest(id: string, status: string) {
    const existedLeaveRequest = await this.prisma.leaveRequest.findUnique({
      where: {
        id: id,
      },
    });

    if (!existedLeaveRequest) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: LeaveFailure.LEAVE_NOT_FOUND,
        },
      };
    }

    const leaveRequest = await this.prisma.leaveRequest.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });

    return {
      result: leaveRequest,
      status: ServiceResponseStatus.Success,
    };
  }

  public async removeLeaveRequest(
    id: string,
  ): Promise<ServiceResponse<LeaveRequest, ServiceFailure<LeaveFailure>>> {
    const existedLeaveRequest = await this.prisma.leaveRequest.findUnique({
      where: {
        id: id,
      },
    });

    if (!existedLeaveRequest) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: LeaveFailure.LEAVE_NOT_FOUND,
        },
      };
    }

    const leaveRequest = await this.prisma.leaveRequest.delete({
      where: {
        id: id,
      },
    });

    return {
      result: leaveRequest,
      status: ServiceResponseStatus.Success,
    };
  }

  public async getAllLeaveRequest(
    year: number,
    month?: number,
  ): Promise<LeaveRequest[]> {
    const firstDate = month
      ? new Date(year, month - 1, 1)
      : new Date(year, 0, 1);
    const lastDate = month ? new Date(year, month, 0) : new Date(year, 11, 31);

    return this.prisma.leaveRequest.findMany({
      where: {
        AND: [
          {
            startDate: {
              gte: firstDate,
            },
          },
          {
            endDate: {
              lte: lastDate,
            },
          },
        ],
      },
      include: {
        leaveType: true,
      },
    });
  }

  public async getLeaveRequestByUserId(
    userId: string,
  ): Promise<ServiceResponse<LeaveRequest[], ServiceFailure<LeaveFailure>>> {
    const existedLeaveRequest = await this.prisma.leaveRequest.findMany({
      where: {
        user: {
          id: userId,
        },
      },
      include: {
        leaveType: true,
      },
    });

    if (!existedLeaveRequest) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: LeaveFailure.LEAVE_NOT_FOUND,
        },
      };
    }

    return {
      result: existedLeaveRequest,
      status: ServiceResponseStatus.Success,
    };
  }

  public async getLeaveTypeByLeaveRequestId(
    leaveRequestId: string,
  ): Promise<ServiceResponse<LeaveType, ServiceFailure<LeaveFailure>>> {
    const existedLeaveRequest = await this.prisma.leaveRequest.findUnique({
      where: {
        id: leaveRequestId,
      },

      select: {
        leaveType: true,
      },
    });

    if (!existedLeaveRequest) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: LeaveFailure.LEAVE_NOT_FOUND,
        },
      };
    }

    return {
      result: existedLeaveRequest.leaveType,
      status: ServiceResponseStatus.Success,
    };
  }

  public async getLeaveRequestById(
    id: string,
  ): Promise<ServiceResponse<LeaveRequest, ServiceFailure<LeaveFailure>>> {
    const existedLeaveRequest = await this.prisma.leaveRequest.findUnique({
      where: {
        id: id,
      },
    });

    if (!existedLeaveRequest) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: LeaveFailure.LEAVE_NOT_FOUND,
        },
      };
    }

    return {
      result: existedLeaveRequest,
      status: ServiceResponseStatus.Success,
    };
  }

  public async editLeaveType(
    id: string,
    leaveType: string,
    balance: number,
  ): Promise<ServiceResponse<string, ServiceFailure<LeaveFailure>>> {
    try {
      const result = await this.prisma.leaveType.update({
        where: {
          id: id,
        },
        data: {
          name: leaveType,
          balance: Number(balance),
        },
      });
      return {
        result: result.name,
        status: ServiceResponseStatus.Success,
      };
    } catch (error) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: LeaveFailure.LEAVE_ALREADY_EXISTS,
        },
      };
    }
  }

  public async deleteAllLeaveRequests(): Promise<
    ServiceResponse<null, ServiceFailure<LeaveFailure>>
  > {
    return this.prisma.leaveRequest.deleteMany().then(() => {
      return {
        status: ServiceResponseStatus.Success,
        result: null,
      };
    });
  }
}
