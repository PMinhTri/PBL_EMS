import { Module } from '@nestjs/common';
import { JobTitleController } from './jobTitle.Controller';
import { JobTitleService } from './jobTitle.service';

@Module({
  controllers: [JobTitleController],
  providers: [JobTitleService],
})
export class JobTitleModule {}
