import { Module } from '@nestjs/common';

import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';
import { TimeSheetService } from '../timeSheet/timeSheet.service';
import { LeaveService } from '../leave/leave.service';

@Module({
  controllers: [PayrollController],
  providers: [PayrollService, TimeSheetService, LeaveService],
})
export class PayrollModule {}
