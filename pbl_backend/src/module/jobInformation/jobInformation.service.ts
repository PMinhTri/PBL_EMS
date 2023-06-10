import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ServiceFailure,
  ServiceResponse,
  ServiceResponseStatus,
} from 'src/serviceResponse';
import { JobInformationDto } from './jobInformation.dto';
import { JobInformationFailure } from 'src/enumTypes/failure.enum';
import { JobInformation } from '@prisma/client';
import * as dayjs from 'dayjs';

@Injectable()
export class JobInformationService {
  constructor(private prisma: PrismaService) {}

  public async createJobInformation(
    dto: Partial<JobInformationDto>,
  ): Promise<
    ServiceResponse<JobInformation, ServiceFailure<JobInformationFailure>>
  > {
    const existingJobInformation = await this.prisma.jobInformation.findFirst({
      where: {
        userId: dto.userId,
      },
    });

    if (existingJobInformation) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: JobInformationFailure.JOB_INFORMATION_ALREADY_EXISTS,
        },
      };
    }

    const jobInformation = await this.prisma.jobInformation.create({
      data: {
        user: {
          connect: {
            id: dto.userId,
          },
        },
        joinDate: dayjs(dto.joinDate).toDate(),
        employeeStatus: dto.employeeStatus,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: jobInformation,
    };
  }

  public async getAllJobInformation(): Promise<
    ServiceResponse<JobInformation[], ServiceFailure<JobInformationFailure>>
  > {
    const jobInformation = await this.prisma.jobInformation.findMany({
      include: {
        contractType: true,
        jobTitle: true,
        department: true,
        workingSkill: true,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: jobInformation,
    };
  }

  public async getJobInformationById(
    id: string,
  ): Promise<
    ServiceResponse<JobInformation, ServiceFailure<JobInformationFailure>>
  > {
    const jobInformation = await this.prisma.jobInformation.findUnique({
      where: {
        id,
      },
    });

    if (!jobInformation) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: JobInformationFailure.JOB_INFORMATION_NOT_FOUND,
        },
      };
    }

    return {
      status: ServiceResponseStatus.Success,
      result: jobInformation,
    };
  }

  public async getJobInformationByUserId(
    userId: string,
  ): Promise<
    ServiceResponse<JobInformation, ServiceFailure<JobInformationFailure>>
  > {
    const jobInformation = await this.prisma.jobInformation.findFirst({
      where: {
        userId: userId,
      },
      include: {
        contractType: true,
        department: true,
        jobTitle: true,
        workingSkill: true,
      },
    });

    if (!jobInformation) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: JobInformationFailure.JOB_INFORMATION_NOT_FOUND,
        },
      };
    }

    return {
      status: ServiceResponseStatus.Success,
      result: jobInformation,
    };
  }

  public async updateJobInformation(
    id: string,
    dto: Omit<JobInformationDto, 'userId'>,
  ): Promise<
    ServiceResponse<JobInformation, ServiceFailure<JobInformationFailure>>
  > {
    const existingJobInformation = await this.prisma.jobInformation.findUnique({
      where: {
        id,
      },
      include: {
        workingSkill: true,
      },
    });

    if (!existingJobInformation) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: JobInformationFailure.JOB_INFORMATION_NOT_FOUND,
        },
      };
    }

    const jobInformation = await this.prisma.jobInformation.update({
      where: {
        id,
      },
      data: {
        joinDate: new Date(dto.joinDate),
        employeeStatus: dto.employeeStatus,
        jobHistory: dto.jobHistory,
        jobTitle: {
          connect: {
            id: dto.jobTitleId,
          },
        },
        department: {
          connect: {
            id: dto.departmentId,
          },
        },
        workingSkill: {
          disconnect: existingJobInformation.workingSkill
            ?.filter((skill) => !dto.workingSkill?.includes(skill.id))
            .map((skill) => ({ id: skill.id })),

          connect: dto.workingSkill?.map((skill) => ({
            id: skill,
          })),
        },
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: jobInformation,
    };
  }

  public async updateContract(
    id: string,
    dto: Pick<
      JobInformationDto,
      'contractTypeId' | 'contractStartDate' | 'contractEndDate'
    >,
  ): Promise<
    ServiceResponse<JobInformation, ServiceFailure<JobInformationFailure>>
  > {
    const existingJobInformation = await this.prisma.jobInformation.findUnique({
      where: {
        id,
      },
    });

    if (!existingJobInformation) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: JobInformationFailure.JOB_INFORMATION_NOT_FOUND,
        },
      };
    }

    const jobInformation = await this.prisma.jobInformation.update({
      where: {
        id,
      },
      data: {
        contractType: {
          connect: {
            id: dto.contractTypeId,
          },
        },
        contractStartDate: new Date(dto.contractStartDate),
        contractEndDate: new Date(dto.contractEndDate),
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: jobInformation,
    };
  }
}
