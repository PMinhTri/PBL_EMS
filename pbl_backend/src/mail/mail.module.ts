import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { Mailer } from './mailer';

@Global()
@Module({
  imports: [Mailer],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
