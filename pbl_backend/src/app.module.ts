import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
@Module({
  imports: [AuthModule, UserModule, MailModule, PrismaModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude(
        {
          path: 'auth/login',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/forgot-password',
          method: RequestMethod.POST,
        },
      )
      .forRoutes('*');
  }
}
