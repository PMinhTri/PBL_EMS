import { Module } from '@nestjs/common';
import { TimeSheetController } from './timeSheet.controller';
import { TimeSheetService } from './timeSheet.service';

@Module({
  controllers: [TimeSheetController],
  providers: [TimeSheetService],
})
export class TimeSheetModule {}
