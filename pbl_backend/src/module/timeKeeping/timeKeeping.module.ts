import { Module } from '@nestjs/common';
import { TimeKeepingController } from './timeKeeping.controller';
import { TimeKeepingService } from './timeKeeping.service';

@Module({
  controllers: [TimeKeepingController],
  providers: [TimeKeepingService],
})
export class TimeKeepingModule {}
