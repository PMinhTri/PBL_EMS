import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEducationDto } from './education.dto';
import {
  ServiceFailure,
  ServiceResponse,
  ServiceResponseStatus,
} from 'src/serviceResponse';
import { Education } from '@prisma/client';
import { EducationFailure } from 'src/enumTypes/failure.enum';

@Injectable()
export class EducationService {
  constructor(private prisma: PrismaService) {}

  public async createEducation(
    dto: CreateEducationDto,
  ): Promise<ServiceResponse<Education, ServiceFailure<EducationFailure>>> {
    const existingGrade = await this.prisma.education.findFirst({
      where: {
        grade: dto.grade,
      },
    });

    if (existingGrade) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: EducationFailure.EDUCATION_ALREADY_EXISTS,
        },
      };
    }

    const education = await this.prisma.education.create({
      data: {
        grade: dto.grade,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: education,
    };
  }

  public async getEducation(): Promise<Education[]> {
    const education = await this.prisma.education.findMany();

    return education;
  }

  public async getEducationById(
    id: string,
  ): Promise<ServiceResponse<Education, ServiceFailure<EducationFailure>>> {
    const education = await this.prisma.education.findUnique({
      where: {
        id: id,
      },
    });

    if (!education) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: EducationFailure.EDUCATION_NOT_FOUND,
        },
      };
    }

    return {
      status: ServiceResponseStatus.Success,
      result: education,
    };
  }

  public async updateEducation(
    id: string,
    dto: CreateEducationDto,
  ): Promise<ServiceResponse<Education, ServiceFailure<EducationFailure>>> {
    const existingEducation = await this.prisma.education.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingEducation) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: EducationFailure.EDUCATION_NOT_FOUND,
        },
      };
    }

    const education = await this.prisma.education.update({
      where: {
        id: id,
      },
      data: {
        grade: dto.grade,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: education,
    };
  }

  public async deleteEducation(
    id: string,
  ): Promise<ServiceResponse<Education, ServiceFailure<EducationFailure>>> {
    const existingEducation = await this.prisma.education.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingEducation) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: EducationFailure.EDUCATION_NOT_FOUND,
        },
      };
    }

    await this.prisma.$transaction(async () => {
      const users = await this.prisma.user.findMany({
        where: {
          educationId: id,
        },
      });

      await Promise.all(
        users.map((user) =>
          this.prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              education: {
                disconnect: true,
              },
            },
          }),
        ),
      );

      await this.prisma.education.delete({
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
