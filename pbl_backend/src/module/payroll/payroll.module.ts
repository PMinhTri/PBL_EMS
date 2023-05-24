import { Module } from '@nestjs/common';

import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';
import { TimeSheetService } from '../timeSheet/timeSheet.service';

@Module({
  controllers: [PayrollController],
  providers: [PayrollService, TimeSheetService],
})
export class PayrollModule {}
