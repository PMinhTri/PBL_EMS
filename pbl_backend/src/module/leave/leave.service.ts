import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LeaveDto } from './leave.dto';
import {
  ServiceFailure,
  ServiceResponse,
  ServiceResponseStatus,
} from 'src/serviceResponse';
import { LeaveFailure } from 'src/enumTypes/failure.enum';
import { LeaveTypes, Leaves } from '@prisma/client';
import { dateTimeUtils } from 'src/utils/datetime';
import { Session } from 'src/constant/leaveSession.constant';
import { LeaveSession } from 'src/enumTypes/leaveSession.enum';

@Injectable()
export class LeaveService {
  constructor(private prisma: PrismaService) {}

  private async checkValidLeaveRequest(dto: LeaveDto): Promise<{
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
      const existedLeaveRequestByDate = await this.prisma.leaves.findMany({
        where: {
          user: {
            id: dto.userId,
          },
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
        },
        select: {
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
  ): Promise<ServiceResponse<Leaves, ServiceFailure<LeaveFailure>>> {
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

    const leaveRequest = await this.prisma.leaves.create({
      data: {
        user: {
          connect: {
            id: dto.userId,
          },
        },
        leaveType: dto.leaveType,
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
    id: number,
    dto: LeaveDto,
  ): Promise<ServiceResponse<Leaves, ServiceFailure<LeaveFailure>>> {
    const existedLeaveRequest = await this.prisma.leaves.findUnique({
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

    if (remainingLeaveDays + existedLeaveRequest.leaveDays < dto.leaveDays) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: LeaveFailure.LEAVE_BALANCE_EXCEEDED,
        },
      };
    }

    const leaveRequest = await this.prisma.leaves.update({
      where: {
        id: id,
      },
      data: {
        leaveType: dto.leaveType,
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
      const result = await this.prisma.leaveTypes.create({
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

  public async getAllLeaveTypes(): Promise<LeaveTypes[]> {
    return this.prisma.leaveTypes.findMany();
  }

  public async getRemainingBalance(
    userId: number,
  ): Promise<ServiceResponse<number, ServiceFailure<LeaveFailure>>> {
    const allLeaveRequest = await this.prisma.leaves.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (allLeaveRequest.length === 0 || allLeaveRequest === null) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: LeaveFailure.LEAVE_TYPE_NOT_FOUND,
        },
      };
    }

    const balance = (
      await this.prisma.leaveTypes.findFirst({
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
    id: number,
  ): Promise<ServiceResponse<Leaves, ServiceFailure<LeaveFailure>>> {
    const existedLeaveRequest = await this.prisma.leaves.findUnique({
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

    const leaveRequest = await this.prisma.leaves.update({
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
    id: number,
  ): Promise<ServiceResponse<Leaves, ServiceFailure<LeaveFailure>>> {
    const existedLeaveRequest = await this.prisma.leaves.findUnique({
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

    const leaveRequest = await this.prisma.leaves.delete({
      where: {
        id: id,
      },
    });

    return {
      result: leaveRequest,
      status: ServiceResponseStatus.Success,
    };
  }

  public async getAllLeaveRequest(): Promise<Leaves[]> {
    return this.prisma.leaves.findMany();
  }

  public async getLeaveRequestByUserId(
    userId: number,
  ): Promise<ServiceResponse<Leaves[], ServiceFailure<LeaveFailure>>> {
    const existedLeaveRequest = await this.prisma.leaves.findMany({
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
    id: number,
  ): Promise<ServiceResponse<Leaves, ServiceFailure<LeaveFailure>>> {
    const existedLeaveRequest = await this.prisma.leaves.findUnique({
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
