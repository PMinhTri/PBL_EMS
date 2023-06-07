import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LeaveDto } from './leave.dto';
import {
  ServiceFailure,
  ServiceResponse,
  ServiceResponseStatus,
} from 'src/serviceResponse';
import { LeaveFailure } from 'src/enumTypes/failure.enum';
import { dateTimeUtils } from 'src/utils/datetime';
import { Session } from 'src/constant/leaveSession.constant';
import { LeaveSession } from 'src/enumTypes/leaveSession.enum';
import { Leave, LeaveType } from '@prisma/client';
import { LeaveStatus } from 'src/enumTypes/leave.enum';
import * as dayjs from 'dayjs';
import { intersection } from 'lodash';

@Injectable()
export class LeaveService {
  constructor(private prisma: PrismaService) {}

  private async checkValidLeaveRequest(
    dto: LeaveDto,
    requestId?: string,
  ): Promise<{
    valid: boolean;
    failure?: ServiceFailure<LeaveFailure>;
  }> {
    const validLeaveDays = dateTimeUtils.getDatesWithCondition(
      dto.startDate,
      dto.endDate,
    );

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
      const existedLeaveRequestByDate = await this.prisma.leave.findMany({
        where: {
          user: {
            id: dto.userId,
          },
          status: LeaveStatus.Pending,
        },
        select: {
          id: true,
          session: true,
          leaveDays: true,
          startDate: true,
          endDate: true,
        },
      });

      for (const leave of existedLeaveRequestByDate.filter((leaveRequest) =>
        dayjs(leaveRequest.startDate).isSame(dayjs(leaveRequest.endDate)),
      )) {
        if (leave.id === requestId) continue;
        if (
          (dayjs(dto.startDate).isSame(leave.endDate) ||
            dayjs(dto.startDate).isSame(leave.startDate)) &&
          Session[dto.session] + Session[leave.session] > 1
        ) {
          return {
            valid: false,
            failure: {
              reason: LeaveFailure.LEAVE_REQUEST_OVERLAP,
            },
          };
        }

        for (const leave of existedLeaveRequestByDate.filter((leaveRequest) =>
          dayjs(leaveRequest.startDate).isBefore(dayjs(leaveRequest.endDate)),
        )) {
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
      }
    } else {
      const allLeaveRequest = await this.prisma.leave.findMany({
        where: {
          user: {
            id: dto.userId,
          },
          status: LeaveStatus.Pending,
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
    dto: LeaveDto,
  ): Promise<ServiceResponse<Leave, ServiceFailure<LeaveFailure>>> {
    const { valid, failure } = await this.checkValidLeaveRequest(dto);

    if (!valid) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: failure,
      };
    }

    const { result: remainingLeaveDays } = await this.getRemainingBalance(
      dto.userId,
      dto.leaveTypeId,
    );

    if (remainingLeaveDays < dto.leaveDays) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: LeaveFailure.LEAVE_BALANCE_EXCEEDED,
        },
      };
    }

    const leaveRequest = await this.prisma.leave.create({
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
    dto: LeaveDto,
  ): Promise<ServiceResponse<Leave, ServiceFailure<LeaveFailure>>> {
    const existedLeaveRequest = await this.prisma.leave.findUnique({
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
    );

    if (remainingLeaveDays + existedLeaveRequest.leaveDays < dto.leaveDays) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: LeaveFailure.LEAVE_BALANCE_EXCEEDED,
        },
      };
    }

    const leaveRequest = await this.prisma.leave.update({
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
        status: 'Pending',
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
  ): Promise<ServiceResponse<number, ServiceFailure<LeaveFailure>>> {
    const allLeaveRequest = await this.prisma.leave.findMany({
      where: {
        user: {
          id: userId,
          isDeleted: false,
          status: LeaveStatus.Cancelled,
        },
      },
    });

    const balance = await this.prisma.leaveType.findFirst({
      where: {
        id: leaveTypeId,
      },
    });

    if (!balance) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: LeaveFailure.LEAVE_NOT_FOUND,
        },
      };
    }

    const remainingLeaveDays =
      balance.balance -
      allLeaveRequest.reduce((acc, curr) => {
        return acc + curr.leaveDays;
      }, 0);

    return {
      result: remainingLeaveDays,
      status: ServiceResponseStatus.Success,
    };
  }

  public async cancelLeaveRequest(
    id: string,
    status: string,
  ): Promise<ServiceResponse<Leave, ServiceFailure<LeaveFailure>>> {
    const existedLeaveRequest = await this.prisma.leave.findUnique({
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

    const leaveRequest = await this.prisma.leave.update({
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

  public async removeLeaveRequest(
    id: string,
  ): Promise<ServiceResponse<Leave, ServiceFailure<LeaveFailure>>> {
    const existedLeaveRequest = await this.prisma.leave.findUnique({
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

    const leaveRequest = await this.prisma.leave.delete({
      where: {
        id: id,
      },
    });

    return {
      result: leaveRequest,
      status: ServiceResponseStatus.Success,
    };
  }

  public async getAllLeaveRequest(): Promise<Leave[]> {
    return this.prisma.leave.findMany();
  }

  public async getLeaveRequestByUserId(
    userId: string,
  ): Promise<ServiceResponse<Leave[], ServiceFailure<LeaveFailure>>> {
    const existedLeaveRequest = await this.prisma.leave.findMany({
      where: {
        user: {
          id: userId,
        },
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

  public async getLeaveRequestById(
    id: string,
  ): Promise<ServiceResponse<Leave, ServiceFailure<LeaveFailure>>> {
    const existedLeaveRequest = await this.prisma.leave.findUnique({
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
    return this.prisma.leave.deleteMany().then(() => {
      return {
        status: ServiceResponseStatus.Success,
        result: null,
      };
    });
  }
}
