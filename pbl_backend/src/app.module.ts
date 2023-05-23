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
import { RoleModule } from './module/role/Role.module';
import { RolesGuard } from './module/role/role.guard';
import { JobInformationModule } from './module/jobInformation/jobInformation.module';
import { ProjectModule } from './module/project/project.module';
import { JobTitleModule } from './module/jobTitle/jobTitle.module';
import { DepartmentModule } from './module/department/department.module';
import { PayrollModule } from './module/payroll/payroll.module';
import { LeaveModule } from './module/leave/leave.module';
// import { TimeSheetModule } from './module/timeSheet/timeSheet.module';
@Module({
  imports: [
    AuthModule,
    UserModule,
    RoleModule,
    JobInformationModule,
    // TimeSheetModule,
    JobTitleModule,
    PayrollModule,
    DepartmentModule,
    ProjectModule,
    LeaveModule,
    MailModule,
    PrismaModule,
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
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
