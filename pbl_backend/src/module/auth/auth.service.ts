import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, ChangePasswordDto } from './auth.dto';
import { User } from '@prisma/client';
import {
  ServiceFailure,
  ServiceResponse,
  ServiceResponseStatus,
} from 'src/serviceResponse';
import { AuthenticationFailure } from 'src/enumTypes/failure.enum';
import { MailService } from 'src/mail/mail.service';
import { RoleService } from '../role/role.service';
import {
  autoGeneratedPassword,
  hashPassword,
  verifyPassword,
} from 'src/utils/password';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
    private roleService: RoleService,
  ) {}

  public async authenticate(
    dto: LoginDto,
  ): Promise<ServiceResponse<string, ServiceFailure<AuthenticationFailure>>> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: AuthenticationFailure.USER_NOT_FOUND,
        },
      };
    }

    const matchPassword = await verifyPassword(user.password, dto.password);

    if (!matchPassword) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: AuthenticationFailure.INCORRECT_PASSWORD,
        },
      };
    }

    const tokenData = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roleId: user.roleId,
    } as User;

    const token = await this.generateToken(tokenData);

    return {
      status: ServiceResponseStatus.Success,
      result: token,
    };
  }

  private async generateToken(user: User) {
    const { result: role } = await this.roleService.getById(user.roleId);

    const payload = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: role.name,
    };

    const secret: string = process.env.JWT_SECRET;
    const expiresIn: string = process.env.JWT_EXPIRE_IN;

    const accessToken = this.jwtService.signAsync(payload, {
      secret: secret,
      expiresIn: expiresIn,
    });

    return accessToken;
  }

  public async changePassword(
    dto: ChangePasswordDto,
  ): Promise<
    ServiceResponse<{ password: string }, ServiceFailure<AuthenticationFailure>>
  > {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: AuthenticationFailure.USER_NOT_FOUND,
        },
      };
    }

    const matchPassword = await verifyPassword(user.password, dto.oldPassword);

    if (!matchPassword) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: AuthenticationFailure.INCORRECT_PASSWORD,
        },
      };
    }

    if (dto.password !== dto.confirmPassword) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: AuthenticationFailure.PASSWORDS_DO_NOT_MATCH,
        },
      };
    }

    const newPassword = await hashPassword(dto.password);

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: newPassword,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: {
        password: updatedUser.password,
      },
    };
  }

  public async sendResetPasswordEmail(
    email: string,
  ): Promise<ServiceResponse<string, ServiceFailure<AuthenticationFailure>>> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: AuthenticationFailure.USER_NOT_FOUND,
        },
      };
    }

    const generatedPassword = autoGeneratedPassword();
    const newPassword = await hashPassword(generatedPassword);

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: newPassword,
      },
    });

    try {
      await this.mailService.receiveOnResetPassword(email, generatedPassword);
    } catch (error) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: error,
        },
      };
    }

    return {
      status: ServiceResponseStatus.Success,
    };
  }
}
