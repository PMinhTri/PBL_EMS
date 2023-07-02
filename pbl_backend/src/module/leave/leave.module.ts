import { Module } from '@nestjs/common';

import { LeaveController } from './leave.controller';
import { LeaveService } from './leave.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  controllers: [LeaveController],
  providers: [LeaveService, MailService],
})
export class LeaveModule {}
