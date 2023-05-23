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

@Injectable()
export class LeaveService {
  constructor(private prisma: PrismaService) {}

  public async createLeave(
    dto: LeaveDto,
  ): Promise<ServiceResponse<Leaves, ServiceFailure<LeaveFailure>>> {
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
}
