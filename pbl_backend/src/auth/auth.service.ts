import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, createUserDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { User } from '@prisma/client';
import {
  ServiceFailure,
  ServiceResponse,
  ServiceResponseStatus,
} from 'src/serviceResponse';
import { AuthenticationFailure } from 'src/enumTypes/enumFailures/auth.failure.enum';
import { CreateUserFailure } from 'src/enumTypes/enumFailures/user.failure.enum';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  async createUser(
    dto: createUserDto,
  ): Promise<
    ServiceResponse<
      Pick<User, 'id' | 'email' | 'fullName' | 'roleId'>,
      ServiceFailure<CreateUserFailure>
    >
  > {
    const hashedPassword = await argon.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        password: hashedPassword,
        roleId: dto.roleId,
      },

      select: {
        id: true,
        email: true,
        fullName: true,
        roleId: true,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: user,
    };
  }

  async authentication(
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
      email: user.email,
      fullName: user.fullName,
      id: user.id,
      roleId: user.roleId,
    };

    const privateKey: string = process.env.JWT_SECRET_KEY;
    const expiresIn: string = process.env.JWT_EXPIRE_IN;

    const token = await this.jwt.sign(payload, {
      privateKey: privateKey,
      expiresIn: expiresIn,
    });

    return token;
  }
}
