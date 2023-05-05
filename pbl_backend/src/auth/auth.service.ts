import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, ResetPasswordDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { User } from '@prisma/client';
import {
  ServiceFailure,
  ServiceResponse,
  ServiceResponseStatus,
} from 'src/serviceResponse';
import { AuthenticationFailure } from 'src/enumTypes/enumFailures/auth.failure.enum';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async authenticate(
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

    const matchPassword = await argon.verify(user.password, dto.password);

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
    const payload = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.roleId,
    };

    const secret: string = process.env.JWT_SECRET;
    const expiresIn: string = process.env.JWT_EXPIRE_IN;

    const accessToken = this.jwtService.signAsync(payload, {
      secret: secret,
      expiresIn: expiresIn,
    });

    return accessToken;
  }

  async resetPassword(
    dto: ResetPasswordDto,
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

    if (dto.password !== dto.confirmPassword) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: AuthenticationFailure.PASSWORDS_DO_NOT_MATCH,
        },
      };
    }

    const generateSalt = randomBytes(16);
    const newPassword = await argon.hash(dto.password, {
      salt: generateSalt,
      saltLength: 16,
    });

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
}
