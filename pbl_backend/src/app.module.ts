import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
@Module({
  imports: [AuthModule, UserModule, MailModule, PrismaModule],
})
export class AppModule {}
