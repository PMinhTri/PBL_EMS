import { Injectable } from '@nestjs/common';
import { WorkingSkill } from '@prisma/client';
import { WorkingSkillFailure } from 'src/enumTypes/failure.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ServiceFailure,
  ServiceResponse,
  ServiceResponseStatus,
} from 'src/serviceResponse';
import { WorkingSkillDto } from './workingSkill.dto';

@Injectable()
export class WorkingSkillService {
  constructor(private prisma: PrismaService) {}

  public async createWorkingSkill(
    dto: Partial<WorkingSkillDto>,
  ): Promise<
    ServiceResponse<WorkingSkill, ServiceFailure<WorkingSkillFailure>>
  > {
    const existingWorkingSkill = await this.prisma.workingSkill.findFirst({
      where: {
        name: dto.name,
      },
    });

    if (existingWorkingSkill) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: WorkingSkillFailure.WORKING_SKILL_ALREADY_EXISTS,
        },
      };
    }

    const newWorkingSkill = await this.prisma.workingSkill.create({
      data: {
        name: dto.name,
        description: dto.description,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: newWorkingSkill,
    };
  }

  public async getAllWorkingSkill(): Promise<
    ServiceResponse<WorkingSkill[], ServiceFailure<WorkingSkillFailure>>
  > {
    const workingSkill = await this.prisma.workingSkill.findMany();

    return {
      status: ServiceResponseStatus.Success,
      result: workingSkill,
    };
  }

  public async getWorkingSkillById(
    id: string,
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

    return {
      status: ServiceResponseStatus.Success,
      result: workingSkill,
    };
  }

  public async deleteWorkingSkill(
    id: string,
  ): Promise<ServiceResponse<null, ServiceFailure<WorkingSkillFailure>>> {
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

    await this.prisma.$transaction(async () => {
      // Find jobInformation records that reference the workingSkill
      const jobInformation = await this.prisma.jobInformation.findMany({
        where: {
          workingSkill: {
            some: {
              id: id,
            },
          },
        },
      });

      // Update each jobInformation record to disconnect the workingSkill
      await Promise.all(
        jobInformation.map((jobInformation) =>
          this.prisma.jobInformation.update({
            where: {
              id: jobInformation.id,
            },
            data: {
              workingSkill: {
                disconnect: {
                  id: id,
                },
              },
            },
          }),
        ),
      );

      await this.prisma.workingSkill.delete({
        where: {
          id: id,
        },
      });
    });

    return {
      status: ServiceResponseStatus.Success,
      result: null,
    };
  }
}
