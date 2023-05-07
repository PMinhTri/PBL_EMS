import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { RoleFailure } from 'src/enumTypes/failure.enum';
import { RoleEnum } from 'src/enumTypes/role.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ServiceFailure,
  ServiceResponse,
  ServiceResponseStatus,
} from 'src/serviceResponse';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  public async addRole(
    role: RoleEnum,
  ): Promise<ServiceResponse<Role, ServiceFailure<RoleFailure>>> {
    const existedRoles = await this.prisma.role.findMany({});

    existedRoles.forEach((existedRole) => {
      if (existedRole.name === role) {
        return {
          status: ServiceResponseStatus.Failed,
          failure: {
            reason: RoleFailure.ROLE_ALREADY_EXISTS,
          },
        };
      }
    });

    const newRole = await this.prisma.role.create({
      data: {
        name: role,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: newRole,
    };
  }

  public async getRoles(): Promise<Role[]> {
    const roles = await this.prisma.role.findMany({});

    return roles;
  }

  public async getById(
    id: number,
  ): Promise<ServiceResponse<Role, ServiceFailure<RoleFailure>>> {
    const role = await this.prisma.role.findUnique({
      where: {
        id: id,
      },
    });

    if (!role) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: RoleFailure.ROLE_NOT_FOUND,
        },
      };
    }

    return {
      status: ServiceResponseStatus.Success,
      result: role,
    };
  }
}
