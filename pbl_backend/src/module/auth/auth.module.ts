import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { RoleService } from '../role/role.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, RoleService, JwtService],
})
export class AuthModule {}
