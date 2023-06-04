import { Injectable } from '@nestjs/common';
import { Department } from '@prisma/client';
import { DepartmentFailure } from 'src/enumTypes/failure.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ServiceFailure,
  ServiceResponse,
  ServiceResponseStatus,
} from 'src/serviceResponse';
import { DepartmentDto } from './department.dto';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  public async createDepartment(
    dto: DepartmentDto,
  ): Promise<ServiceResponse<Department, ServiceFailure<DepartmentFailure>>> {
    const existingDepartment = await this.prisma.department.findFirst({
      where: {
        name: dto.name,
      },
    });

    if (existingDepartment) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: DepartmentFailure.DEPARTMENT_ALREADY_EXISTS,
        },
      };
    }

    const department = await this.prisma.department.create({
      data: {
        name: dto.name,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: department,
    };
  }

  public async getAllDepartment(): Promise<
    ServiceResponse<Department[], ServiceFailure<DepartmentFailure>>
  > {
    const department = await this.prisma.department.findMany();

    return {
      status: ServiceResponseStatus.Success,
      result: department,
    };
  }

  public async getDepartmentById(
    id: string,
  ): Promise<ServiceResponse<Department, ServiceFailure<DepartmentFailure>>> {
    const department = await this.prisma.department.findUnique({
      where: {
        id: id,
      },
    });

    if (!department) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: DepartmentFailure.DEPARTMENT_NOT_FOUND,
        },
      };
    }

    return {
      status: ServiceResponseStatus.Success,
      result: department,
    };
  }

  public async updateDepartment(
    id: string,
    dto: Partial<DepartmentDto>,
  ): Promise<ServiceResponse<Department, ServiceFailure<DepartmentFailure>>> {
    const department = await this.prisma.department.findUnique({
      where: {
        id: id,
      },
    });

    if (!department) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: DepartmentFailure.DEPARTMENT_NOT_FOUND,
        },
      };
    }

    const updatedDepartment = await this.prisma.department.update({
      where: {
        id: id,
      },
      data: {
        name: dto.name,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: updatedDepartment,
    };
  }

  public async deleteDepartment(
    id: string,
  ): Promise<ServiceResponse<null, ServiceFailure<DepartmentFailure>>> {
    const department = await this.prisma.department.findUnique({
      where: {
        id: id,
      },
    });

    if (!department) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: DepartmentFailure.DEPARTMENT_NOT_FOUND,
        },
      };
    }

    await this.prisma.$transaction(async () => {
      // Find jobInformation records that reference the workingSkill
      const jobInformation = await this.prisma.jobInformation.findMany({
        where: {
          department: {
            id: id,
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
              department: {
                disconnect: true,
              },
            },
          }),
        ),
      );

      await this.prisma.department.delete({
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
