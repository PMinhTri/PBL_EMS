import { Module } from '@nestjs/common';
import { JobInformationService } from './jobInformation.service';
import { JobInformationController } from './jobInformation.controller';

@Module({
  controllers: [JobInformationController],
  providers: [JobInformationService],
})
export class JobInformationModule {}
