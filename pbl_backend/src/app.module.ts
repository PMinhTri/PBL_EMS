import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';
@Module({
  imports: [AuthModule, UserModule, MailModule, PrismaModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude({
        path: 'auth/login',
        method: RequestMethod.POST,
      })
      .forRoutes('*');
  }
}
