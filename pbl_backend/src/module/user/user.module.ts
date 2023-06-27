import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JobInformationService } from '../jobInformation/jobInformation.service';

@Module({
  controllers: [UserController],
  providers: [UserService, JobInformationService],
})
export class UserModule {}
