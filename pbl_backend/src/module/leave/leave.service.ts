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

    if (dto.startDate === dto.endDate) {
      const existedLeaveRequestByDate = await this.prisma.leave.findMany({
        where: {
          user: {
            id: dto.userId,
          },
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
        },
        select: {
          id: true,
          session: true,
          leaveDays: true,
        },
      });

      if (dto.session === LeaveSession.FullDay) {
        return {
          valid: false,
          failure: {
            reason: LeaveFailure.LEAVE_REQUEST_OVERLAP,
          },
        };
      }

      for (const leave of existedLeaveRequestByDate) {
        if (leave.id === requestId) continue;
        if (leave.session === dto.session) {
          return {
            valid: false,
            failure: {
              reason: LeaveFailure.LEAVE_REQUEST_OVERLAP,
            },
          };
        }
      }
    } else {
      const { result: allLeaveRequest } = await this.getLeaveRequestByUserId(
        dto.userId,
      );

      const allDatesRequested = [];

      for (const leave of allLeaveRequest) {
        if (leave.id === requestId) continue;
        const dates = dateTimeUtils.getDatesWithCondition(
          leave.startDate,
          leave.endDate,
        );
        allDatesRequested.push(...dates);
      }

      if (
        allDatesRequested.includes(dto.startDate) ||
        allDatesRequested.includes(dto.endDate)
      ) {
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
        status: 'Pending',
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
  ): Promise<ServiceResponse<number, ServiceFailure<LeaveFailure>>> {
    const allLeaveRequest = await this.prisma.leave.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    });

    const balance = (
      await this.prisma.leaveType.findFirst({
        where: {
          name: 'Annual',
        },
      })
    ).balance;

    const remainingLeaveDays =
      balance -
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
        status: 'Cancelled',
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
}
