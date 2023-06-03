import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJobTitleDto } from './jobTitle.dto';
import {
  ServiceFailure,
  ServiceResponse,
  ServiceResponseStatus,
} from 'src/serviceResponse';
import { JobTitle } from '@prisma/client';
import { JobTitleFailure } from 'src/enumTypes/failure.enum';

@Injectable()
export class JobTitleService {
  constructor(private prisma: PrismaService) {}

  public async getAllJobTitles(): Promise<
    ServiceResponse<JobTitle[], ServiceFailure<JobTitleFailure>>
  > {
    const jobTitle = await this.prisma.jobTitle.findMany();

    return {
      status: ServiceResponseStatus.Success,
      result: jobTitle,
    };
  }

  public async getJobTitleById(
    id: string,
  ): Promise<ServiceResponse<JobTitle, ServiceFailure<JobTitleFailure>>> {
    const jobTitle = await this.prisma.jobTitle.findUnique({
      where: {
        id: id,
      },
    });

    if (!jobTitle) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: JobTitleFailure.JOB_TITLE_NOT_FOUND,
        },
      };
    }

    return {
      status: ServiceResponseStatus.Success,
      result: jobTitle,
    };
  }

  public async createJobTitle(
    dto: CreateJobTitleDto,
  ): Promise<
    ServiceResponse<
      { jobTitle: CreateJobTitleDto },
      ServiceFailure<JobTitleFailure>
    >
  > {
    const existingJobTitle = await this.prisma.jobTitle.findFirst({
      where: {
        name: dto.name,
      },
    });

    if (existingJobTitle) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: JobTitleFailure.JOB_TITLE_ALREADY_EXISTS,
        },
      };
    }

    const jobTitle = await this.prisma.jobTitle.create({
      data: {
        name: dto.name,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: { jobTitle },
    };
  }

  public async deleteJobTitle(
    id: string,
  ): Promise<ServiceResponse<JobTitle, ServiceFailure<JobTitleFailure>>> {
    const jobTitle = await this.prisma.jobTitle.findUnique({
      where: {
        id: id,
      },
    });

    if (!jobTitle) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: JobTitleFailure.JOB_TITLE_NOT_FOUND,
        },
      };
    }

    await this.prisma.jobTitle.delete({
      where: {
        id: id,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: jobTitle,
    };
  }
}
