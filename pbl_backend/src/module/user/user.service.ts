import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createUserDto, userInformationDto } from './user.dto';
import {
  ServiceFailure,
  ServiceResponse,
  ServiceResponseStatus,
} from 'src/serviceResponse';
import { UserFailure } from 'src/enumTypes/failure.enum';
import { MailService } from 'src/mail/mail.service';
import { autoGeneratedPassword, hashPassword } from 'src/utils/password';
import { UserInformation } from './user.type';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  public async createUser(
    dto: createUserDto,
  ): Promise<
    ServiceResponse<
      { user: createUserDto; password: string },
      ServiceFailure<UserFailure>
    >
  > {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingUser) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: UserFailure.USER_ALREADY_EXISTS,
        },
      };
    }
    const generatedPassword = autoGeneratedPassword();
    const hashedPassword = await hashPassword(generatedPassword);

    try {
      await this.mailService.receiveDefaultPassword(
        dto.email,
        generatedPassword,
      );
    } catch (err) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: err,
        },
      };
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        password: hashedPassword,
        gender: dto.gender,
        status: dto.status,
        role: {
          connect: {
            id: dto.roleId,
          },
        },
      },

      select: {
        id: true,
        email: true,
        fullName: true,
        gender: true,
        status: true,
        roleId: true,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: { user, password: generatedPassword },
    };
  }

  public async getAllEmails(): Promise<string[]> {
    const emails = await this.prisma.user.findMany({
      select: {
        email: true,
      },
    });

    return emails.map((email) => email.email);
  }

  public async updatePersonalInformation(
    id: string,
    dto: Partial<userInformationDto>,
  ): Promise<ServiceResponse<User, ServiceFailure<UserFailure>>> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: UserFailure.USER_NOT_FOUND,
        },
      };
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        fullName: dto.fullName,
        gender: dto.gender,
        dateOfBirth: new Date(dto.dateOfBirth),
        phoneNumber: dto.phoneNumber,
        citizenId: dto.citizenId,
        address: dto.address,
        city: dto.city,
        nationality: dto.nationality,
        education: {
          connect: {
            id: dto.educationId,
          },
        },
      },
    });

    return {
      status: ServiceResponseStatus.Success,
    };
  }

  public async updateAvatar(id: string, avatar: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: UserFailure.USER_NOT_FOUND,
        },
      };
    }

    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        avatar: avatar,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
    };
  }

  public async getAllUsers(): Promise<
    ServiceResponse<userInformationDto[], ServiceFailure<UserFailure>>
  > {
    const userInformation = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        gender: true,
        dateOfBirth: true,
        phoneNumber: true,
        citizenId: true,
        address: true,
        city: true,
        nationality: true,
        avatar: true,
        status: true,
        role: {
          select: {
            name: true,
          },
        },
        education: {
          select: {
            grade: true,
          },
        },
        jobInformation: {
          select: {
            joinDate: true,
            employeeStatus: true,
            contractType: {
              select: {
                type: true,
              },
            },
            contractStartDate: true,
            contractEndDate: true,
            jobTitle: {
              select: {
                name: true,
              },
            },
            department: {
              select: {
                name: true,
              },
            },
            workingSkill: {
              select: {
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: userInformation,
    };
  }

  public async getById(
    id: string,
  ): Promise<ServiceResponse<UserInformation, ServiceFailure<UserFailure>>> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        gender: true,
        dateOfBirth: true,
        phoneNumber: true,
        address: true,
        citizenId: true,
        city: true,
        nationality: true,
        avatar: true,
        status: true,
        role: {
          select: {
            name: true,
          },
        },
        education: {
          select: {
            grade: true,
          },
        },
        jobInformation: {
          select: {
            joinDate: true,
            employeeStatus: true,
            contractType: {
              select: {
                type: true,
              },
            },
            contractStartDate: true,
            contractEndDate: true,
            jobTitle: {
              select: {
                name: true,
              },
            },
            department: {
              select: {
                name: true,
              },
            },
            workingSkill: {
              select: {
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: UserFailure.USER_NOT_FOUND,
        },
      };
    }

    return {
      status: ServiceResponseStatus.Success,
      result: user,
    };
  }

  public async deleteById(
    id: string,
  ): Promise<ServiceResponse<User, ServiceFailure<UserFailure>>> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        jobInformation: true,
      },
    });

    if (!user) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: UserFailure.USER_NOT_FOUND,
        },
      };
    }

    await this.prisma.jobInformation.deleteMany({
      where: {
        userId: id,
      },
    });

    await this.prisma.user.delete({
      where: {
        id: id,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: user,
    };
  }
}
