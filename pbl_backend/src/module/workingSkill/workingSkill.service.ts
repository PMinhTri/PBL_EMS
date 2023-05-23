import { Injectable } from '@nestjs/common';
import { WorkingSkill } from '@prisma/client';
import { WorkingSkillFailure } from 'src/enumTypes/failure.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ServiceFailure,
  ServiceResponse,
  ServiceResponseStatus,
} from 'src/serviceResponse';

@Injectable()
export class WorkingSkillService {
  constructor(private prisma: PrismaService) {}

  public async createWorkingSkill(
    name: string,
  ): Promise<
    ServiceResponse<WorkingSkill, ServiceFailure<WorkingSkillFailure>>
  > {
    const workingSkill = await this.prisma.workingSkill.create({
      data: {
        name,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: workingSkill,
    };
  }

  public async updateWorkingSkill(
    id: number,
    name: string,
  ): Promise<
    ServiceResponse<WorkingSkill, ServiceFailure<WorkingSkillFailure>>
  > {
    const existedData = await this.prisma.workingSkill.findUnique({
      where: {
        id,
      },
    });

    if (!existedData) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: WorkingSkillFailure.WORKING_SKILL_NOT_FOUND,
        },
      };
    }

    const updatedWorkingSkill = await this.prisma.workingSkill.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: updatedWorkingSkill,
    };
  }

  public async deleteWorkingSkill(
    id: number,
  ): Promise<
    ServiceResponse<WorkingSkill, ServiceFailure<WorkingSkillFailure>>
  > {
    const workingSkill = await this.prisma.workingSkill.findUnique({
      where: {
        id: id,
      },
    });

    if (!workingSkill) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: WorkingSkillFailure.WORKING_SKILL_NOT_FOUND,
        },
      };
    }

    await this.prisma.workingSkill.delete({
      where: {
        id: id,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
    };
  }

  public async getWorkingSkillByJobInformation(
    jobInformationId: number,
  ): Promise<
    ServiceResponse<WorkingSkill[], ServiceFailure<WorkingSkillFailure>>
  > {
    const workingSkill = await this.prisma.workingSkill.findMany({
      where: {
        jobInformationId: jobInformationId,
      },
    });

    if (!workingSkill.length) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: WorkingSkillFailure.WORKING_SKILL_NOT_FOUND,
        },
      };
    }

    return {
      status: ServiceResponseStatus.Success,
      result: workingSkill,
    };
  }
}
