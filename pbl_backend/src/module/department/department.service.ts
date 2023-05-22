import { Injectable } from '@nestjs/common';
import { Department } from '@prisma/client';
import { DepartmentFailure } from 'src/enumTypes/failure.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ServiceFailure,
  ServiceResponse,
  ServiceResponseStatus,
} from 'src/serviceResponse';
import { departmentDto } from './department.dto';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  public async getDepartmentById(
    id: number,
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

  public async getAllDepartments(): Promise<
    ServiceResponse<Department[], ServiceFailure<DepartmentFailure>>
  > {
    const department = await this.prisma.department.findMany();

    return {
      status: ServiceResponseStatus.Success,
      result: department,
    };
  }

  public async createDepartment(
    dto: departmentDto,
  ): Promise<
    ServiceResponse<
      { department: Department },
      ServiceFailure<DepartmentFailure>
    >
  > {
    const department = await this.prisma.department.create({
      data: {
        name: dto.name,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: { department },
    };
  }
}
